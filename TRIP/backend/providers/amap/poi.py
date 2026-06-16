"""AMap POI search helpers (async-first with sync wrappers)."""

from __future__ import annotations

import asyncio
import logging
import urllib.parse
from typing import Any

from backend.core.cache import cache_service, poi_cache_key, POI_TTL
from backend.core.http import async_http_get_json, http_get_json
from backend.providers.amap.client import (
    AMAP_AROUND_SEARCH_URL,
    AMAP_RATE_LIMIT_INFOS,
    AMAP_TEXT_SEARCH_URL,
    int_or_none,
)

logger = logging.getLogger(__name__)

ATTRACTION_TYPE = "Scenic spots"


# ── Async core search with stale-cache fallback ───────────────


async def _text_search_raw_async(
    url: str, *, fallback_cache_key: str | None = None
) -> list[dict[str, Any]]:
    """Async text search with retry + graceful fallback to stale cache on rate-limit."""
    for attempt in range(4):
        data = await async_http_get_json(url, max_retries=1)
        if data.get("status") == "1":
            pois = data.get("pois", [])
            return pois if isinstance(pois, list) else []
        info = str(data.get("info") or "Unknown error")
        if info not in AMAP_RATE_LIMIT_INFOS or attempt >= 3:
            # Before raising, try stale cache
            if fallback_cache_key:
                stale = await cache_service.get_cached(fallback_cache_key, ignore_ttl=True)
                if stale is not None:
                    logger.warning(
                        "AMap rate-limited (%s), serving stale cache for key=%s",
                        info, fallback_cache_key,
                    )
                    return stale
            logger.error(f"AMap search failed gracefully returning empty: {info}")
            return []
        await asyncio.sleep(1.2 * (attempt + 1))
    return []


# Sync wrapper for backward compatibility (used by planning nodes)
def _text_search_raw(url: str) -> list[dict[str, Any]]:
    """Synchronous fallback – used only by planning pipeline (runs in thread pool)."""
    import time
    for attempt in range(4):
        data = http_get_json(url)
        if data.get("status") == "1":
            pois = data.get("pois", [])
            return pois if isinstance(pois, list) else []
        info = str(data.get("info") or "Unknown error")
        if info not in AMAP_RATE_LIMIT_INFOS or attempt >= 3:
            logger.error(f"AMap search failed gracefully returning empty: {info}")
            return []
        time.sleep(1.2 * (attempt + 1))
    return []


# ── Async nearby search ───────────────────────────────────────


async def search_around_pois_async(
    location: dict[str, float],
    api_key: str,
    *,
    types: str = "",
    keyword: str = "",
    radius: int = 1000,
    offset: int = 6,
    max_retries: int = 3,
    fallback_cache_key: str | None = None,
) -> list[dict[str, Any]]:
    """Async nearby POI search."""
    params = {
        "key": api_key,
        "location": f"{location['lng']},{location['lat']}",
        "radius": str(radius),
        "offset": str(offset),
        "page": "1",
        "extensions": "all",
        "output": "json",
    }
    if types:
        params["types"] = types
    elif keyword:
        params["keywords"] = keyword
    url = f"{AMAP_AROUND_SEARCH_URL}?{urllib.parse.urlencode(params)}"
    for attempt in range(max_retries + 1):
        data = await async_http_get_json(url, max_retries=1)
        if data.get("status") == "1":
            pois = data.get("pois", [])
            return pois if isinstance(pois, list) else []
        info = str(data.get("info") or "Unknown error")
        if info not in AMAP_RATE_LIMIT_INFOS or attempt >= max_retries:
            if fallback_cache_key:
                stale = await cache_service.get_cached(fallback_cache_key, ignore_ttl=True)
                if stale is not None:
                    logger.warning("AMap nearby rate-limited, serving stale cache")
                    return stale
            logger.error(f"AMap nearby search failed gracefully returning empty: {info}")
            return []
        await asyncio.sleep(1.2 * (attempt + 1))
    return []


# Sync wrapper (used by planning pipeline)
def search_around_pois(
    location: dict[str, float],
    api_key: str,
    *,
    types: str = "",
    keyword: str = "",
    radius: int = 1000,
    offset: int = 6,
    max_retries: int = 3,
) -> list[dict[str, Any]]:
    import asyncio
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            return []
    except Exception:
        pass
    return asyncio.run(search_around_pois_async(location, api_key, types=types, keyword=keyword, radius=radius, offset=offset, max_retries=max_retries))


# ── Async city search ─────────────────────────────────────────


