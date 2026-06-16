""""""

from __future__ import annotations

import json
from typing import Any, AsyncIterator

from langgraph.graph import END, START, StateGraph

from backend.modules.trip.schemas import TravelPlanState
from backend.modules.trip.agents.destination import make_intent_node, make_query_rewrite_node, route_after_intent
from backend.modules.trip.agents.planner import (
    attraction_search_node,
    make_planner_node,
    make_reviewer_node,
    make_time_check_node,
    route_after_planner,
    route_after_review,
    route_after_time_check,
)
from backend.modules.trip.agents.orchestrator import make_orchestrator_node
from backend.modules.trip.agents.meals import meal_search_node, make_meal_recommend_node
from backend.modules.trip.agents.finalize import make_finalize_node, make_spot_tips_node
from backend.modules.trip.agents.accommodation import make_accommodation_node
from backend.modules.trip.agents.transport import make_transport_node
from backend.modules.trip.agents.budget import make_budget_node


def build_graph(
    model_name: str | None = None,
    profile_hint: str = "",
    memory_writer=None,
    user_id: str | None = None,
):
    g = StateGraph(TravelPlanState)

    g.add_node("query_rewrite",    make_query_rewrite_node(model_name, user_id))
    g.add_node("intent",           make_intent_node(model_name, profile_hint=profile_hint))
    g.add_node("attraction_search", attraction_search_node)
    
    # NEW: Orchestrator node for Multi-city support
    g.add_node("orchestrator",     make_orchestrator_node(model_name))
    
    g.add_node("planner",          make_planner_node(model_name))
    g.add_node("reviewer",         make_reviewer_node(model_name))
    g.add_node("time_check",       make_time_check_node(model_name))
    g.add_node("meal_search",      meal_search_node)
    g.add_node("meal_recommend",   make_meal_recommend_node(model_name))
    g.add_node("accommodation",    make_accommodation_node(model_name))
    g.add_node("transport",        make_transport_node(model_name))
    g.add_node("budget",           make_budget_node(model_name))
    g.add_node("spot_tips",        make_spot_tips_node(model_name))
    g.add_node("finalize",         make_finalize_node(memory_writer))

    g.add_edge(START,   "intent")
    g.add_conditional_edges(
        "intent", route_after_intent,
        {"query_rewrite": "query_rewrite", END: END}
    )
    g.add_edge("query_rewrite",    "attraction_search")
    
    # Conditional routing: If multiple cities, go to orchestrator. Else go to planner.
    def route_to_planning(state: TravelPlanState):
        if state.destinations and len(state.destinations) > 1:
            return "orchestrator"
        return "planner"

    g.add_conditional_edges(
        "attraction_search", route_to_planning,
        {"orchestrator": "orchestrator", "planner": "planner"}
    )
    
    g.add_edge("orchestrator", "reviewer") 

    g.add_conditional_edges(
        "planner", route_after_planner,
        {"reviewer": "reviewer", "time_check": "time_check"},
    )
    g.add_conditional_edges(
        "reviewer", route_after_review,
        {"planner": "planner", "time_check": "time_check"},
    )
    g.add_conditional_edges(
        "time_check", route_after_time_check,
        {"planner": "planner", "meal_search": "meal_search"},
    )
    g.add_edge("meal_search",    "meal_recommend")
    g.add_edge("meal_recommend", "accommodation")
    g.add_edge("accommodation",  "transport")
    
    def route_after_budget(state: TravelPlanState):
        if not state.approved and state.review_round <= state.max_review_rounds:
            return "planner"
        return "spot_tips"

    g.add_edge("transport",      "budget")
    g.add_conditional_edges(
        "budget", route_after_budget,
        {"planner": "planner", "spot_tips": "spot_tips"}
    )
    
    g.add_edge("spot_tips",      "finalize")
    g.add_edge("finalize",       END)

    return g.compile()


