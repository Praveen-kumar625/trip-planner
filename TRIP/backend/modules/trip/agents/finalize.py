from datetime import timedelta
from typing import Any

from backend.llm.factory import build_structured_llm
from backend.modules.trip.schemas import SpotTipsResult, TravelPlanState
from backend.modules.trip.helpers import format_weather_for_llm, haversine_km, async_invoke_structured, last_spot_of_period
from backend.modules.trip.prompts import SPOT_TIPS_SYSTEM, WEEKDAYS

def make_spot_tips_node(model_name: str | None):
    llm = build_structured_llm(SpotTipsResult, model=model_name, temperature=0)

    def spot_tips_node(state: TravelPlanState):
        raise NotImplementedError("Use async_spot_tips_node instead")

    async def async_spot_tips_node(state: TravelPlanState) -> dict[str, Any]:
        spot_names: list[str] = []
        lines: list[str] = []
        for day in state.route:
            day_no = day.get("day")
            the_date = ""
            if state.travel_start_date and day_no:
                d = state.travel_start_date + timedelta(days=day_no - 1)
                the_date = f"{d.isoformat()} {WEEKDAYS[d.weekday()]}"
                lines.append(f"Day {day_no} (date: {the_date or 'Unknown'})")
            for spot in day.get("spots", []):
                spot_names.append(spot["name"])
                lines.append(
                    f"  · {spot['name']} | {spot.get('period')} {spot.get('start_time')}–{spot.get('end_time')}"
                )
        if not spot_names:
            return {}

        weather_text = format_weather_for_llm(state.weather_forecast) or "No weather data available"
        prompt = (
            f"Destination: {state.destination}\n\n"
            "Itinerary: \n" + "\n".join(lines) + "\n\n"
            f"Weather forecast:\n{weather_text}"
        )
        try:
            result: SpotTipsResult = await async_invoke_structured(
                llm, [("system", SPOT_TIPS_SYSTEM), ("human", prompt)]
            )
        except RuntimeError:
            return {"history": state.history + ["spot_tips: failed to generate tips, skipped"]}

        valid = set(spot_names)
        tips = {t.name: t.tip.strip() for t in result.tips if t.name in valid and t.tip.strip()}
        for t in result.tips:
            if t.name not in valid and t.tip.strip():
                for name in valid:
                    if name not in tips and (t.name in name or name in t.name):
                        tips[name] = t.tip.strip()
                        break

        note = f"spot_tips: for  {len(tips)}/{len(valid)}  spots generated tips"
        return {"spot_tips": tips, "history": state.history + [note]}

    return async_spot_tips_node


def make_finalize_node(memory_writer=None):
    def finalize_node(state: TravelPlanState) -> dict[str, Any]:
        result = _finalize_impl(state)
        if memory_writer and result.get("final_plan"):
            try:
                memory_writer(result["final_plan"], state)
            except Exception:
                pass
        return result
    return finalize_node


def finalize_node(state: TravelPlanState) -> dict[str, Any]:
    return _finalize_impl(state)


def _finalize_impl(state: TravelPlanState) -> dict[str, Any]:
    spot_info    = {s["name"]: s for s in state.pois}
    meals_by_day = {m["day"]: m for m in state.meals}

    days_out: list[dict[str, Any]] = []
    for day in state.route:
        day_no   = day.get("day")
        the_date = None
        if state.travel_start_date:
            the_date = (state.travel_start_date + timedelta(days=day_no - 1)).isoformat()

        meal     = meals_by_day.get(day_no, {})
        timeline: list[dict[str, Any]] = []

        morning_anchor_name   = (last_spot_of_period(day, "morning") or {}).get("name")
        afternoon_anchor_name = (last_spot_of_period(day, "afternoon") or {}).get("name")
        lunch_inserted  = False
        dinner_inserted = False

        for spot in day.get("spots", []):
            info = spot_info.get(spot["name"], {})
            timeline.append({
                "type": "attraction",
                "name": spot["name"],
                "start_time": spot.get("start_time"),
                "end_time": spot.get("end_time"),
                "period": spot.get("period"),
                "rating": info.get("rating"),
                "open_time": info.get("open_time"),
                "photo": info.get("photo"),
                "location": info.get("location"),
                "tip": state.spot_tips.get(spot["name"]),
                "address": info.get("address"),
                "tel": info.get("tel"),
                "cost": info.get("cost"),
            })
            if spot.get("name") == morning_anchor_name and not lunch_inserted:
                lunch_inserted = True
                if meal.get("lunch"):
                    timeline.append({"type": "lunch", **meal["lunch"]})
                else:
                    timeline.append({"type": "lunch", "name": None, "no_restaurant": True})
            if spot.get("name") == afternoon_anchor_name and not dinner_inserted:
                dinner_inserted = True
                if meal.get("dinner"):
                    timeline.append({"type": "dinner", **meal["dinner"]})
                else:
                    timeline.append({"type": "dinner", "name": None, "no_restaurant": True})

        for i in range(1, len(timeline)):
            prev_loc = timeline[i - 1].get("location")
            cur_loc  = timeline[i].get("location")
            if prev_loc and cur_loc:
                timeline[i]["dist_from_prev_km"] = round(haversine_km(prev_loc, cur_loc), 2)

        days_out.append({"day": day_no, "date": the_date, "theme": day.get("theme"), "timeline": timeline, "transit_info": day.get("transit_info", ""), "accommodation_area": day.get("accommodation_area", ""), "daily_budget_estimate": day.get("daily_budget_estimate", 0)})

    final_plan = {
        "query": state.query,
        "destination": state.destination,
        "start_date": state.travel_start_date.isoformat() if state.travel_start_date else None,
        "end_date": state.travel_end_date.isoformat() if state.travel_end_date else None,
        "days_count": state.days,
        "preferences": {
            "attraction": state.attraction_preference,
            "food": state.food_preference,
            "habit": state.habit_preference,
            "budget": state.budget,
            "transport_mode": state.transport_mode,
            "accommodation_pref": state.accommodation_pref,
        },
        "approved": state.approved,
        "review_rounds": state.review_round,
        "weather_forecast": state.weather_forecast,
        "weather_note": state.weather_note,
        "route_issues": list(state.reviewer_issues or []),
        "days": days_out,
    }
    placed_names = {s["name"] for day_r in state.route for s in day_r.get("spots", [])}
    candidate_spots = [
        {k: v for k, v in s.items()
         if k in ("name", "rating", "photo", "location", "open_time", "address")}
        for s in state.pois
        if s.get("name") and s["name"] not in placed_names
    ][:20]
    final_plan["candidate_spots"] = candidate_spots

    history = state.history + ["finalize: final plan assembled"]
    final_plan["history"] = history
    return {"final_plan": final_plan, "history": history}
