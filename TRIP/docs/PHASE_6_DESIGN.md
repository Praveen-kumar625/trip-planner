# Phase 6 Design: AI Experience

## Understanding Summary
- **Goal**: Upgrade the AI planning engine to handle multi-city trips and provide intelligent budgeting.
- **Approach**: Orchestrator-Worker Pattern (Master Planner splits city tasks; Workers process in parallel).
- **Architecture**: LangGraph-based multi-agent system with feedback loops for Budget and Distance constraints.
- **Key Constraints**: Support for English/Hinglish (Zero CJK), adherence to user budget levels (Economy/Mid/Luxury).

## Final Design

### 1. Multi-City Orchestration
- **MasterPlanner Node**: Analyzes the query to identify multiple destinations and date splits.
- **Parallel Workers**: Dispatches separate planning tasks for each city to `CityPlanner` nodes.
- **Synthesizer Node**: Merges city sub-itineraries into a cohesive master plan, inserting transit legs (trains, flights) based on distance.

### 2. Intelligent Guardrails
- **BudgetReviewer Node**:
    - Aggregates `cost` data from AMap POIs.
    - Compares total against the User Profile budget preference.
    - Triggers iterative revisions if the plan is "over budget."
- **Upgraded Reviewer Node**:
    - **Distance Check**: Flags days where total travel distance between spots is sub-optimal (>10km walking or excessive driving).
    - **Theme Cohesion**: Ensures daily spots are contextually related (e.g., historical sites grouped together).

### 3. State Expansion
- LangGraph `state` will now track:
    - `destinations`: list of city objects.
    - `itinerary_segments`: dictionary of city-specific drafts.
    - `total_budget_estimate`: numeric value for user feedback.

## Decision Log

| Decision | Chosen Option | Alternatives Considered | Rationale |
| :--- | :--- | :--- | :--- |
| **Multi-City Pattern** | Orchestrator-Worker | Recursive, Iterative | Parallelism reduces user wait time; modularity allows city-specific specialized prompts. |
| **Budget Logic** | Active Revision Loop | Static Estimation | Ensures the final plan is actionable and matches user financial expectations before presentation. |

## Assumptions
1. High-concurrency LLM calls are supported by the provider tier.
2. Budget data is available via AMap or inferred via LLM common sense for non-AMap regions.

## Key Risks
- **Token Usage**: Parallel planning for 3+ cities will significantly increase token consumption per request.
- **Consistency**: Maintaining a single "voice" across multiple city sub-itineraries requires strict system prompting in the Synthesizer.
