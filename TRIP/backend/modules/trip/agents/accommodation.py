from typing import Any
from pydantic import BaseModel, Field
from backend.llm.factory import build_structured_llm
from backend.modules.trip.schemas import TravelPlanState
from backend.modules.trip.helpers import async_invoke_structured

class AccommodationRecommendation(BaseModel):
    reasoning: str = Field(description="Reasoning about the geographic center of the trip and ideal base")
    accommodation_area: str = Field(description="Recommended neighborhood or area to stay in")

ACCOMMODATION_SYSTEM = (
    "You are an accommodation planning expert. Given a travel itinerary, destination, and user preferences, "
    "recommend the best neighborhood or area to stay in as a home base."
)

def make_accommodation_node(model_name: str | None):
    llm = build_structured_llm(AccommodationRecommendation, model=model_name, temperature=0)

    def accommodation_node(state: TravelPlanState):
        raise NotImplementedError("Use async_accommodation_node instead")

    async def async_accommodation_node(state: TravelPlanState) -> dict[str, Any]:
        lines: list[str] = []
        for day in state.route:
            day_no = day.get("day")
            for spot in day.get("spots", []):
                lines.append(f"  Day{day_no}: {spot.get('name')}")
        
        route_text = "\n".join(lines)
        
        prompt = (
            f"Destination: {state.destination}\n"
            f"Accommodation preference: {state.accommodation_pref or 'None specified'}\n\n"
            f"Itinerary spots:\n{route_text}\n\n"
            f"Based on the locations of these spots, which neighborhood/area would be the best base "
            f"to minimize travel time and match preferences?"
        )
        
        try:
            result: AccommodationRecommendation = await async_invoke_structured(
                llm, [("system", ACCOMMODATION_SYSTEM), ("human", prompt)]
            )
        except RuntimeError:
            return {"history": state.history + ["accommodation: LLM failed"]}

        # Update each day with the accommodation recommendation for simplicity, 
        # or just add to the general state. But DayRoute has accommodation_area.
        new_route = []
        for day in state.route:
            d = day.copy()
            d["accommodation_area"] = result.accommodation_area
            new_route.append(d)
            
        note = f"accommodation: recommended {result.accommodation_area}"
        return {"route": new_route, "history": state.history + [note]}

    return async_accommodation_node
