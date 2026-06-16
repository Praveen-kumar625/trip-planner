""""""

from __future__ import annotations

from typing import List, Any, Optional

from backend.modules.itinerary.repository import ItineraryRepository


class ItineraryService:
    """"""
    def __init__(self, repository: ItineraryRepository):
        self.repo = repository

    async def get_history(self, user_id: str) -> List[dict[str, Any]]:
        return await self.repo.list_by_user(user_id)

    async def get_itinerary(self, user_id: str, plan_id: str) -> dict:
        owner_id = await self.repo.get_owner_id(plan_id)
        if not owner_id:
            raise ValueError("Trip plan not found")
        if owner_id != user_id:
            raise PermissionError("Access denied")
            
        data = await self.repo.get_by_id(plan_id)
        if not data:
            raise ValueError("Trip plan data not found")
        return data
