""""""

from __future__ import annotations

from typing import Optional, List, Any

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from backend.core.memory import list_itineraries, load_itinerary


class ItineraryRepository:
    """"""
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_by_user(self, user_id: str) -> List[dict[str, Any]]:
        return await list_itineraries(user_id, self.session)

    async def get_by_id(self, plan_id: str) -> Optional[dict]:
        return await load_itinerary(plan_id, self.session)

    async def get_owner_id(self, plan_id: str) -> Optional[str]:
        result = await self.session.execute(
            text("SELECT user_id FROM itineraries WHERE id = :id"),
            {"id": plan_id}
        )
        row = result.fetchone()
        return row[0] if row else None
