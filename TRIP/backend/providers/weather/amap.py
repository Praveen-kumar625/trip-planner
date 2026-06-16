""""""
from __future__ import annotations

import urllib.parse
from typing import Any

from backend.core.cache import cache_service, weather_cache_key, WEATHER_TTL
from backend.core.http import http_get_json, async_http_get_json

AMAP_WEATHER_URL = "https://restapi.amap.com/v3/weather/weatherInfo"
BAD_WEATHER_KEYWORDS = {"EN", "EN", "EN", "EN", "EN", "EN"}


def _is_bad(weather: str) -> bool:
    """"""
    return any(kw in weather for kw in BAD_WEATHER_KEYWORDS)


async def fetch_forecast_async(city: str, api_key: str) -> list[dict[str, Any]]:
    """"""
    cache_key = weather_cache_key(city)
    cached = await cache_service.get_cached(cache_key)
    if cached is not None:
        return cached

    params = {
        "key": api_key,
        "city": city,
        "extensions": "all",
        "output": "json",
    }
    url = f"{AMAP_WEATHER_URL}?{urllib.parse.urlencode(params)}"

    try:
        data = await async_http_get_json(url)
    except Exception:
        return []

    if data.get("status") != "1":
        return []

    forecasts = data.get("forecasts") or []
    if not forecasts or not isinstance(forecasts, list):
        return []

    casts = forecasts[0].get("casts") or []
    result: list[dict[str, Any]] = []
    for c in casts:
        d = str(c.get("date", "")).strip()
        if not d:
            continue
        day_w   = str(c.get("dayweather",   "")).strip()
        night_w = str(c.get("nightweather", "")).strip()
        result.append({
            "date":          d,
            "day_weather":   day_w,
            "night_weather": night_w,
            "day_temp":      str(c.get("daytemp",   "")).strip(),
            "night_temp":    str(c.get("nighttemp", "")).strip(),
            "is_bad":        _is_bad(day_w) or _is_bad(night_w),
        })

    if result:
        await cache_service.set_cached(cache_key, result, WEATHER_TTL)
    return result

# Synchronous version kept for legacy compatibility if needed
def fetch_forecast(city: str, api_key: str) -> list[dict[str, Any]]:
    import asyncio
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            return [] # Avoid blocking
    except Exception:
        pass
    return asyncio.run(fetch_forecast_async(city, api_key))
