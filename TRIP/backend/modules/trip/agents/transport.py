from typing import Any
from pydantic import BaseModel, Field
from backend.llm.factory import build_structured_llm
from backend.modules.trip.schemas import TravelPlanState
from backend.modules.trip.helpers import async_invoke_structured

class DailyTransit(BaseModel):
    day: int = Field(description="Which day")
    transit_info: str = Field(description="Summary of transit for the day, e.g., 'Subway Line 1 and some walking'")

class TransportRecommendation(BaseModel):
    reasoning: str = Field(description="Reasoning about transit modes")
    days_transit: list[DailyTransit] = Field(description="Transit info for each day")

TRANSPORT_SYSTEM = (
    "You are a local transport expert. Given a travel itinerary, destination, and user preferred transport mode, "
    "provide a realistic one-sentence transit summary for each day of the trip."
)

def make_transport_node(model_name: str | None):
    llm = build_structured_llm(TransportRecommendation, model=model_name, temperature=0)

    def transport_node(state: TravelPlanState):
        raise NotImplementedError("Use async_transport_node instead")

    async def async_transport_node(state: TravelPlanState) -> dict[str, Any]:
        lines: list[str] = []
        for day in state.route:
            day_no = day.get("day")
            for spot in day.get("spots", []):
                lines.append(f"  Day{day_no}: {spot.get('name')}")
        
        route_text = "\n".join(lines)
        
        prompt = (
            f"Destination: {state.destination}\n"
            f"Preferred transport mode: {state.transport_mode or 'None specified'}\n\n"
            f"Itinerary spots:\n{route_text}\n\n"
            f"Summarize the best transit approach for each day."
        )
        
        try:
            result: TransportRecommendation = await async_invoke_structured(
                llm, [("system", TRANSPORT_SYSTEM), ("human", prompt)]
            )
        except RuntimeError:
            return {"history": state.history + ["transport: LLM failed"]}

        transit_map = {dt.day: dt.transit_info for dt in result.days_transit}
        new_route = []
        for day in state.route:
            d = day.copy()
            d["transit_info"] = transit_map.get(day.get("day"), "Standard transit")
            new_route.append(d)
            
        note = f"transport: calculated for {len(result.days_transit)} days"
        return {"route": new_route, "history": state.history + [note]}

    return async_transport_node
