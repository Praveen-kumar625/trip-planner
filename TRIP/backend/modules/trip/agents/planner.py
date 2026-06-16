import json
import logging
from datetime import timedelta
from typing import Any

from langgraph.graph import END

from backend.llm.factory import build_structured_llm
from backend.modules.trip.schemas import (
    RouteReview,
    TimeCheckResult,
    TravelPlanState,
    TravelRoute,
)
from backend.modules.trip.helpers import (
    amap_key,
    cluster_pois_by_location,
    fetch_city_spots_async,
    filter_by_rating,
    format_spots_for_llm,
    format_weather_for_llm,
    async_invoke_structured,
    unknown_spots,
)
from backend.modules.trip.prompts import (
    PLANNER_SYSTEM,
    REVIEWER_SYSTEM,
    TIME_CHECK_SYSTEM,
    WEEKDAYS,
)

logger = logging.getLogger(__name__)

async def attraction_search_node(state: TravelPlanState) -> dict[str, Any]:
    api_key = amap_key()
    spots = await fetch_city_spots_async(state.destination or "", api_key, max_spots=state.max_spots)
    kept, _ = filter_by_rating(spots, state.min_rating)
    note = f"AMap POI Search: fetched {len(spots)} spots, rating≥{state.min_rating} kept {len(kept)} spots"
    return {"pois": kept, "history": state.history + [note]}

def _travel_dates_block(state: TravelPlanState) -> str:
    if not state.travel_start_date or not state.days:
        return ""
    lines = [
        f"  Day{i + 1} = {(state.travel_start_date + timedelta(days=i)).isoformat()}"
        f" ({WEEKDAYS[(state.travel_start_date + timedelta(days=i)).weekday()]})"
        for i in range(state.days)
    ]
    return (
        "\n\nTravel date and day of week (use this to check if spot is open, "
        "do not schedule spots on their closed days):\n" + "\n".join(lines)
    )

def make_planner_node(model_name: str | None):
    llm = build_structured_llm(TravelRoute, model=model_name, temperature=0.3)

    def planner(state: TravelPlanState):
        raise NotImplementedError("Use async_planner instead")

    async def async_planner(state: TravelPlanState) -> dict[str, Any]:
        old_spots = {s["name"] for day in (state.route or []) for s in day.get("spots", [])}
        is_final = (state.review_round >= state.max_review_rounds
                    and bool(state.route_modify_opinion))

        cluster_map = cluster_pois_by_location(state.pois, state.days)
        cand_text = format_spots_for_llm(state.pois, cluster_map)
        feedback = ""
        if state.route_modify_opinion:
            is_user_opinion = "[User Modification Input]" in state.route_modify_opinion
            opinion_label = (
                "User direct modification input (Highest priority, must fully address)"
                if is_user_opinion else
                "Reviewer modification input (Please revise accordingly)"
            )
            stale_block = ""
            if state.route_stale_warning:
                stale_block = (
                    f"\n\n🚨🚨[SEVERE WARNING: Your last output was identical to the previous one, days field didn't change!]\n"
                    f"Specific record: {state.route_stale_warning}\n"
                    f"This means you only changed reasoning/notes, but the days list remained unchanged.\n"
                    f"This round you MUST genuinely modify days - at least replace spots requested by the reviewer,"
                    f"or redistribute spots. If days are identical again, system will mark as planning failure.\n"
                )
            feedback = (
                f"\n\nPrevious route: \n{json.dumps(state.route, ensure_ascii=False)}\n\n"
                f"{stale_block}"
                f"{opinion_label}:\n{state.route_modify_opinion}"
            )

        weather_text = format_weather_for_llm(state.weather_forecast)
        weather_block = (
            f"\n\nTravel weather forecast: \n{weather_text}"
            if weather_text else "\n\n(No weather info, plan for sunny day)"
        )

        dialogue_block = ""
        if state.planner_reviewer_dialogue:
            dialogue_text = "\n".join(state.planner_reviewer_dialogue)
            dialogue_block = (
                f"\n\n[Historical communication (cross-check resolved vs urgent unresolved issues)]\n"
                f"{dialogue_text}"
            )

        final_note = (
            "\n\n[Final Revision] This is the last chance to revise."
            "Give a route that will not hurt product experience. No need to explain every change."
            if is_final else ""
        )

        prompt = (
            f"User needs: {state.rewritten_query or state.query}\n"
            f"Destination: {state.destination}\nTravel days: {state.days}  days\n"
            f"Max attractions per day: {state.max_per_day}\n"
            f"Attraction preference: {state.attraction_preference or 'None'}\n"
            f"Pace/Habit: {state.habit_preference or 'None'}"
            f"{_travel_dates_block(state)}"
            f"{weather_block}\n\n"
            f"Candidate spots pool (Total {len(state.pois)} ):\n{cand_text}"
            f"{feedback}"
            f"{dialogue_block}"
            f"{final_note}\n\n"
            f"Please provide {state.days}-day itinerary with daily spots arranged"
        )
        result: TravelRoute = await async_invoke_structured(llm, [("system", PLANNER_SYSTEM), ("human", prompt)])
        route = [d.model_dump() for d in result.days]
        rnd = state.review_round + 1

        logger.info("[planner round %d] reasoning:\n%s", rnd, result.reasoning or "(none)")

        new_spots = {s["name"] for day in route for s in day.get("spots", [])}
        added   = new_spots - old_spots
        removed = old_spots - new_spots
        change_summary = ""
        if old_spots and (added or removed):
            parts = []
            if added:   parts.append(f"Added: {', '.join(sorted(added))}")
            if removed: parts.append(f"Removed: {', '.join(sorted(removed))}")
            change_summary = f" | changes: {' | '.join(parts)}"

        note         = f"[Round {rnd}] Planner Draft: {result.notes or '(none)'}"
        planner_line = f"[Round {rnd}] Planner: {result.notes or '(none)'}{change_summary}"

        history = state.history
        old_route_json = json.dumps(state.route, ensure_ascii=False, sort_keys=True)
        new_route_json = json.dumps(route, ensure_ascii=False, sort_keys=True)
        is_unchanged = bool(state.route_modify_opinion and state.route and old_route_json == new_route_json)
        new_stale_warning = (
            f"Round {rnd}: Planner output route JSON identical to round {rnd - 1}, zero changes to days."
            if is_unchanged else ""
        )
        if is_unchanged:
            history = history + [
                f"⚠️ [Round {rnd}] Planner route identical to previous round, no changes made",
            ]
        history = history + [note]

        return {
            "route": route,
            "review_round": rnd,
            "history": history,
            "planner_reviewer_dialogue": state.planner_reviewer_dialogue + [planner_line],
            "modification_concern": result.modification_concern or None,
            "route_stale_warning": new_stale_warning,
        }

    return async_planner


