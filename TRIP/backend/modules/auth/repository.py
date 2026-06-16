""""""

from __future__ import annotations

from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text


class AuthRepository:
    """"""
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_user_by_username(self, username: str) -> Optional[dict]:
        result = await self.session.execute(
            text("SELECT id, username, password_hash FROM users WHERE username = :username"),
            {"username": username},
        )
        row = result.fetchone()
        if row:
            return {"id": row[0], "username": row[1], "password_hash": row[2]}
        return None

    async def create_user(self, user_id: str, username: str, password_hash: str, created_at: str) -> None:
        await self.session.execute(
            text("INSERT INTO users (id, username, password_hash, created_at) VALUES (:id, :username, :password_hash, :created_at)"),
            {"id": user_id, "username": username, "password_hash": password_hash, "created_at": created_at},
        )
        await self.session.commit()
