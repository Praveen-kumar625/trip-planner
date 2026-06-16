# Phase 7 Design: Performance Optimization

## Understanding Summary
- **Goal**: Achieve Lighthouse scores of 95+ and ensure the backend can handle high-concurrency AI planning.
- **Approach**: Code-splitting and React Query on the frontend; Redis-based caching and AnyIO concurrency on the backend.
- **Target Metrics**: 
    - Initial Bundle Size < 250KB (Gzipped).
    - Time to First Byte (TTFB) < 200ms.
    - Sub-100ms response time for cached external data.

## Final Design

### 1. Frontend: High-Fidelity Performance
- **Code Splitting**: Implement `React.lazy` and `Suspense` at the route level to eliminate dead code in the initial load.
- **React Query Implementation**:
    - Centralize all API calls in `src/services/api.ts`.
    - Use `useQuery` for history and profile fetching with stale-time optimization.
    - Use `useMutation` for planning requests to handle loading/error states natively.
- **Asset Pipeline**: Optimize `icons.svg` using SVGO and ensure all hero images are served in WebP format with responsive `<picture>` tags.

### 2. Backend: Distributed Caching & Concurrency
- **Redis Cache Layer**: 
    - Implement a unified `CacheService` using `redis-py` (async).
    - Cache keys will follow the pattern `poi:{city}:{kind}:{kw}` and `llm_segment:{hash}`.
    - TTLs: POI data (24h), LLM segments (1h).
- **Concurrency Tuning**:
    - Use `asyncio.gather` or `AnyIO` TaskGroups in the `MasterPlanner` to fetch data for multiple cities simultaneously.
    - Optimize SSE streaming buffers to prevent "stuttering" during long generation cycles.

## Decision Log

| Decision | Chosen Option | Alternatives Considered | Rationale |
| :--- | :--- | :--- | :--- |
| **State Management** | React Query | Zustand (for API data) | React Query is purpose-built for server state, providing automatic caching and synchronization out of the box. |
| **Cache Provider** | Redis | Local Memory, SQLite | Redis allows for horizontal scaling and prevents cache loss on server restarts. |

## Assumptions
1. Frontend build process will include Brotli/Gzip compression.
2. Redis instance is reachable at `localhost:6379` by default.

## Key Risks
- **Cache Invalidation**: Stale POI data or weather forecasts might lead to inaccurate plans if TTLs are too long.
- **LLM Rate Limits**: Increased parallelism may trigger rate limits on third-party providers (requires a queue or rate-limiting middleware).
