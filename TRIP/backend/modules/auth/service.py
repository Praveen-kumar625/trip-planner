""""""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Optional

from backend.core.auth import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token
)
from backend.modules.auth.repository import AuthRepository


class AuthService:
    """"""
    def __init__(self, repository: AuthRepository):
        self.repo = repository

    async def register(self, username: str, password: str) -> dict:
        existing = await self.repo.get_user_by_username(username)
        if existing:
            raise ValueError("Username already taken")

        user_id = str(uuid.uuid4())
        hashed = hash_password(password)
        now = datetime.now(timezone.utc).isoformat()
        
        await self.repo.create_user(user_id, username, hashed, now)
        
        return self._generate_auth_response(user_id, username)

    async def login(self, username: str, password: str) -> dict:
        user = await self.repo.get_user_by_username(username)
        if not user or not verify_password(password, user["password_hash"]):
            raise ValueError("Invalid username or password")

        return self._generate_auth_response(user["id"], user["username"])

    def _generate_auth_response(self, user_id: str, username: str) -> dict:
        access_token = create_access_token(data={"sub": user_id})
        refresh_token = create_refresh_token(data={"sub": user_id})
        
        return {
            "user_id": user_id,
            "username": username,
            "access_token": access_token,
            "refresh_token": refresh_token
        }