async def search_city_pois_async(
    city: str,
    api_key: str,
    *,
    keywords: str,
    types: str,
    offset: int = 8,
    fallback_cache_key: str | None = None,
) -> list[dict[str, Any]]:
    """Async city POI text search."""
    params: dict[str, str] = {
        "key": api_key,
        "keywords": keywords,
        "types": types,
        "city": city,
        "citylimit": "true",
        "offset": str(offset),
        "page": "1",
        "extensions": "all",
        "output": "json",
    }
    url = f"{AMAP_TEXT_SEARCH_URL}?{urllib.parse.urlencode(params)}"
    return await _text_search_raw_async(url, fallback_cache_key=fallback_cache_key)


# Sync wrapper
def search_city_pois(
    city: str,
    api_key: str,
    *,
    keywords: str,
    types: str,
    offset: int = 8,
) -> list[dict[str, Any]]:
    import asyncio
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            return []
    except Exception:
        pass
    return asyncio.run(search_city_pois_async(city, api_key, keywords=keywords, types=types, offset=offset))


# ── Attraction search (async) ────────────────


async def search_attraction_pois_async(
    city: str,
    api_key: str,
    *,
    keywords: str = "EN",
    offset: int = 25,
    page: int = 1,
) -> list[dict[str, Any]]:
    """Async attraction search."""
    cache_key = poi_cache_key(city, keywords) if page == 1 else None
    if cache_key is not None:
        cached = await cache_service.get_cached(cache_key)
        if cached is not None:
            return cached

    params: dict[str, str] = {
        "key": api_key,
        "keywords": keywords,
        "types": ATTRACTION_TYPE,
        "city": city,
        "citylimit": "true",
        "offset": str(offset),
        "page": str(page),
        "extensions": "all",
        "output": "json",
    }
    url = f"{AMAP_TEXT_SEARCH_URL}?{urllib.parse.urlencode(params)}"
    pois = await _text_search_raw_async(url)
    if page == 1 and pois:
        await cache_service.set_cached(cache_key, pois, POI_TTL)
    return pois


# Sync wrapper
def search_attraction_pois(
    city: str,
    api_key: str,
    *,
    keywords: str = "EN",
    offset: int = 25,
    page: int = 1,
) -> list[dict[str, Any]]:
    import asyncio
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            return []
    except Exception:
        pass
    return asyncio.run(search_attraction_pois_async(city, api_key, keywords=keywords, offset=offset, page=page))

# ── Pure utility functions (unchanged) ────────────────────────


def parse_location(value: Any) -> dict[str, float] | None:
    """Parse 'lng,lat' string into dict."""
    if not isinstance(value, str) or "," not in value:
        return None
    lng_text, lat_text = value.split(",", 1)
    try:
        return {"lng": float(lng_text), "lat": float(lat_text)}
    except ValueError:
        return None


def normalize_address(value: Any) -> str:
    """Normalize address field."""
    if isinstance(value, list):
        return " ".join(str(item) for item in value if item)
    return str(value or "")


def poi_to_spot(poi: dict[str, Any]) -> dict[str, Any] | None:
    """Convert raw AMap POI dict to a spot dict."""
    loc_str = poi.get("location", "")
    if not loc_str or "," not in loc_str:
        return None
    lng, lat = loc_str.split(",", 1)
    try:
        location = {"lng": float(lng), "lat": float(lat)}
    except ValueError:
        return None

    biz_ext = poi.get("biz_ext") or {}
    rating_raw = biz_ext.get("rating", "") if isinstance(biz_ext, dict) else ""
    try:
        rating: float | None = float(rating_raw) if rating_raw else None
    except ValueError:
        rating = None

    open_time: str | None = (
        str(biz_ext["opentime2"]).strip() if isinstance(biz_ext, dict) and biz_ext.get("opentime2") else None
    ) or (
        str(biz_ext["opentime"]).strip() if isinstance(biz_ext, dict) and biz_ext.get("opentime") else None
    ) or None

    photos = poi.get("photos") or []
    first_photo: str | None = None
    if isinstance(photos, list) and photos and isinstance(photos[0], dict):
        first_photo = str(photos[0].get("url", "")).strip() or None

    cost_raw = str(biz_ext.get("cost", "")).strip() if isinstance(biz_ext, dict) else ""

    return {
        "name": poi.get("name", ""),
        "rating": rating,
        "open_time": open_time,
        "location": location,
        "photo": first_photo,
        "adname": str(poi.get("adname") or ""),
        "address": normalize_address(poi.get("address", "")),
        "tel": str(poi.get("tel") or "").strip() or None,
        "cost": cost_raw or None,
    }
