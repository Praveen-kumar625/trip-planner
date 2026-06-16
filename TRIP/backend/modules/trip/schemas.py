from __future__ import annotations

from datetime import date
from typing import Any, Optional

from pydantic import BaseModel, Field

# ─── LLM Structured Output Schema ────────────────────────────────────

class DestinationIntent(BaseModel):
    city: str = Field(description="City name, e.g. 'Tokyo'")
    days: int = Field(description="Number of days in this city")

class IntentExtraction(BaseModel):
    destinations: list[DestinationIntent] = Field(default_factory=list, description="List of destination cities and days for each")
    primary_destination: str = Field(default="", description="The main or first destination city")
    travel_start_date: str = Field(default="", description="Start date, format YYYY-MM-DD; empty if none")
    travel_end_date: str = Field(default="", description="End date, format YYYY-MM-DD; empty if none")
    total_days: int = Field(default=0, description="Total number of travel days")
    attraction_preference: str = Field(default="", description="Attraction preference, e.g. 'Historical/Nature'; empty if none")
    food_preference: str = Field(default="", description="Food preference, e.g. 'Local snacks/Light'; empty if none")
    habit_preference: str = Field(
        default="", description="Travel habits/pace, e.g. 'Early to bed/Slow pace/Not too many spots'; empty if none"
    )
    budget: str = Field(default="", description="Budget constraint or expectation, e.g. 'Low budget', 'Luxury'; empty if none")
    transport_mode: str = Field(default="", description="Preferred mode of transport, e.g. 'Public transit', 'Driving', 'Walking'; empty if none")
    accommodation_pref: str = Field(default="", description="Accommodation preference, e.g. 'Hostel', '5-star Hotel', 'Downtown area'; empty if none")

class SpotPlan(BaseModel):
    name: str = Field(description="Spot name, must strictly come from the candidate pool")
    period: str = Field(description="Period: morning / afternoon / evening")
    start_time: str = Field(description="Start time, format HH:MM")
    end_time: str = Field(description="End time, format HH:MM")

class DayRoute(BaseModel):
    day: int = Field(description="Which day, starting from 1")
    spots: list[SpotPlan] = Field(description="Spots for the day (ordered by time)")
    theme: str = Field(description="Theme for the day, one sentence summarizing the scheduled spots")
    daily_budget_estimate: int = Field(default=0, description="Estimated daily budget in local currency")
    transit_info: str = Field(default="", description="Transit summary for the day, e.g., 'Take subway Line 1, approx 45 mins total transit'")
    accommodation_area: str = Field(default="", description="Recommended neighborhood/area to stay based on the day's locations")

class TravelRoute(BaseModel):
    reasoning: str = Field(
        description=(
            "Reason step-by-step through four dimensions: [Adjacent spots][User Preference][No Repetition][Weather Adaptability]. "
            "Write down the decision or modification conclusion for each dimension."
        )
    )
    days: list[DayRoute] = Field(
        description="Daily itinerary, strictly implementing the conclusions from reasoning—if it says change, you must change, if keep, you must keep."
    )
    notes: str = Field(default="", description="One-sentence summary of the main changes in this round, for historical logs")
    modification_concern: str = Field(
        default="",
        description="If user's modification requests would severely degrade route quality (e.g. huge geographic span on the same day, "
                    "obvious time conflicts), write 1-2 sentences of concern here; empty string if no concern.",
    )
    total_budget_estimate: int = Field(default=0, description="Total estimated trip budget")

