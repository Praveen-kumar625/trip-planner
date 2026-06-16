from concurrent.futures import ThreadPoolExecutor
from typing import Any

from backend.llm.factory import build_structured_llm
from backend.modules.trip.schemas import DayMealPick, SingleDayMealPick, TravelPlanState
from backend.modules.trip.helpers import amap_key, dinner_anchor_spot, last_spot_of_period, restaurant_to_dict, spot_location_map, async_invoke_structured
from backend.providers.amap.poi import search_around_pois_async
from backend.modules.trip.prompts import MEAL_SYSTEM
import asyncio

async def meal_search_node(state: TravelPlanState) -> dict[str, Any]:
    api_key  = amap_key()
    loc_map  = spot_location_map(state.pois)
    meal_candidates: list[dict[str, Any]] = []
    warnings: list[str] = []

    for day in state.route:
        day_no = day.get("day")
        entry: dict[str, Any] = {"day": day_no, "lunch": {}, "dinner": {}}

        lunch_anchor  = last_spot_of_period(day, "morning")
        dinner_anchor = dinner_anchor_spot(day)

        for meal, anchor in (("lunch", lunch_anchor), ("dinner", dinner_anchor)):
            center = loc_map.get(anchor["name"]) if anchor else None
            if not center:
                warnings.append(f"Day{day_no} {meal} No center spot coordinates")
                entry[meal] = {"anchor": anchor["name"] if anchor else None, "candidates": []}
                continue
            raw   = await search_around_pois_async(center, api_key, types="catering services", radius=1000, offset=20)
            cands = [r for r in (restaurant_to_dict(p) for p in raw) if r][:20]
            if not cands:
                warnings.append(f"Day{day_no} {meal} (near {anchor['name']}) No dining found")
            entry[meal] = {"anchor": anchor["name"], "center": center, "candidates": cands}
        meal_candidates.append(entry)

    note = "Nearby dining search complete" + (f" | Warnings: {'; '.join(warnings)}" if warnings else "")
    return {"meal_candidates": meal_candidates, "history": state.history + [note]}

def make_meal_recommend_node(model_name: str | None):
    llm = build_structured_llm(SingleDayMealPick, model=model_name, temperature=0)

    def meal_recommend(state: TravelPlanState):
        raise NotImplementedError("Use async_meal_recommend instead")

    async def async_meal_recommend(state: TravelPlanState) -> dict[str, Any]:
        def _top(cands: list[dict[str, Any]], n: int = 10) -> list[dict[str, Any]]:
            return sorted(cands, key=lambda c: -(c.get("rating") or 0))[:n]

        def _fmt(cands: list[dict[str, Any]]) -> str:
            if not cands:
                return "(No candidates)"
            return "\n".join(
                f"  · {c['name']} | Rating: {c['rating'] or 'N/A'} | Cost: {c['cost'] or 'N/A'}"
                f" | Tags: {c['keytag'] or 'N/A'}"
                for c in cands
            )

        async def _recommend_day(entry: dict[str, Any]) -> DayMealPick:
            lunch_cands  = _top(entry["lunch"].get("candidates", []))
            dinner_cands = _top(entry["dinner"].get("candidates", []))
            prompt = (
                f"Day {entry['day']} | User dining preference: {state.food_preference or 'No specific preference'}\n\n"
                f"Lunch candidates ({entry['lunch'].get('anchor')}  nearby):\n{_fmt(lunch_cands)}\n\n"
                f"Dinner candidates ({entry['dinner'].get('anchor')}  nearby):\n{_fmt(dinner_cands)}\n\n"
                "Pick the best lunch and dinner from the candidates."
            )
            try:
                r: SingleDayMealPick = await async_invoke_structured(
                    llm, [("system", MEAL_SYSTEM), ("human", prompt)], retries=5
                )
                return DayMealPick(day=entry["day"], **r.model_dump())
            except RuntimeError:
                def best(cands: list) -> str:
                    return cands[0]["name"] if cands else ""
                return DayMealPick(
                    day=entry["day"],
                    lunch_name=best(lunch_cands),
                    lunch_reason="Auto-picked: highest rated",
                    dinner_name=best(dinner_cands),
                    dinner_reason="Auto-picked: highest rated",
                )

        day_picks: list[DayMealPick] = await asyncio.gather(
            *[_recommend_day(entry) for entry in state.meal_candidates]
        )

        def _lookup(name: str, cands_dict: dict[str, Any], cands_list: list[dict]) -> dict | None:
            if name:
                for key, val in cands_dict.items():
                    if name in key or key in name:
                        return val
            return cands_list[0] if cands_list else None

        pick_map = {p.day: p for p in day_picks}
        meals: list[dict[str, Any]] = []
        for entry in state.meal_candidates:
            pick              = pick_map.get(entry["day"])
            lunch_cands_list  = sorted(entry["lunch"].get("candidates", []),  key=lambda c: -(c.get("rating") or 0))
            dinner_cands_list = sorted(entry["dinner"].get("candidates", []), key=lambda c: -(c.get("rating") or 0))
            lunch_cands       = {c["name"]: c for c in lunch_cands_list}
            dinner_cands      = {c["name"]: c for c in dinner_cands_list}
            lunch_info   = _lookup(pick.lunch_name,  lunch_cands,  lunch_cands_list)  if pick else None
            dinner_info  = _lookup(pick.dinner_name, dinner_cands, dinner_cands_list) if pick else None

            if lunch_info is not None:
                lunch_info  = {**lunch_info,  "reason": pick.lunch_reason}
            if dinner_info is not None:
                dinner_info = {**dinner_info, "reason": pick.dinner_reason}

            if (lunch_info is not None and dinner_info is not None
                    and pick and pick.lunch_name == pick.dinner_name):
                alt = next(
                    (c for c in sorted(
                        entry["dinner"].get("candidates", []),
                        key=lambda c: -(c.get("rating") or 0),
                    ) if c["name"] != pick.lunch_name),
                    None,
                )
                if alt:
                    dinner_info = {**alt, "reason": f"(System adjusted: avoid lunch duplicate, selected {alt['name']})"}
                else:
                    dinner_info = {**dinner_info,
                                   "reason": (dinner_info.get("reason") or "")
                                   + " ⚠️ Only 1 restaurant in this area, lunch/dinner same, please confirm before travel."}

            meals.append({"day": entry["day"], "lunch": lunch_info, "dinner": dinner_info})

        note = "Restaurant recommendation complete: " + " | ".join(
            f"Day{m['day']} Lunch={m['lunch']['name'] if m['lunch'] else 'None'}"
            f"/Dinner={m['dinner']['name'] if m['dinner'] else 'None'}"
            for m in meals
        )
        return {"meals": meals, "history": state.history + [note]}

    return async_meal_recommend