def make_reviewer_node(model_name: str | None):
    llm = build_structured_llm(RouteReview, model=model_name, temperature=0)

    def reviewer(state: TravelPlanState):
        raise NotImplementedError("Use async_reviewer instead")

    async def async_reviewer(state: TravelPlanState) -> dict[str, Any]:
        bad_unknown = unknown_spots(state.route, state.pois)

        facts = f"Spots not in candidate pool: {('; '.join(bad_unknown)) or 'None'}"

        weather_text = format_weather_for_llm(state.weather_forecast)
        weather_block = (
            f"\nTravel weather forecast: \n{weather_text}\n"
            if weather_text else "\nNo weather data available.\n"
        )

        dialogue_block = ""
        if state.planner_reviewer_dialogue:
            non_time_lines = [
                line for line in state.planner_reviewer_dialogue
                if "[time_check" not in line
            ]
            if non_time_lines:
                dialogue_text = "\n".join(non_time_lines)
                dialogue_block = (
                    f"\n\n[Historical communication (check if your previous issues were fixed; "
                    f"if not, point them out, if fixed, check for new issues)]\n{dialogue_text}"
                )

        prompt = (
            f"Destination: {state.destination} | {state.days} days | Max per day: {state.max_per_day}\n"
            f"Pace/habit: {state.habit_preference or 'None'}"
            f"{_travel_dates_block(state)}\n"
            f"{weather_block}\n"
            f"\nCandidate pool:\n{format_spots_for_llm(state.pois, cluster_pois_by_location(state.pois, state.days))}\n\n"
            f"Route to review:\n{json.dumps(state.route, ensure_ascii=False)}\n\n"
            f"System objective pre-check (judge accordingly): \n{facts}"
            f"{dialogue_block}\n\n"
            f"Please review and conclude. ⚠️ Opening hours checked by time_check Agent, "
            f"do not review opening time issues."
        )
        result: RouteReview = await async_invoke_structured(llm, [("system", REVIEWER_SYSTEM), ("human", prompt)])
        approved = result.approved and not bad_unknown
        verdict  = "✅Approved" if approved else "❌Rejected"

        logger.debug(
            "[Reviewer round %d] reasoning:\n%s",
            state.review_round, result.reasoning,
        )
        logger.info(
            "[Reviewer round %d] %s (%d score) opinion=%r issues=%r",
            state.review_round, verdict, result.score,
            result.route_modify_opinion or "(None)", result.issues,
        )

        opinion_full = result.route_modify_opinion or "(No opinion)"
        issues_full  = ("; ".join(result.issues)) if result.issues else ""
        note = (
            f"[Round {state.review_round}] Reviewer {verdict} | Score: {result.score} | {opinion_full}"
            + (f"\n  → Issue list: {issues_full}" if issues_full else "")
        )

        reviewer_line = (
            f"[Round {state.review_round}] Reviewer {'Approved' if approved else 'Rejected'}"
            f" | Score: {result.score} | {result.route_modify_opinion or '(No opinion)'}"
        )
        return {
            "approved": approved,
            "need_modify_route": not approved,
            "route_modify_opinion": result.route_modify_opinion,
            "reviewer_issues": result.issues,
            "history": state.history + [note],
            "planner_reviewer_dialogue": state.planner_reviewer_dialogue + [reviewer_line],
        }

    return async_reviewer


