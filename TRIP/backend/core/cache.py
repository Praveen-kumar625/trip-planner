"""Caching layer with Redis backend and stale-data fallback."""

from __future__ import annotations

import json
import logging
import time
from typing import Any, Optional

import redis.asyncio as redis
from backend.core.env import settings

logger = logging.getLogger(__name__)

class CacheService:
    """"""
    def __init__(self, redis_url: str):
        self.redis_url = redis_url
        self._client: Optional[redis.Redis] = None
        self._init_attempted = False

    async def get_client(self) -> Optional[redis.Redis]:
        if self._client:
            return self._client
        
        if self._init_attempted and not self._client:
            return None
            
        self._init_attempted = True
        try:
            self._client = redis.from_url(
                self.redis_url,
                decode_responses=True,
                socket_connect_timeout=2,
                socket_timeout=1,
            )
            await self._client.ping()
            logger.info("Redis Cache is connected: %s", self.redis_url.split("@")[-1] if "@" in self.redis_url else self.redis_url)
            return self._client
        except Exception as exc:
            logger.warning("Redis Connection failed, caching disabled: %s", exc)
            self._client = None
            return None

    async def get_cached(self, key: str, *, ignore_ttl: bool = False) -> Any | None:
        r = await self.get_client()
        if r is None:
            return None
        try:
            raw = await r.get(key)
            if raw is None:
                return None
            envelope = json.loads(raw)
            if isinstance(envelope, dict) and "_data" in envelope:
                if not ignore_ttl:
                    expires_at = envelope.get("_expires_at", 0)
                    if time.time() > expires_at:
                        return None
                return envelope["_data"]
            return envelope
        except Exception as exc:
            logger.debug("Cache read failed [%s]: %s", key, exc)
        return None

    async def set_cached(self, key: str, value: Any, ttl_seconds: int) -> None:
        r = await self.get_client()
        if r is None:
            return
        try:
            envelope = {
                "_data": value,
                "_expires_at": time.time() + ttl_seconds,
            }
            redis_ttl = max(ttl_seconds, 30 * 86400)
            await r.setex(key, redis_ttl, json.dumps(envelope, ensure_ascii=False))
        except Exception as exc:
            logger.debug("Cache write failed [%s]: %s", key, exc)

    async def close(self):
        if self._client:
            await self._client.close()


cache_service = CacheService(settings.REDIS_URL)

# Legacy compatibility wrappers (Sync versions if needed, but aiming for async)
def get_cached(key: str, **kwargs) -> Any | None:
    # This is a bit of a hack for sync legacy code, ideally all should be async
    import asyncio
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            return None # Can't easily run async in running loop from sync
    except Exception:
        pass
    return asyncio.run(cache_service.get_cached(key, **kwargs))

def set_cached(key: str, value: Any, ttl_seconds: int) -> None:
    import asyncio
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            return
    except Exception:
        pass
    asyncio.run(cache_service.set_cached(key, value, ttl_seconds))

def weather_cache_key(city: str) -> str:
    return f"tripagent:weather:{city}"

def poi_cache_key(city: str, keyword: str) -> str:
    return f"tripagent:poi:{city}:{keyword}"

WEATHER_TTL = 4 * 3600
POI_TTL = 12 * 3600
