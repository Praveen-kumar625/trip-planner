# Phase 3 Design: Codebase Refactor

## Understanding Summary
- **Goal**: Decompose monolithic routers and legacy frontend components into modular, maintainable units.
- **Approach**: "The Surgical Split" (Extracting logic into Services and Repositories; decomposing React components by feature).
- **Architecture**: Service/Repository pattern for backend; Feature-based atomic components for frontend.
- **Key Constraints**: < 250 lines per component, no raw SQL in routers, strict separation of business logic from transport logic.

## Final Design

### 1. Backend Decomposition (Vertical Slice Evolution)
- **Service Layer (`service.py`)**: Handles complex domain logic (itinerary optimization, LangGraph orchestration).
- **Repository Layer (`repository.py`)**: Abstracts all data access (SQL/ORM calls).
- **Router Layer (`router.py`)**: "Thin" controllers handling request validation and response mapping.

### 2. Frontend Porting (Modularization)
- **Feature Folders**: `src/features/[feature_name]/` containing `components/`, `hooks/`, `services/`, and `types/`.
- **Atomic Extraction**: Extracting `AuthModal`, `ConcernModal`, and `JourneyLoading` from legacy `pages.jsx` into modular components.
- **Logic Extraction**: Moving API call state and side effects into custom hooks (e.g., `useTripStreaming`).

## Decision Log

| Decision | Chosen Option | Alternatives Considered | Rationale |
| :--- | :--- | :--- | :--- |
| **Backend Layering** | Service/Repository Pattern | Domain Driven Design (DDD), Active Record | Provides the best balance of simplicity and testability for Vertical Slices. |
| **Frontend Porting** | Atomic Feature Port | Big Bang Rewrite, Component-only Port | Ensures features are functional end-to-end as they are moved. |
| **Component Limit** | 250 Lines | 500 Lines, None | Forces better decomposition and readability. |

## Assumptions
1. `SQLModel` remains the primary tool for repository implementations.
2. `Zustand` will handle all client-side global state (Auth, UI preferences).
3. `React Query` will handle all server-side state (Trip history, Profile data).

## Key Risks
- **Logic Duplication**: Risks of logic leaking between the old `memory.py` and new Repositories.
- **Styling Parity**: Achieving visual parity with the legacy system before the UI Reinvention (Phase 4) begins.