def route_after_review(state: TravelPlanState) -> str:
    if state.approved or state.review_round > state.max_review_rounds:
        return "time_check"
    return "planner"


def route_after_planner(state: TravelPlanState) -> str:
    if state.time_check_done:
        return "time_check"
    return "reviewer"


def route_after_time_check(state: TravelPlanState) -> str:
    if not state.time_violations:
        return "meal_search"
    if state.time_check_round >= state.max_time_check_rounds:
        return "meal_search"
    return "planner"


def make_time_check_node(model_name: str | None):
    llm = build_structured_llm(TimeCheckResult, model=model_name, temperature=0)

    def time_check(state: TravelPlanState):
        raise NotImplementedError("Use async_time_check instead")

    async def async_time_check(state: TravelPlanState) -> dict[str, Any]:
        rnd = state.time_check_round + 1

        open_map = {s["name"]: (s.get("open_time") or "Unknown") for s in state.pois}
        lines: list[str] = []
        for day in state.route:
            day_no = day.get("day")
            for spot in day.get("spots", []):
                lines.append(
                    f"  Day{day_no} {spot.get('name')} arranged "
                    f"{spot.get('start_time')}-{spot.get('end_time')} | "
                    f"Original opening time: {open_map.get(spot.get('name'), 'Unknown')}"
                )
        route_block = "\n".join(lines) if lines else "  (Route empty)"

        prompt = (
            f"Destination: {state.destination}"
            f"{_travel_dates_block(state)}\n\n"
            f"Current route (format: Day N spotname arranged start-end | Original opening time: ...):\n"
            f"{route_block}\n\n"
            f"Output in schema order: reasoning first, then violations (only confirmed ones)."
        )

        try:
            result: TimeCheckResult = await async_invoke_structured(
                llm, [("system", TIME_CHECK_SYSTEM), ("human", prompt)], retries=3
            )
        except RuntimeError:
            logger.warning("[time_check round %d] LLM failed, skip time check", rnd)
            return {
                "time_violations": [],
                "time_check_done": True,
                "time_check_round": rnd,
                "history": state.history + [f"[time_check round {rnd}] LLM failed, skipping"],
            }

        logger.debug(
            "[time_check round %d] reasoning:\n%s",
            rnd, result.reasoning,
        )
        if result.violations:
            violation_lines = "\n".join(
                f"  Day{v.day} {v.spot_name}: {v.detail}" for v in result.violations
            )
            logger.info(
                "[time_check round %d] ❌ Found %d violations:\n%s",
                rnd, len(result.violations), violation_lines,
            )
        else:
            logger.info("[time_check round %d] ✅ No time violations found", rnd)

        violations_dicts = [v.model_dump() for v in result.violations]
        if not violations_dicts:
            return {
                "time_violations": [],
                "time_check_done": True,
                "time_check_round": rnd,
                "history": state.history + [f"[time_check round {rnd}] ✅ No violations"],
                "planner_reviewer_dialogue": state.planner_reviewer_dialogue
                    + [f"[time_check round {rnd}] No violations"],
            }

        detail_lines = "\n".join(
            f"- Day{v.day} {v.spot_name}: {v.detail}" for v in result.violations
        )
        opinion = (
            f"Time check round {rnd} found scheduling conflicts:\n{detail_lines}"
        )
        note = f"[time_check round {rnd}] Found {len(violations_dicts)} conflicts:\n{detail_lines}"

        return {
            "time_violations": violations_dicts,
            "time_check_done": True,
            "time_check_round": rnd,
            "route_modify_opinion": opinion,
            "approved": False,
            "history": state.history + [note],
            "planner_reviewer_dialogue": state.planner_reviewer_dialogue + [note],
        }

    return async_time_check