class RouteReview(BaseModel):
    reasoning: str = Field(
        description=(
            "Complete reasoning process for each dimension: analyze proximity/popularity/authenticity/habit-matching/"
            "night logic/weather logic/backtracking step-by-step, write conclusions for each (pass/fail + reason). "
            "issues and route_modify_opinion must only be extracted from these conclusions, do not invent out of thin air."
        )
    )
    approved: bool = Field(description="Whether the route meets the standards")
    score: int = Field(description="Comprehensive score 0-100")
    route_modify_opinion: str = Field(
        default="",
        description="Modification instructions for the planner, diagnostic tone, can be technical; can be empty if approved=true",
    )
    issues: list[str] = Field(
        default_factory=list,
        description=(
            "Friendly travel reminders for the user (NOT diagnostic!). "
            "Convert problems in route_modify_opinion into gentle, actionable user language, "
            "telling the user what to watch out for during actual travel. "
            "e.g., 'Day 2 is quite packed, consider booking restaurants in advance', "
            "'Day 3 has thunderstorms, remember an umbrella and prioritize indoor spots'. "
            "DO NOT use critical/technical words like 'violation', 'conflict', 'unreasonable', 'huge geographic span'. "
            "Return an empty list if approved=true and no reminders needed."
        ),
    )

class TimeViolation(BaseModel):
    day: int = Field(description="Which day, starting from 1")
    spot_name: str = Field(description="Spot name")
    detail: str = Field(description="One-sentence fact stating the violation, the planner relies solely on this to locate and fix")

class TimeCheckResult(BaseModel):
    reasoning: str = Field(
        description=(
            "Complete reasoning checking each spot: 'Scheduled time vs Opening text -> Check -> Conclusion pass/fail'. "
            "Reasoning must cover all spots, including those ultimately deemed legal. "
            "Only write confirmed violations from this reasoning into the 'violations' field."
        )
    )
    violations: list[TimeViolation] = Field(
        default_factory=list,
        description="List of confirmed violations, 'detail' is a factual statement; DO NOT write spots deemed legal in reasoning.",
    )

class SingleDayMealPick(BaseModel):
    lunch_name: str = Field(description="Lunch restaurant name, strictly copy candidate list; empty string if none suitable")
    lunch_reason: str = Field(default="", description="Lunch recommendation/downgrade reason, 1-2 sentences; if no suitable, explain downgrade")
    dinner_name: str = Field(description="Dinner restaurant name, strictly copy candidate list; empty string if none suitable")
    dinner_reason: str = Field(default="", description="Dinner recommendation/downgrade reason, 1-2 sentences; if no suitable, explain downgrade")

class DayMealPick(BaseModel):
    day: int = Field(description="Which day")
    lunch_name: str = Field(default="", description="Lunch restaurant name")
    lunch_reason: str = Field(default="", description="Lunch recommendation/downgrade reason")
    dinner_name: str = Field(default="", description="Dinner restaurant name")
    dinner_reason: str = Field(default="", description="Dinner recommendation/downgrade reason")

# ─── API Request Schemas ──────────────────────────────────────────

class PlanRequest(BaseModel):
    query: str = Field(min_length=3, max_length=500)
    max_per_day: int = Field(default=5, ge=1, le=10)
    min_rating: float = Field(default=4.5, ge=0, le=5)
    max_spots: int = Field(default=30, ge=1, le=100)
    max_review_rounds: int = Field(default=3, ge=0, le=5)
    thread_id: Optional[str] = None
    plan_id: Optional[str] = None
    modification_notes: Optional[str] = Field(default=None, max_length=1000)

    model_config = {"extra": "forbid"}

# ─── LangGraph State ───────────────────────────────────────────

class CitySegment(BaseModel):
    city: str
    days: int
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    itinerary: list[dict[str, Any]] = Field(default_factory=list)
    pois: list[dict[str, Any]] = Field(default_factory=list)
    weather: list[dict[str, Any]] = Field(default_factory=list)

