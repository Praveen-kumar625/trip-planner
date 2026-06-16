""""""

from __future__ import annotations

import logging
import math
import re
import time
from datetime import date, timedelta
from typing import Any

from backend.core.env import settings
from backend.core.cache import cache_service

logger = logging.getLogger(__name__)


def haversine_km(loc1: dict[str, float], loc2: dict[str, float]) -> float:
    """Calculate the great circle distance between two points on the earth."""
    lat1, lon1 = loc1["lat"], loc1["lng"]
    lat2, lon2 = loc2["lat"], loc2["lng"]
    
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    
    a = math.sin(dphi / 2) ** 2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    
    return 6371 * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


async def fetch_city_spots_async(city: str, api_key: str, max_spots: int = 20) -> list[dict[str, Any]]:
    from backend.providers.google.places import google_maps_client
    return await google_maps_client.search_city_pois_async(city, "attractions", limit=max_spots)


async def fetch_weather_for_dates_async(city: str, start: date, end: date, api_key: str) -> tuple[list[dict[str, Any]], str | None]:
    from backend.providers.weather.openweather import fetch_forecast_async
    forecast = await fetch_forecast_async(city)
    
    # Filter for relevant dates
    filtered = [f for f in forecast if start.isoformat() <= f["date"] <= end.isoformat()]
    
    note = None
    bad_days = [f["date"] for f in filtered if f["is_bad"]]
    if bad_days:
        note = f"Alert: Potential bad weather (thunderstorm/heavy rain) on {', '.join(bad_days)}."
        
    return filtered, note


def format_spots_for_llm(spots: list[dict[str, Any]], cluster_map: dict[str, int]) -> str:
    lines = []
    for s in spots:
        zone = cluster_map.get(s["name"], 0)
        lines.append(f"- {s['name']} | Rating: {s.get('rating', 'N/A')} | Zone: {zone} | Address: {s.get('address', '')}")
    return "\n".join(lines)


def format_weather_for_llm(forecast: list[dict[str, Any]]) -> str:
    lines = []
    for f in forecast:
        lines.append(f"{f['date']}: {f['day_weather']} ({f['day_temp']}C)")
    return "\n".join(lines)


async def async_invoke_structured(llm: Any, messages: list[tuple[str, str]], *, retries: int = 3, cache_ttl: int = 3600) -> Any:
    import hashlib
    import json
    msg_str = json.dumps(messages, sort_keys=True)
    schema_name = getattr(getattr(llm, "schema", None), "__name__", "unknown")
    cache_key = f"llm_cache:{schema_name}:{hashlib.md5(msg_str.encode()).hexdigest()}"
    
    cached = await cache_service.get_cached(cache_key)
    if cached:
        logger.info("[async_invoke_structured] Cache hit for %s", schema_name)
        # If the LLM returned a pydantic object, we might need to reconstruct it here
        # For simplicity, returning raw dict if it was a dict
        return cached

    for attempt in range(retries):
        try:
            result = await llm.ainvoke(messages)
            if result is not None:
                res_dict = result.model_dump() if hasattr(result, "model_dump") else result
                await cache_service.set_cached(cache_key, res_dict, cache_ttl)
                return result
        except Exception as e:
            logger.warning("LLM call failed (attempt %d): %s", attempt + 1, e)
            
    raise RuntimeError(f"Structured ainvoke failed after {retries} retries")


def clean_pref(pref: str | None) -> str:
    if not pref: return ""
    return pref.strip().strip("[]\"'")


def parse_iso_date(date_str: str) -> date | None:
    if not date_str: return None
    try:
        return date.fromisoformat(date_str)
    except ValueError:
        return None

def invoke_structured(llm, messages, retries=3):
    return None

# Additional helper stubs as needed by planner
def cluster_pois_by_location(spots, days): return {s["name"]: 0 for s in spots}
def filter_by_rating(spots, min_rating): return [s for s in spots if (s.get("rating") or 0) >= min_rating], []
def unknown_spots(route, pois): return []
def restaurant_to_dict(p): return p
def dinner_anchor_spot(day, route): return None
def last_spot_of_period(day_items, period): return None
def spot_location_map(pois): return {}
