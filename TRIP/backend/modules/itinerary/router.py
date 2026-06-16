""""""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_session
from backend.core.security import SecurityService
from backend.modules.itinerary.repository import ItineraryRepository
from backend.modules.itinerary.service import ItineraryService

router = APIRouter(prefix="/api/history", tags=["history"])


@router.get("")
async def get_history(
    user_id: str = Depends(SecurityService.get_current_user_id),
    session: AsyncSession = Depends(get_session)
):
    repo = ItineraryRepository(session)
    service = ItineraryService(repo)
    
    try:
        return await service.get_history(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.get("/{plan_id}")
async def get_itinerary(
    plan_id: str, 
    user_id: str = Depends(SecurityService.get_current_user_id),
    session: AsyncSession = Depends(get_session)
):
    await SecurityService.verify_itinerary_owner(plan_id, user_id, session)
    
    repo = ItineraryRepository(session)
    service = ItineraryService(repo)
    
    try:
        return await service.get_itinerary(user_id, plan_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
