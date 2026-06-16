""""""

from __future__ import annotations

from typing import Optional
from fastapi import HTTPException, status, Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.auth import decode_token, get_token_from_request
from backend.core.database import get_session
from backend.modules.trip.repository import TripRepository


class SecurityService:
    """"""
    @staticmethod
    async def get_current_user_id(request: Request) -> str:
        token = get_token_from_request(request)
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Login nahi kiya hai",
            )
        
        user_id = decode_token(token)
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token invalid ya expire ho gaya hai",
            )
        return user_id

    @staticmethod
    async def verify_itinerary_owner(
        plan_id: str,
        user_id: str = Depends(get_current_user_id),
        session: AsyncSession = Depends(get_session)
    ) -> None:
        repo = TripRepository(session)
        owner_id = await repo.get_owner_id(plan_id)
        
        if not owner_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Trip plan nahi mila"
            )
        
        if owner_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Aapko is trip ko access karne ki ijazat nahi hai"
            )
