from datetime import date, timedelta
from typing import Any

from backend.llm.factory import build_structured_llm
from backend.modules.trip.schemas import IntentExtraction, RewrittenQuery, TravelPlanState, CitySegment
from backend.modules.trip.helpers import clean_pref, fetch_weather_for_dates_async, parse_iso_date, async_invoke_structured
from backend.modules.trip.prompts import INTENT_SYSTEM, QUERY_REWRITE_SYSTEM, WEEKDAYS
from backend.core.database import get_session
from backend.core.memory import get_user_profile
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Depends

def make_query_rewrite_node(model_name: str | None, user_id: str | None):
    rewrite_llm = build_structured_llm(RewrittenQuery, model=model_name, temperature=0)

    async def async_query_rewrite(state: TravelPlanState) -> dict[str, Any]:
        raw = state.query
        try:
            profile_text = "No saved profile"
            if user_id:
                # Need a session here. In LangGraph nodes, we usually don't have Depends.
                # We can either pass session in state or open a temporary one.
                # For now, let's assume we can get it from core.database or use sync fallback if needed,
                # but better to handle it properly.
                from backend.core.database import async_session_maker
                async with async_session_maker() as session:
                    profile = await get_user_profile(user_id, session)
                
                if profile and any(profile.values()):
                    parts = []
                    if profile.get("attraction_prefs"):
                        parts.append("Attraction preference: " + ", ".join(profile["attraction_prefs"]))
                    if profile.get("food_prefs"):
                        parts.append("Food preference: " + ", ".join(profile["food_prefs"]))
                    if profile.get("habit_prefs"):
                        parts.append("Travel habit: " + ", ".join(profile["habit_prefs"]))
                    profile_text = "\n".join(parts)

            intent_prefs = (
                f"Attraction pref={state.attraction_preference or 'None'}, "
                f"Food pref={state.food_preference or 'None'}, Habit pref={state.habit_preference or 'None'}"
            )

            rewritten: RewrittenQuery = await async_invoke_structured(rewrite_llm, [
                ("system", QUERY_REWRITE_SYSTEM),
                ("human", f"User query: {raw}\n\n{intent_prefs}\n\nProfile:\n{profile_text}"),
            ])

            note = f"[query_rewrite] {raw!r} → {rewritten.rewritten_query!r} (reason: {rewritten.reasoning})"
            return {
                "rewritten_query": rewritten.rewritten_query,
                "attraction_preference": clean_pref(rewritten.attraction_preference) or state.attraction_preference,
                "food_preference":       clean_pref(rewritten.food_preference)       or state.food_preference,
                "habit_preference":      clean_pref(rewritten.habit_preference)      or state.habit_preference,
                "history": state.history + [note],
            }
        except Exception as exc:
            return {
                "history": state.history + [f"[query_rewrite] failed: {exc}, using raw query"],
            }

    return async_query_rewrite


def make_intent_node(model_name: str | None, profile_hint: str = ""):
    llm = build_structured_llm(IntentExtraction, model=model_name, temperature=0)

    async def async_intent(state: TravelPlanState) -> dict[str, Any]:
        today = date.today()
        system = INTENT_SYSTEM.format(today=today.isoformat(), weekday=WEEKDAYS[today.weekday()])
        hint = profile_hint or state.profile_hint or ""
        if hint:
            system += f"\n\nUser profile hint:\n{hint}"
        
        result: IntentExtraction = await async_invoke_structured(
            llm, [("system", system), ("human", state.query)]
        )

        start = parse_iso_date(result.travel_start_date)
        end   = parse_iso_date(result.travel_end_date)
        
        # Handle multiple destinations
        city_segments = []
        current_date = start
        
        for dest in result.destinations:
            seg_start = current_date
            seg_end = None
            if seg_start and dest.days > 0:
                seg_end = seg_start + timedelta(days=dest.days - 1)
                current_date = seg_end + timedelta(days=1)
            
            city_segments.append(CitySegment(
                city=dest.city,
                days=dest.days,
                start_date=seg_start,
                end_date=seg_end
            ))

        primary_destination = result.primary_destination.strip() or (city_segments[0].city if city_segments else None)

        missing: list[str] = []
        if not primary_destination:
            missing.append("destination")
        if not start:
            missing.append("start date")
        
        total_days = result.total_days or (sum(d.days for d in result.destinations) if result.destinations else 0)
        if start and not end and total_days > 0:
            end = start + timedelta(days=total_days - 1)
        
        if not end:
            missing.append("end date")

        days = 0
        if start and end:
            if end < start:
                missing.append("end date is before start date")
            else:
                days = (end - start).days + 1

        forecast: list[dict[str, Any]] = []
        w_note: str | None = None
        # Weather for primary destination only for now (simplified)
        if not missing and primary_destination and start and end:
            forecast, w_note = await fetch_weather_for_dates_async(primary_destination, start, end, "")

        opt = clean_pref
        note = (
            f"[intent] primary={primary_destination} | cities={len(city_segments)} | dates: {start}~{end} | {days} days"
            f" | budget={opt(result.budget)}"
        )
        
        return {
            "destination": primary_destination,
            "destinations": city_segments,
            "travel_start_date": start,
            "travel_end_date": end,
            "attraction_preference": opt(result.attraction_preference),
            "food_preference": opt(result.food_preference),
            "habit_preference": opt(result.habit_preference),
            "budget": opt(result.budget),
            "transport_mode": opt(result.transport_mode),
            "accommodation_pref": opt(result.accommodation_pref),
            "days": days,
            "missing_fields": missing,
            "weather_forecast": forecast,
            "weather_note": w_note,
            "history": state.history + [note],
        }

    return async_intent

def route_after_intent(state: TravelPlanState) -> str:
    from langgraph.graph import END
    return END if state.missing_fields else "query_rewrite"
