""""""

from __future__ import annotations

import asyncio
import json
import logging

from backend.core.database import get_conn
from backend.core.memory import get_user_profile, set_user_profile
from backend.llm.factory import build_structured_llm
from backend.modules.trip.helpers import invoke_structured
from backend.modules.trip.prompts import PROFILE_UPDATER_SYSTEM
from backend.modules.trip.schemas import ProfileUpdateResult

logger = logging.getLogger(__name__)


def _profile_diff(existing: dict, result) -> list[str]:
    """"""
    diff: list[str] = []
    for field in ("attraction_prefs", "food_prefs", "habit_prefs"):
        old = existing[field]
        new = getattr(result, field)
        added   = [x for x in new if x not in old]
        removed = [x for x in old if x not in new]
        if added:
            diff.append(f"{field} Added {added}")
        if removed:
            diff.append(f"{field} Removed {removed}")
    return diff


def _sync_profile_update(user_id: str, raw_query: str, model_name: str | None) -> None:
    with get_conn() as conn:
        existing = get_user_profile(user_id, conn)

    llm = build_structured_llm(ProfileUpdateResult, model=model_name, temperature=0)
    result = invoke_structured(llm, [
        ("system", PROFILE_UPDATER_SYSTEM),
        ("human", (
            f"Current profile: {json.dumps({'attraction_prefs': existing['attraction_prefs'], 'food_prefs': existing['food_prefs'], 'habit_prefs': existing['habit_prefs']}, ensure_ascii=False)}\n\n"
            f"User's original travel request this time: {raw_query}"
        )),
    ])

    diff = _profile_diff(existing, result)
    if result.change_log and not diff:
        logger.warning(
            "[profile_updater] user=%s change_log claimed changes but list identical, skip db save change_log=%s",
            user_id, result.change_log,
        )
        return
    if not diff:
        logger.info("[profile_updater] user=%s No profile changes", user_id)
        return

    with get_conn() as conn:
        latest = get_user_profile(user_id, conn)
        updated = {
            "attraction_prefs":     result.attraction_prefs,
            "food_prefs":           result.food_prefs,
            "habit_prefs":          result.habit_prefs,
            "visited_destinations": latest["visited_destinations"],
        }
        set_user_profile(user_id, updated, conn)

    logger.info("[profile_updater] user=%s diff=%s changes=%s", user_id, diff, result.change_log)


async def run_profile_update_agent(user_id: str, raw_query: str, model_name: str | None = None) -> None:
    """"""
    try:
        await asyncio.to_thread(_sync_profile_update, user_id, raw_query, model_name)
    except Exception:
        logger.warning("[profile_updater] Profile update failed user=%s", user_id, exc_info=True)
