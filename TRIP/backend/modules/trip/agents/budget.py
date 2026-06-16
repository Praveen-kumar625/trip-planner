import logging
from typing import Any
from pydantic import BaseModel, Field
from backend.llm.factory import build_structured_llm
from backend.modules.trip.schemas import TravelPlanState
from backend.modules.trip.helpers import async_invoke_structured
from backend.modules.trip.prompts import BUDGET_REVIEW_SYSTEM

logger = logging.getLogger(__name__)

class DailyBudget(BaseModel):
    day: int = Field(description="Which day")
    estimated_cost: int = Field(description="Estimated daily cost in local currency")

class BudgetReviewResult(BaseModel):
    reasoning: str = Field(description="Reasoning about the budget")
    total_budget: int = Field(description="Estimated total cost")
    days_budget: list[DailyBudget] = Field(description="Cost for each day")
    approved: bool = Field(description="Whether the plan meets the user's budget level")
    route_modify_opinion: str = Field(default="", description="Instructions to the planner if not approved")

def make_budget_node(model_name: str | None):
    llm = build_structured_llm(BudgetReviewResult, model=model_name, temperature=0)

    async def async_budget_node(state: TravelPlanState) -> dict[str, Any]:
        # Collect POI data and cost for the prompt
        lines: list[str] = []
        for day in state.route:
            day_no = day.get("day")
            for spot in day.get("spots", []):
                # Search for the POI in candidate pool to get its cost if available
                poi_info = next((p for p in state.pois if p["name"] == spot["name"]), {})
                cost = poi_info.get("cost", "Unknown")
                lines.append(f"  Day{day_no}: {spot.get('name')} | Est. Cost: {cost}")
        
        route_text = "\n".join(lines)
        
        prompt = (
            f"Destination: {state.destination}\n"
            f"User Budget Preference: {state.budget or 'Mid-range'}\n\n"
            f"Itinerary and POI costs:\n{route_text}\n\n"
            f"Review the budget and decide if it's acceptable."
        )
        
        try:
            result: BudgetReviewResult = await async_invoke_structured(
                llm, [("system", BUDGET_REVIEW_SYSTEM), ("human", prompt)]
            )
        except RuntimeError:
            logger.warning("[budget] LLM failed, using default estimation")
            return {"history": state.history + ["[budget] LLM failed, skipping review"]}

        budget_map = {db.day: db.estimated_cost for db in result.days_budget}
        new_route = []
        for day in state.route:
            d = day.copy()
            d["daily_budget_estimate"] = budget_map.get(day.get("day"), 0)
            new_route.append(d)
            
        note = f"[budget] Total estimated {result.total_budget} | Approved: {result.approved}"
        
        update = {
            "route": new_route,
            "history": state.history + [note],
            "approved": state.approved and result.approved # Only stay approved if both Reviewer and Budget approve
        }
        
        if not result.approved:
            update["route_modify_opinion"] = (state.route_modify_opinion or "") + f"\n[Budget Concern] {result.route_modify_opinion}"
            update["need_modify_route"] = True

        return update

    return async_budget_node
