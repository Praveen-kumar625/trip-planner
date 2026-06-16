# WANDERSYNC AI - Architecture Report

## Current State vs Target Architecture

The WANDERSYNC AI repository is currently undergoing a massive structural migration from a monolithic legacy pattern to a modern **Vertical Slice Architecture**.

### Legacy Architecture (Pending Deprecation)
- **Frontend**: A monolithic React setup contained entirely in `frontend-legacy/` featuring massive files (e.g., `pages.jsx` > 1500 lines). Lacks modern state management and is styled with a mix of arbitrary CSS and inline styles.
- **Backend**: A tightly coupled monolithic structure in `backend-legacy/` with mixed synchronous and asynchronous code. 

### Target Architecture (In Progress)

#### Frontend Architecture
- **Framework**: React 19 + Vite
- **Routing**: React Router
- **State Management**: React Query (Server State), Zustand (Client State)
- **Styling**: Tailwind CSS v4 + Shadcn UI
- **Structure**:
  ```text
  frontend/src/
  ├── app/          # App initialization
  ├── pages/        # Route components
  ├── features/     # Domain-specific components
  ├── components/   # Shared UI components
  ├── hooks/        # Shared custom hooks
  ├── services/     # API clients
  ├── store/        # Zustand stores
  ├── utils/        # Utility functions
  └── styles/       # Global CSS and Tailwind config
  ```

#### Backend Architecture
- **Framework**: FastAPI
- **Architecture Pattern**: Vertical Slice Architecture
- **AI Orchestration**: LangGraph
- **Database**: PostgreSQL
- **Structure**:
  ```text
  backend/
  ├── core/         # Cross-cutting concerns (Auth, DB, Cache)
  ├── features/     # Vertical slices (Auth, Trip, AI, Budget)
  │   └── [feature]/
  │       ├── router.py
  │       ├── service.py
  │       ├── schema.py
  │       ├── graph.py    # LangGraph logic
  │       └── repository.py
  ├── providers/    # Third-party integrations (AMap, Weather, LLMs)
  └── main.py       # Application entry point
  ```

## System Components
1. **AI Layer**: Utilizes multiple LLMs (OpenAI, Doubao, Dashscope, Qwen) orchestrated via LangGraph for robust trip generation, route planning, and budgeting.
2. **Data Layer**: Relational data models with caching layers (Redis pending implementation) to minimize redundant LLM and 3rd-party API calls.
3. **Integration Layer**: Services for maps (AMap), weather forecasting, and location search.
