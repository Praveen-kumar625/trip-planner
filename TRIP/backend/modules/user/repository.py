""""""

from __future__ import annotations

from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from backend.core.memory import get_user_profile, set_user_profile


class UserRepository:
    """"""
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_profile(self, user_id: str) -> dict:
        return await get_user_profile(user_id, self.session)

    async def update_profile(self, user_id: str, profile: dict) -> None:
        await set_user_profile(user_id, profile, self.session)

    async def get_trip_count(self, user_id: str) -> int:
        result = await self.session.execute(
            text("SELECT COUNT(*) FROM itineraries WHERE user_id = :user_id"),
            {"user_id": user_id},
        )
        row = result.fetchone()
        return row[0] if row else 0
