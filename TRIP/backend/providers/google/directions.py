"""Google Maps Platform Directions helper."""

from __future__ import annotations

import logging
from typing import Any, List, Optional
import asyncio

from backend.providers.google.places import google_maps_client

logger = logging.getLogger(__name__)

async def get_walking_route_async(
    origin: dict[str, float],
    destination: dict[str, float]
) -> dict[str, Any]:
    loop = asyncio.get_event_loop()
    try:
        response = await loop.run_in_executor(
            None,
            lambda: google_maps_client.client.directions(
                origin=(origin['lat'], origin['lng']),
                destination=(destination['lat'], destination['lng']),
                mode="walking"
            )
        )
        
        if not response:
            return {"coords": [], "distance": 0, "duration": 0}
            
        leg = response[0]["legs"][0]
        # Decode polyline - Google uses encoded polylines, 
        # but for simplicity we can use the overview_polyline or steps.
        # Let's extract points from steps.
        points = []
        for step in leg["steps"]:
            points.append([step["start_location"]["lng"], step["start_location"]["lat"]])
        points.append([leg["end_location"]["lng"], leg["end_location"]["lat"]])

        return {
            "coords": points,
            "distance": leg["distance"]["value"], # in meters
            "duration": leg["duration"]["value"], # in seconds
        }
    except Exception as e:
        logger.error("Google Maps Directions failed: %s", e)
        return {"coords": [], "distance": 0, "duration": 0}
