from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional, List

from sqlmodel import SQLModel, Field, Relationship


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: str = Field(primary_key=True)
    username: str = Field(index=True, unique=True)
    password_hash: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    profile: Optional["UserProfile"] = Relationship(back_populates="user")
    itineraries: List["Itinerary"] = Relationship(back_populates="user")


class UserProfile(SQLModel, table=True):
    __tablename__ = "user_profiles"

    user_id: str = Field(primary_key=True, foreign_key="users.id")
    attraction_prefs: str = Field(default="[]") # JSON string
    food_prefs: str = Field(default="[]")       # JSON string
    habit_prefs: str = Field(default="[]")      # JSON string
    visited_destinations: str = Field(default="[]") # JSON string
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

    user: User = Relationship(back_populates="profile")
