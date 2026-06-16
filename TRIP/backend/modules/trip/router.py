""""""

from __future__ import annotations

import json
from typing import Optional

from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_session
from backend.core.security import SecurityService
from backend.core.cache import POI_TTL, get_cached, poi_cache_key, set_cached
from backend.modules.trip.helpers import amap_key, restaurant_to_dict
from backend.providers.amap.poi import (
    ATTRACTION_TYPE,
    normalize_address,
    poi_to_spot,
    search_around_pois_async,
    search_city_pois_async,
)
from backend.modules.trip.repository import TripRepository
from backend.modules.trip.service import TripService

router = APIRouter(tags=["trip"])


class PlanRequest(BaseModel):
    query: str
    max_per_day: int = 5
    min_rating: float = 4.5
    max_spots: int = 30
    max_review_rounds: int = 3
    thread_id: Optional[str] = None
    plan_id: Optional[str] = None
    modification_notes: Optional[str] = None


@router.post('/api/plan/stream')
async def create_plan_stream(
    req: PlanRequest, 
    user_id: str = Depends(SecurityService.get_current_user_id), 
    session: AsyncSession = Depends(get_session)
):
    repo = TripRepository(session)
    service = TripService(repo)
    
    query = req.query
    if req.thread_id:
        from backend.core.thread_store import thread_store
        original = thread_store.get(req.thread_id)
        if original:
            query = f'{original}; additional request: {req.query}'
            thread_store.delete(req.thread_id)

    overrides = req.model_dump(exclude={"query", "thread_id", "plan_id", "modification_notes"})
    
    return StreamingResponse(
        service.run_itinerary_stream(
            user_id=user_id,
            query=query,
            parent_plan_id=req.plan_id,
            modification_notes=req.modification_notes,
            **overrides
        ),
        media_type='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no',
            'Connection': 'keep-alive',
        },
    )


class OptimizeDayRequest(BaseModel):
    plan_id: str
    day: int


@router.post("/api/plan/optimize_day")
async def optimize_day(
    req: OptimizeDayRequest, 
    user_id: str = Depends(SecurityService.get_current_user_id), 
    session: AsyncSession = Depends(get_session)
):
    await SecurityService.verify_itinerary_owner(req.plan_id, user_id, session)
    
    repo = TripRepository(session)
    service = TripService(repo)
    
    try:
        return await service.optimize_day(user_id, req.plan_id, req.day)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


class ConfirmModificationRequest(BaseModel):
    pending_id: str
    parent_plan_id: str | None = None


@router.post("/api/plan/confirm_modification")
async def confirm_modification(
    req: ConfirmModificationRequest, 
    user_id: str = Depends(SecurityService.get_current_user_id), 
    session: AsyncSession = Depends(get_session)
):
    repo = TripRepository(session)
    service = TripService(repo)

    return StreamingResponse(
        service.confirm_modification_stream(user_id, req.pending_id, req.parent_plan_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


@router.get("/api/poi/search")
async def poi_search(
    city: str,
    kw: str,
    kind: str = "attraction",
    user_id: str = Depends(SecurityService.get_current_user_id),
):
    if kind not in ("attraction", "restaurant"):
        raise HTTPException(status_code=400, detail="kind sirf attraction ya restaurant ho sakta hai")

    city = city.strip()
    kw = kw.strip().replace("\n", "").replace("\r", "").replace("\x00", "")
    if not city or not kw:
        raise HTTPException(status_code=400, detail="city aur kw dono zaruri hai")

    cache_key = poi_cache_key(city, f"manual:{kind}:{kw}")
    cached = get_cached(cache_key)
    if cached is not None:
        return {"results": cached}

    types = ATTRACTION_TYPE if kind == "attraction" else "catering services"
    try:
        raw = await search_city_pois_async(city, amap_key(), keywords=kw, types=types, offset=8)
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))

    results: list[dict] = []
    for poi in raw:
        parsed = poi_to_spot(poi) if kind == "attraction" else restaurant_to_dict(poi)
        if parsed:
            if kind == "attraction":
                parsed["address"] = normalize_address(poi.get("address"))
            results.append(parsed)

    set_cached(cache_key, results, POI_TTL)
    return {"results": results}


@router.get("/api/route/walking")
async def route_walking(
    origin_lng: float,
    origin_lat: float,
    dest_lng: float,
    dest_lat: float,
    user_id: str = Depends(SecurityService.get_current_user_id),
):
    import httpx
    key = amap_key()
    url = "https://restapi.amap.com/v3/direction/walking"
    params = {
        "key": key,
        "origin": f"{origin_lng},{origin_lat}",
        "destination": f"{dest_lng},{dest_lat}",
        "output": "json",
    }
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, params=params, timeout=8.0)
            resp.raise_for_status()
            data = resp.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Amap request fail ho gaya: {e}")

    if data.get("status") != "1" or not data.get("route", {}).get("paths"):
        raise HTTPException(status_code=502, detail="Walking route plan fail ho gaya")

    path = data["route"]["paths"][0]
    coords: list[list[float]] = []
    for step in path.get("steps", []):
        for pair in step.get("polyline", "").split(";"):
            parts = pair.strip().split(",")
            if len(parts) == 2:
                try:
                    coords.append([float(parts[0]), float(parts[1])])
                except ValueError: pass

    return {"coords": coords, "distance": path.get("distance"), "duration": path.get("duration")}