_NODE_LABELS: dict[str, str] = {
    "query_rewrite":     "🔎 User profile ke sath query rewrite kar rahe hain",
    "intent":            "🧭 Trip intent samajh rahe hain (Destination / Dates / Preferences)",
    "attraction_search": "🗺 Google Maps se attractions search kar rahe hain",
    "orchestrator":      "🤹 Multi-city trip coordinate kar rahe hain",
    "planner":           "✍️ Day-by-day trip plan bana rahe hain",
    "reviewer":          "🔍 Trip plan review kar rahe hain",
    "time_check":        "⏱ Attractions ka open time check kar rahe hain",
    "meal_search":       "🍽 Aas-paas ke restaurants dhundh rahe hain",
    "meal_recommend":    "🍴 Har din ke liye restaurants select kar rahe hain",
    "accommodation":     "🏨 Area of stay select kar rahe hain",
    "transport":         "🚌 Transit options dhundh rahe hain",
    "budget":            "💰 Budget estimate kar rahe hain",
    "spot_tips":         "💡 Har jagah ke liye travel tips bana rahe hain",
    "finalize":          "📦 Final trip plan pack kar rahe hain",
}

def _stage_event(node: str, acc: dict[str, Any]) -> dict[str, Any]:
    label = _NODE_LABELS.get(node, "Processing...")
    ev: dict[str, Any] = {"type": "stage", "node": node, "label": label}
    if node == "planner":
        rnd = (acc.get("review_round") or 0) + 1
        ev["round"] = rnd
        ev["label"] = f"{label} (Round {rnd})"
    elif node == "reviewer":
        rnd = acc.get("review_round") or 1
        ev["round"] = rnd
        ev["label"] = f"{label}: Round {rnd}"
    elif node == "time_check":
        rnd = (acc.get("time_check_round") or 0) + 1
        ev["round"] = rnd
        ev["label"] = f"{label} (Round {rnd})"
    return ev


async def run_stream(
    query: str,
    profile_hint: str = "",
    memory_writer=None,
    user_id: str | None = None,
    **overrides: Any,
) -> AsyncIterator[dict[str, Any]]:
    app = build_graph(
        overrides.get("model_name"),
        profile_hint=profile_hint,
        memory_writer=memory_writer,
        user_id=user_id,
    )
    init = TravelPlanState(query=query, profile_hint=profile_hint or None, **overrides)
    config = {"recursion_limit": 50}

    acc: dict[str, Any] = init.model_dump()
    async for event in app.astream_events(init, config=config, version="v2"):
        ev_type = event.get("event")
        node    = event.get("name")
        if node not in _NODE_LABELS:
            continue
        if ev_type == "on_chain_start":
            yield _stage_event(node, acc)
        elif ev_type == "on_chain_end":
            upd = (event.get("data") or {}).get("output")
            if isinstance(upd, dict):
                acc.update(upd)

    final = TravelPlanState(**acc)
    success = not bool(final.missing_fields) and final.final_plan is not None
    yield {
        "type": "result",
        "success": success,
        "missing_fields": final.missing_fields,
        "history": final.history,
        "plan": final.final_plan if success else None,
    }


async def run_modification_stream(
    checkpoint: dict,
    modification_notes: str,
    memory_writer=None,
    **overrides: Any,
) -> AsyncIterator[dict[str, Any]]:
    # Port of legacy logic, simplified for current state
    yield {"type": "stage", "node": "planner", "label": "Modifying existing plan..."}
    # Implementation details...
    yield {"type": "result", "success": False, "message": "Not implemented in this turn"}


async def run_confirm_stream(
    pending_state: dict,
    memory_writer=None,
) -> AsyncIterator[dict[str, Any]]:
    yield {"type": "stage", "node": "finalize", "label": "Confirming modifications..."}
    # Implementation details...
    yield {"type": "result", "success": False, "message": "Not implemented in this turn"}
