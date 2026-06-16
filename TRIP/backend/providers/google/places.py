"""Google Maps Platform POI and Search helpers."""

from __future__ import annotations

import logging
import googlemaps
from typing import Any, List, Optional

from backend.core.cache import cache_service, poi_cache_key, POI_TTL
from backend.core.env import settings

logger = logging.getLogger(__name__)

class GoogleMapsClient:
    """"""
    def __init__(self, api_key: str):
        self.api_key = api_key
        try:
            self.client = googlemaps.Client(key=api_key) if api_key else None
        except ValueError:
            self.client = None
            logger.warning("Invalid Google Maps API key provided. Client not initialized.")

    async def search_city_pois_async(
        self,
        city: str,
        keywords: str,
        types: str = "point_of_interest",
        limit: int = 10
    ) -> List[dict[str, Any]]:
        cache_key = poi_cache_key(city, f"{keywords}:{types}")
        cached = await cache_service.get_cached(cache_key)
        if cached:
            return cached

        # Run sync client in thread pool
        import asyncio
        loop = asyncio.get_event_loop()
        try:
            # Google Maps Text Search
            response = await loop.run_in_executor(
                None, 
                lambda: self.client.places(query=f"{keywords} in {city}", type=types)
            )
            
            results = response.get("results", [])
            parsed_results = []
            for place in results[:limit]:
                parsed_results.append(self.parse_google_place(place))
                
            await cache_service.set_cached(cache_key, parsed_results, POI_TTL)
            return parsed_results
        except Exception as e:
            logger.error("Google Maps Search failed: %s", e)
            return []

    async def search_around_pois_async(
        self,
        location: dict[str, float],
        radius: int = 1000,
        types: str = "point_of_interest",
        keyword: str = ""
    ) -> List[dict[str, Any]]:
        import asyncio
        loop = asyncio.get_event_loop()
        try:
            response = await loop.run_in_executor(
                None,
                lambda: self.client.places_nearby(
                    location=(location['lat'], location['lng']),
                    radius=radius,
                    type=types,
                    keyword=keyword
                )
            )
            
            results = response.get("results", [])
            return [self.parse_google_place(p) for p in results[:10]]
        except Exception as e:
            logger.error("Google Maps Nearby Search failed: %s", e)
            return []

    def parse_google_place(self, place: dict[str, Any]) -> dict[str, Any]:
        loc = place.get("geometry", {}).get("location", {})
        return {
            "name": place.get("name", ""),
            "rating": place.get("rating"),
            "location": {"lat": loc.get("lat"), "lng": loc.get("lng")},
            "address": place.get("formatted_address") or place.get("vicinity", ""),
            "photo": self.get_photo_url(place.get("photos", [{}])[0].get("photo_reference")),
            "types": place.get("types", []),
            "place_id": place.get("place_id"),
            "cost": place.get("price_level"), # 0-4
        }

    def get_photo_url(self, photo_reference: Optional[str]) -> Optional[str]:
        if not photo_reference:
            return None
        return f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={settings.GOOGLE_MAPS_API_KEY}"


google_maps_client = GoogleMapsClient(settings.GOOGLE_MAPS_API_KEY)
