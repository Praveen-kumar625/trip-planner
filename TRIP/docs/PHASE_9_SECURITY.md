# Phase 9 Design: Security Hardening

## Understanding Summary
- **Goal**: Implement enterprise-grade security based on the OWASP Top 10 framework to protect user data and system integrity.
- **Approach**: Full OWASP Audit & Fix (Access Control, Cryptographic Hardening, and Input Validation).
- **Architecture**: Dual-token JWT strategy with rotation; strict Pydantic/Zod validation; HttpOnly cookie storage.
- **Key Constraints**: Zero-CJK in security logs/errors; minimal latency impact from security middleware; strict adherence to Vertical Slice boundaries.

## Final Design

### 1. Access Control & Authorization (A01)
- **Ownership Verification**: Implement a `verify_itinerary_owner` dependency in the Trip module to prevent ID-harvesting attacks.
- **Role-Based Access**: Establish a foundation for "Admin" vs "User" roles in the `AuthRepository`.
- **CORS Hardening**: Restrict `allow_origins` in `backend/main.py` to the production domain only (via environment variables).

### 2. Cryptographic Hardening (A02)
- **JWT Rotation**: Implement logic to issue a new Refresh Token upon every refresh request and invalidate the old one in Redis.
- **Secure Storage**: Move Access and Refresh tokens into `HttpOnly`, `Secure`, and `SameSite=Strict` cookies to mitigate XSS-based token theft.
- **Password Hashing**: Continue using `bcrypt` with a minimum work factor of 12 (standardized in `backend/core/auth.py`).

### 3. Input Validation & Injection Prevention (A03)
- **Zero-Raw-SQL Policy**: Audit all repositories to ensure 100% usage of SQLModel/SQLAlchemy parameterized queries.
- **Strict Pydantic V2**: Use `model_validate(strict=True)` for all incoming API payloads to catch type-mismatch exploits early.
- **Frontend Zod Schemas**: Mirror backend validation on the React frontend using Zod to improve UX and catch malformed data before transmission.

### 4. XSS & CSRF Mitigation (A05/A07)
- **CSP Middleware**: Add a FastAPI middleware to inject a strict `Content-Security-Policy` header.
- **Security Headers**: Standardize on `HSTS`, `X-Frame-Options: DENY`, and `X-Content-Type-Options: nosniff`.
- **CSRF Protection**: Use the `X-XSRF-TOKEN` cookie pattern for all non-GET requests.

## Decision Log

| Decision | Chosen Option | Alternatives Considered | Rationale |
| :--- | :--- | :--- | :--- |
| **Token Storage** | HttpOnly Cookies | LocalStorage, SessionStorage | Cookies with the `HttpOnly` flag are inaccessible to JavaScript, effectively neutralizing most session-stealing XSS attacks. |
| **Auth Strategy** | Dual-Token (Access/Refresh) | Simple Bearer Token, OAuth2 Proxy | Balances user convenience (long sessions) with security (short-lived access windows and rotation). |

## Assumptions
1. The production environment supports SSL/TLS (required for `Secure` cookie flag).
2. Redis is available for the token deny-list (as established in Phase 7).

## Key Risks
- **CSRF Complexity**: Implementing CSRF tokens correctly in an SPA (Single Page App) requires careful coordination between axios interceptors and FastAPI.
- **Provider Access**: Ensuring that third-party integrations (AMap, LLMs) do not accidentally log or leak user PII (Personally Identifiable Information).
