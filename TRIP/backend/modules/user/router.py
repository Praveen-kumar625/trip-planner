""""""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_session
from backend.core.security import SecurityService
from backend.modules.user.repository import UserRepository
from backend.modules.user.service import UserService

router = APIRouter(prefix="/api/profile", tags=["profile"])


class ProfileUpdate(BaseModel):
    attraction_prefs: list[str] = []
    food_prefs: list[str] = []
    habit_prefs: list[str] = []
    visited_destinations: list[str] = []


@router.get("")
async def get_profile(
    user_id: str = Depends(SecurityService.get_current_user_id), 
    session: AsyncSession = Depends(get_session)
):
    repo = UserRepository(session)
    service = UserService(repo)
    
    try:
        return await service.get_profile_with_stats(user_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.put("")
async def update_profile(
    req: ProfileUpdate, 
    user_id: str = Depends(SecurityService.get_current_user_id), 
    session: AsyncSession = Depends(get_session)
):
    repo = UserRepository(session)
    service = UserService(repo)
    
    try:
        return await service.update_profile(user_id, req.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")
