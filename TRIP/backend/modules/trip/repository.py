""""""

from __future__ import annotations

import json
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from backend.core.memory import (
    load_itinerary,
    save_itinerary,
    update_plan_json,
    save_pending_modification,
    load_pending_modification,
    delete_pending_modification
)


class TripRepository:
    """"""
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, plan_id: str) -> Optional[dict]:
        return await load_itinerary(plan_id, self.session)

    async def get_owner_id(self, plan_id: str) -> Optional[str]:
        result = await self.session.execute(
            text("SELECT user_id FROM itineraries WHERE id = :id"),
            {"id": plan_id}
        )
        row = result.fetchone()
        return row[0] if row else None

    async def save(self, user_id: str, plan: dict, query: str, **kwargs) -> str:
        return await save_itinerary(user_id, plan, query, self.session, **kwargs)

    async def update_plan(self, plan_id: str, user_id: str, plan: dict) -> bool:
        return await update_plan_json(plan_id, user_id, plan, self.session)

    async def save_pending(self, user_id: str, state: dict) -> str:
        return await save_pending_modification(user_id, state, self.session)

    async def load_pending(self, pending_id: str) -> Optional[dict]:
        return await load_pending_modification(pending_id, self.session)

    async def delete_pending(self, pending_id: str) -> None:
        await delete_pending_modification(pending_id, self.session)