class TravelPlanState(BaseModel):
    query: str
    destination: Optional[str] = None # Primary/First destination
    destinations: list[CitySegment] = Field(default_factory=list) # Multi-city support
    travel_start_date: Optional[date] = None
    travel_end_date: Optional[date] = None
    attraction_preference: Optional[str] = None
    food_preference: Optional[str] = None
    habit_preference: Optional[str] = None
    budget: Optional[str] = None
    transport_mode: Optional[str] = None
    accommodation_pref: Optional[str] = None
    days: int = 0
    missing_fields: list[str] = Field(default_factory=list)

    max_per_day: int = 5
    min_rating: float = 4.5
    max_spots: int = 30
    max_review_rounds: int = 3
    model_name: Optional[str] = None

    pois: list[dict[str, Any]] = Field(default_factory=list)

    route: list[dict[str, Any]] = Field(default_factory=list)
    need_modify_route: bool = False
    route_modify_opinion: Optional[str] = None
    review_round: int = 0
    approved: bool = False
    history: list[str] = Field(default_factory=list)
    planner_reviewer_dialogue: list[str] = Field(default_factory=list)
    route_stale_warning: str = ""

    weather_forecast: list[dict[str, Any]] = Field(default_factory=list)
    weather_note: Optional[str] = None

    meal_candidates: list[dict[str, Any]] = Field(default_factory=list)
    meals: list[dict[str, Any]] = Field(default_factory=list)

    spot_tips: dict[str, str] = Field(default_factory=dict)

    reviewer_issues: list[str] = Field(default_factory=list)

    time_violations: list[dict[str, Any]] = Field(default_factory=list)
    time_check_round: int = 0
    max_time_check_rounds: int = 3
    time_check_done: bool = False

    rewritten_query: Optional[str] = None

    profile_hint: Optional[str] = None

    modification_notes: Optional[str] = None
    parent_plan_id: Optional[str] = None
    previous_plan_summary: Optional[str] = None

    modification_concern: Optional[str] = None

    final_plan: Optional[dict[str, Any]] = None

# ─── Spot Tips Agent Schema ───────────────────────────────────

class SpotTipItem(BaseModel):
    name: str = Field(description="Spot name, must exactly match the spot name in the input itinerary (word-for-word, do not alter)")
    tip: str = Field(
        description=(
            "Travel tips for this spot, 30-70 words, must be specific and actionable: "
            "combine daily weather for clothing/gear advice (rain=umbrella/anti-slip, heat=sunscreen/water), "
            "combine spot attributes for prep advice (hiking=sneakers/snacks, temples=dress code, night=warmth), "
            "and any spot-specific common knowledge (e.g. pandas active early, hot spots need advance booking). "
            "DO NOT use empty clichés like 'Have a great time'."
        )
    )

class SpotTipsResult(BaseModel):
    reasoning: str = Field(
        description=(
            "Brief analysis per spot: how is the weather today, is the spot indoor/outdoor/hiking/any special rules, "
            "and decide what to remind based on that. 1-2 sentences per spot."
        )
    )
    tips: list[SpotTipItem] = Field(
        default_factory=list,
        description="One tip per spot, covering ALL spots in the input itinerary, names matching word-for-word",
    )

# ─── Query Rewrite Agent Schema ───────────────────────────────

class RewrittenQuery(BaseModel):
    reasoning: str = Field(default="", description="Conflict resolution reasoning: compare current query preferences vs profile preferences, conclude merges or overwrites; rewrite reasons; for logs only")
    attraction_preference: str | None = Field(
        default=None,
        description="Attraction preference summary (after conflict resolution). Merge current explicit pref with profile pref, if conflict current query wins; null if no preference",
    )
    food_preference: str | None = Field(
        default=None,
        description="Food preference summary (after conflict resolution). Same rules; null if no preference",
    )
    habit_preference: str | None = Field(
        default=None,
        description="Travel habits/pace summary (after conflict resolution). Same rules; null if no preference",
    )
    rewritten_query: str = Field(description="The rewritten travel query incorporating the resolved preferences; return original if no relevant profile")

# ─── Profile Update Agent Schema ──────────────────────────────

class ProfileUpdateResult(BaseModel):
    change_log: list[str] = Field(default_factory=list, description="List of changes (write this first, the lists below MUST implement these changes)")
    attraction_prefs: list[str] = Field(default_factory=list, description="Full list of attraction preferences (including changes in change_log), max 20")
    food_prefs: list[str] = Field(default_factory=list, description="Full list of food preferences (including changes in change_log), max 20")
    habit_prefs: list[str] = Field(default_factory=list, description="Full list of habit/pace preferences (including changes in change_log), max 20")
