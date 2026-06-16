"""OpenWeatherMap helper (International/Indian friendly)."""

from __future__ import annotations

import logging
from typing import Any, List, Optional
import asyncio
from pyowm import OWM

from backend.core.cache import cache_service, weather_cache_key, WEATHER_TTL
from backend.core.env import settings

logger = logging.getLogger(__name__)

owm = OWM(settings.OPENWEATHER_API_KEY)
mgr = owm.weather_manager()

async def fetch_forecast_async(city: str) -> List[dict[str, Any]]:
    cache_key = weather_cache_key(city)
    cached = await cache_service.get_cached(cache_key)
    if cached:
        return cached

    loop = asyncio.get_event_loop()
    try:
        # OpenWeatherMap forecast (3h segments)
        forecaster = await loop.run_in_executor(
            None,
            lambda: mgr.forecast_at_place(city, '3h')
        )
        
        forecast = forecaster.forecast
        result = []
        # Process and format to match our internal schema
        # ... logic to aggregate 3h segments into daily ...
        # (Simplified for now)
        for weather in forecast.weathers:
            result.append({
                "date": weather.reference_time('iso').split('T')[0],
                "day_weather": weather.detailed_status,
                "night_weather": weather.detailed_status,
                "day_temp": weather.temperature('celsius').get('day'),
                "night_temp": weather.temperature('celsius').get('night'),
                "is_bad": weather.detailed_status in ["thunderstorm", "heavy rain"]
            })
            
        await cache_service.set_cached(cache_key, result, WEATHER_TTL)
        return result
    except Exception as e:
        logger.error("Weather fetch failed: %s", e)
        return []
