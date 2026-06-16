# Phase 2 Design: Architecture Refactor

## Understanding Summary
- **Goal**: Modernize WANDERSYNC AI using Vertical Slice Architecture with a focus on stability and security.
- **Approach**: "Core-First Stability" (Refactoring Database, Auth, and Environment management before visual changes).
- **Architecture**: FastAPI backend with modular slices; React 19/Vite/Tailwind v4 frontend.
- **Key Constraints**: Strict Zero-CJK policy, < 250 lines per component, absolute async-first backend.

## Final Design

### 1. Core Infrastructure
- **Database (`core/database.py`)**: Implement `asyncpg` for PostgreSQL connection pooling and `AsyncSession` for request-scoped transaction management.
- **Auth (`core/auth.py`)**: Transition to a Dual-Token Strategy (Access/Refresh) with JWT Rotation and HttpOnly cookie storage.
- **Environment (`core/env.py`)**: Use `pydantic-settings` to validate all configuration (AMap, LLM keys) at startup.
- **Providers (`providers/`)**: Standardize on `httpx.AsyncClient` with exponential backoff retries and circuit breakers for external API calls.

### 2. Module Structure
- All logic will be contained within `backend/modules/[feature]/`.
- Routers will be "thin," delegating business logic to `service.py` and data access to `repository.py`.

## Decision Log

| Decision | Chosen Option | Alternatives Considered | Rationale |
| :--- | :--- | :--- | :--- |
| **Foundation Approach** | Core-First Stability | Visual-First, Skeleton Migration | Ensures security and scalability before adding features. |
| **Naming Convention** | `modules/` | `features/` | Minimizes friction by aligning with existing directory names. |
| **Environment Mgmt** | Pydantic Settings | `os.getenv` | Provides fail-fast validation and type safety. |
| **HTTP Client** | `httpx` (Async) | `requests`, `aiohttp` | Prevents blocking the event loop while being more modern than aiohttp. |

## Assumptions
1. PostgreSQL is the target production database.
2. The system must support English and Hinglish exclusively (Zero CJK).
3. Legacy code is maintained only for reference until the port is verified.

## Key Risks
- **Data Migration**: Migrating existing users to the new JWT/DB structure without downtime.
- **Provider Stability**: Handling varied latency and failure modes of third-party LLM providers.
