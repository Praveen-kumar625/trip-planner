import asyncio
import logging
from typing import Any, List

from backend.modules.trip.schemas import TravelPlanState, CitySegment
from backend.modules.trip.agents.planner import make_planner_node, attraction_search_node
from backend.modules.trip.helpers import amap_key, fetch_city_spots_async, filter_by_rating

logger = logging.getLogger(__name__)

def make_orchestrator_node(model_name: str | None):
    planner_node = make_planner_node(model_name)

    async def orchestrator(state: TravelPlanState) -> dict[str, Any]:
        if not state.destinations:
            # Fallback for single destination if destinations list is empty
            return await planner_node(state)

        logger.info("[orchestrator] Planning for %d cities", len(state.destinations))
        
        tasks = []
        for segment in state.destinations:
            tasks.append(_plan_city_segment(segment, state, model_name))
        
        # Parallel execution of city planning
        results = await asyncio.gather(*tasks)
        
        # Merge results into a master itinerary
        master_route = []
        master_pois = []
        master_history = list(state.history)
        
        for res in results:
            master_route.extend(res["route"])
            master_pois.extend(res["pois"])
            master_history.extend(res["history"])
            
        return {
            "route": master_route,
            "pois": master_pois,
            "history": master_history + [f"[orchestrator] Merged plans for {len(results)} cities"],
        }

    return orchestrator

async def _plan_city_segment(segment: CitySegment, state: TravelPlanState, model_name: str | None) -> dict[str, Any]:
    # This worker "simulates" a sub-graph run for a single city
    logger.info("[worker] Planning city: %s for %d days", segment.city, segment.days)
    
    # 1. Fetch POIs for this city
    api_key = amap_key()
    spots = await fetch_city_spots_async(segment.city, api_key, max_spots=state.max_spots)
    kept, _ = filter_by_rating(spots, state.min_rating)
    
    # 2. Run planner logic for this segment
    # We create a localized state for the planner node
    local_state = state.model_copy(update={
        "destination": segment.city,
        "days": segment.days,
        "travel_start_date": segment.start_date,
        "travel_end_date": segment.end_date,
        "pois": kept,
        "route": [], # Start fresh for this city
    })
    
    planner_node = make_planner_node(model_name)
    result = await planner_node(local_state)
    
    # Adjust day numbers in the resulting route to match the master sequence
    # This is a bit complex as the planner returns day 1, 2...
    # We need to offset them based on the segment's position.
    # For now, let's assume the synthesizer will handle absolute ordering.
    
    return {
        "route": result["route"],
        "pois": kept,
        "history": [f"[worker:{segment.city}] Plan complete"],
    }
