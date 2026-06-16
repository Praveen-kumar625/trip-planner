# WANDERSYNC AI - Technical Debt Report

## 1. Dead & Deprecated Code
- **`frontend-legacy/`**: Entire directory is slated for removal once the React 19 / Vite migration is complete. Contains massive amounts of duplicate code and unoptimized assets.
- **`backend-legacy/`**: Monolithic backend directory. Logic is currently being ported to the `backend/` directory utilizing the Vertical Slice Architecture.

## 2. Monolithic Structures
- **Frontend Pages**: `pages.jsx` and `edit.jsx` contain thousands of lines of code, mixing UI rendering, API fetching, and complex state management.
- **Backend Routing**: `plan_routes.py` (and its equivalents) handle request validation, database interactions, LLM prompting, and response formatting in single massive functions.

## 3. Type Safety & Validation
- **Missing TypeScript**: The legacy frontend is written in vanilla JavaScript (`.jsx`), making it prone to runtime errors and difficult to refactor. The new `frontend/` is correctly using `.tsx`.
- **Backend Validation**: Over-reliance on raw dictionaries instead of strongly typed Pydantic models for internal data passing between providers and features.

## 4. API & Data Fetching
- **Synchronous Blocking**: Historical use of `time.sleep` and synchronous `requests` within async FastAPI routes blocks the event loop. This is being addressed by transitioning to `httpx.AsyncClient`.
- **Error Handling**: Brittle error handling in third-party integrations (AMap, Weather). Rate limits trigger 502 errors instead of graceful degradation or retries.

## 5. State Management
- **Frontend Prop Drilling**: Extensive prop drilling in legacy React components. Transitioning to React Query (for server state) and Zustand (for client state) is required to resolve this.
