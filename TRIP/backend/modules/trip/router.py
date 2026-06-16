""""""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Header, HTTPException, Request, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.auth import decode_token
from backend.core.database import get_session
from backend.core.security import SecurityService
from backend.core.cache import POI_TTL, cache_service, poi_cache_key
from backend.modules.trip.helpers import restaurant_to_dict
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


@router.get("/api/poi/search")
async def poi_search(
    city: str,
    kw: str,
    kind: str = "attraction",
    user_id: str = Depends(SecurityService.get_current_user_id),
):
    from backend.providers.google.places import google_maps_client
    
    if kind not in ("attraction", "restaurant"):
        raise HTTPException(status_code=400, detail="kind sirf attraction ya restaurant ho sakta hai")

    city = city.strip()
    kw = kw.strip().replace("\n", "").replace("\r", "").replace("\x00", "")
    if not city or not kw:
        raise HTTPException(status_code=400, detail="city aur kw dono zaruri hai")

    cache_key = poi_cache_key(city, f"manual:{kind}:{kw}")
    cached = await cache_service.get_cached(cache_key)
    if cached is not None:
        return {"results": cached}

    types = "point_of_interest" if kind == "attraction" else "restaurant"
    try:
        results = await google_maps_client.search_city_pois_async(city, kw, types=types, limit=8)
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))

    await cache_service.set_cached(cache_key, results, POI_TTL)
    return {"results": results}


@router.get("/api/route/walking")
async def route_walking(
    origin_lng: float,
    origin_lat: float,
    dest_lng: float,
    dest_lat: float,
    user_id: str = Depends(SecurityService.get_current_user_id),
):
    from backend.providers.google.directions import get_walking_route_async
    
    origin = {"lat": origin_lat, "lng": origin_lng}
    destination = {"lat": dest_lat, "lng": dest_lng}
    
    try:
        return await get_walking_route_async(origin, destination)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Google Maps request fail ho gaya: {e}")
