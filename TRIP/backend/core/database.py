""""""

from __future__ import annotations

from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel, select # noqa: F401

from backend.core.env import settings

# Create async engine with pooling
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    future=True,
    # pooling settings for Postgres if URL is changed
    # pool_size=20,
    # max_overflow=10
)

async_session_maker = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def init_db() -> None:
    """"""
    async with engine.begin() as conn:
        # This will create tables based on SQLModel metadata
        # We need to import the models here or in the vertical slices
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """"""
    async with async_session_maker() as session:
        yield session


# Legacy context manager wrapper (refactor to Dependency Injection in routers later)
from contextlib import asynccontextmanager

@asynccontextmanager
async def get_conn():
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
