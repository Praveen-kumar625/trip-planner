""""""

from __future__ import annotations

import json
import uuid
from datetime import datetime, timezone
from typing import Any, Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text


async def get_user_profile(user_id: str, session: AsyncSession) -> dict:
    result = await session.execute(
        text("SELECT attraction_prefs, food_prefs, habit_prefs, visited_destinations "
             "FROM user_profiles WHERE user_id = :user_id"),
        {"user_id": user_id},
    )
    row = result.fetchone()
    if not row:
        return {"attraction_prefs": [], "food_prefs": [], "habit_prefs": [], "visited_destinations": []}
    
    return {
        "attraction_prefs":     json.loads(row[0] or "[]"),
        "food_prefs":           json.loads(row[1] or "[]"),
        "habit_prefs":          json.loads(row[2] or "[]"),
        "visited_destinations": json.loads(row[3] or "[]"),
    }


async def set_user_profile(user_id: str, profile: dict, session: AsyncSession) -> None:
    """"""
    def clean(items) -> list:
        seen, out = set(), []
        for it in (items or []):
            s = str(it).strip()
            if s and s not in seen:
                seen.add(s)
                out.append(s)
        return out[:20]

    now = datetime.now(timezone.utc).isoformat()
    
    # Using raw SQL for ON CONFLICT (SQLite syntax)
    # If moving to Postgres, this needs to be adapted or use SQLAlchemy ORM
    await session.execute(
        text("""INSERT INTO user_profiles (user_id, attraction_prefs, food_prefs, habit_prefs, visited_destinations, updated_at)
           VALUES (:user_id, :attr, :food, :habit, :visited, :updated_at)
           ON CONFLICT(user_id) DO UPDATE SET
               attraction_prefs=excluded.attraction_prefs,
               food_prefs=excluded.food_prefs,
               habit_prefs=excluded.habit_prefs,
               visited_destinations=excluded.visited_destinations,
               updated_at=excluded.updated_at"""),
        {
            "user_id": user_id,
            "attr": json.dumps(clean(profile.get("attraction_prefs")), ensure_ascii=False),
            "food": json.dumps(clean(profile.get("food_prefs")), ensure_ascii=False),
            "habit": json.dumps(clean(profile.get("habit_prefs")), ensure_ascii=False),
            "visited": json.dumps(clean(profile.get("visited_destinations")), ensure_ascii=False),
            "updated_at": now,
        },
    )
    await session.commit()


async def save_itinerary(
    user_id: str,
    plan: dict,
    query: str,
    session: AsyncSession,
    *,
    parent_id: str | None = None,
    modification_notes: str | None = None,
    planner_state: dict | None = None,
) -> str:
    plan_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    await session.execute(
        text("""INSERT INTO itineraries
           (id, user_id, parent_id, query, modification_notes,
            destination, start_date, end_date, plan_json, planner_state_json, created_at)
           VALUES (:id, :user_id, :parent_id, :query, :mod_notes,
            :dest, :start, :end, :plan_json, :state_json, :created_at)"""),
        {
            "id": plan_id, "user_id": user_id, "parent_id": parent_id, "query": query, "mod_notes": modification_notes,
            "dest": plan.get("destination", ""),
            "start": plan.get("start_date", ""),
            "end": plan.get("end_date", ""),
            "plan_json": json.dumps(plan, ensure_ascii=False),
            "state_json": json.dumps(planner_state, ensure_ascii=False) if planner_state else None,
            "created_at": now,
        },
    )
    await session.commit()
    return plan_id


async def load_itinerary(plan_id: str, session: AsyncSession) -> dict | None:
    result = await session.execute(
        text("SELECT plan_json, modification_notes, planner_state_json FROM itineraries WHERE id = :id"),
        {"id": plan_id},
    )
    row = result.fetchone()
    if not row:
        return None
    return {
        "plan": json.loads(row[0]),
        "modification_notes": row[1],
        "planner_state": json.loads(row[2]) if row[2] else None,
    }


async def list_itineraries(user_id: str, session: AsyncSession) -> list[dict[str, Any]]:
    result = await session.execute(
        text("""SELECT id, parent_id, destination, start_date, end_date, created_at
           FROM itineraries WHERE user_id = :user_id ORDER BY created_at DESC LIMIT 50"""),
        {"user_id": user_id},
    )
    rows = result.fetchall()
    return [{"id": r[0], "parent_id": r[1], "destination": r[2], "start_date": r[3], "end_date": r[4], "created_at": r[5]} for r in rows]


