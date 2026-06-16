from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from sqlmodel import SQLModel, Field, Relationship


class Itinerary(SQLModel, table=True):
    __tablename__ = "itineraries"

    id: str = Field(primary_key=True)
    user_id: str = Field(foreign_key="users.id", index=True)
    parent_id: Optional[str] = None
    query: str
    modification_notes: Optional[str] = None
    destination: str = ""
    start_date: str = ""
    end_date: str = ""
    plan_json: str # Full plan
    planner_state_json: Optional[str] = None # For LangGraph state
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    user: "User" = Relationship(back_populates="itineraries")

class PendingModification(SQLModel, table=True):
    __tablename__ = "pending_modifications"

    id: str = Field(primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    state_json: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
