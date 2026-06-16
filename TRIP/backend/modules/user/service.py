""""""

from __future__ import annotations

from backend.modules.user.repository import UserRepository


class UserService:
    """"""
    def __init__(self, repository: UserRepository):
        self.repo = repository

    async def get_profile_with_stats(self, user_id: str) -> dict:
        profile = await self.repo.get_profile(user_id)
        profile["trip_count"] = await self.repo.get_trip_count(user_id)
        return profile

    async def update_profile(self, user_id: str, profile_data: dict) -> dict:
        await self.repo.update_profile(user_id, profile_data)
        return await self.get_profile_with_stats(user_id)