async def update_plan_json(plan_id: str, user_id: str, new_plan: dict, session: AsyncSession) -> bool:
    result = await session.execute(
        text("UPDATE itineraries SET plan_json = :plan_json WHERE id = :id AND user_id = :user_id"),
        {
            "plan_json": json.dumps(new_plan, ensure_ascii=False),
            "id": plan_id,
            "user_id": user_id
        },
    )
    await session.commit()
    return result.rowcount > 0


async def save_pending_modification(
    user_id: str,
    state_dict: dict,
    session: AsyncSession,
) -> str:
    pending_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc).isoformat()
    await session.execute(
        text("INSERT INTO pending_modifications (id, user_id, state_json, created_at) VALUES (:id, :user_id, :state_json, :created_at)"),
        {
            "id": pending_id,
            "user_id": user_id,
            "state_json": json.dumps(state_dict, ensure_ascii=False),
            "created_at": now
        },
    )
    await session.commit()
    return pending_id


async def load_pending_modification(
    pending_id: str,
    session: AsyncSession,
) -> dict | None:
    result = await session.execute(
        text("SELECT state_json, user_id FROM pending_modifications WHERE id = :id"),
        {"id": pending_id},
    )
    row = result.fetchone()
    if not row:
        return None
    return {
        "state": json.loads(row[0]),
        "user_id": row[1],
    }


async def delete_pending_modification(pending_id: str, session: AsyncSession) -> None:
    await session.execute(
        text("DELETE FROM pending_modifications WHERE id = :id"),
        {"id": pending_id}
    )
    await session.commit()


async def extract_and_update_preferences(user_id: str, plan: dict, session: AsyncSession) -> None:
    """"""
    prefs = plan.get("preferences", {})
    destination = plan.get("destination", "")

    existing = await get_user_profile(user_id, session)

    def merge(existing_list: list, new_str: str) -> list:
        if not new_str:
            return existing_list
        new_items = [s.strip() for s in new_str.replace(",", "/").replace(";", "/").split("/") if s.strip()]
        merged = list(existing_list)
        for item in new_items:
            if item not in merged:
                merged.append(item)
        return merged[:20]

    attraction = merge(existing["attraction_prefs"], prefs.get("attraction", ""))
    food       = merge(existing["food_prefs"],       prefs.get("food", ""))
    habit      = merge(existing["habit_prefs"],      prefs.get("habit", ""))
    visited    = list(existing["visited_destinations"])
    if destination and destination not in visited:
        visited.append(destination)
        visited = visited[-20:]

    now = datetime.now(timezone.utc).isoformat()
    await session.execute(
        text("""INSERT INTO user_profiles (user_id, attraction_prefs, food_prefs, habit_prefs, visited_destinations, updated_at)
           VALUES (:user_id, :attr, :food, :habit, :visited, :updated_at)
           ON CONFLICT(user_id) DO UPDATE SET
               attraction_prefs=excluded.attraction_prefs,
               food_prefs=excluded.food_prefs,
               habit_prefs=excluded.habit_prefs,
               visited_destinations=excluded.visited_destinations,
               updated_at=excluded.updated_at"""),
        {
            "user_id": user_id, 
            "attr": json.dumps(attraction, ensure_ascii=False),
            "food": json.dumps(food, ensure_ascii=False),
            "habit": json.dumps(habit, ensure_ascii=False),
            "visited": json.dumps(visited, ensure_ascii=False), 
            "updated_at": now
        },
    )
    await session.commit()


# Utility functions (stay sync as they don't touch DB)

def format_profile_for_prompt(profile: dict) -> str:
    parts = []
    if profile.get("attraction_prefs"):
        parts.append("Attraction preferences: " + ", ".join(profile["attraction_prefs"]))
    if profile.get("food_prefs"):
        parts.append("Dining preferences: " + ", ".join(profile["food_prefs"]))
    if profile.get("habit_prefs"):
        parts.append("Travel pace: " + ", ".join(profile["habit_prefs"]))
    if profile.get("visited_destinations"):
        parts.append("Cities visited: " + ", ".join(profile["visited_destinations"]))
    return "\n".join(parts)


def summarize_plan_for_prompt(plan: dict) -> str:
    lines = [f"Destination: {plan.get('destination', '')} | {plan.get('start_date', '')} to {plan.get('end_date', '')}"]
    for day in plan.get("days", []):
        spots = [t["name"] for t in day.get("timeline", []) if t.get("type") == "attraction"]
        lines.append(f"Day {day['day']} ({day.get('date', '')}): {', '.join(spots) or 'No attractions'}")
    return "\n".join(lines)
