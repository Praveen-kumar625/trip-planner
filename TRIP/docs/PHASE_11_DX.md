# Phase 11 Design: Developer Experience (DX)

## Understanding Summary
- **Goal**: Standardize tooling, automation, and documentation to ensure high velocity and low friction for contributors.
- **Approach**: Unified CI/CD via GitHub Actions and strict linting (Ruff/ESLint).
- **Key Constraints**: Fast local setup (< 5 mins), zero unformatted code in the repo, interactive documentation for all APIs.

## Final Design

### 1. CI/CD Pipeline (GitHub Actions)
- **Validation Workflow**: Runs on every Pull Request.
    - **Backend**: Ruff linting, Pytest suite, Type checking (Mypy).
    - **Frontend**: ESLint, Vitest, Production build check.
- **Deployment Workflow**: Triggered on merge to `main`.
    - Automated build and push to staging/production environments.

### 2. Standardized Tooling
- **Python (Backend)**:
    - **Ruff**: Replaces Flake8, Isort, and Black for 10-100x faster linting and formatting.
    - **Pre-commit**: Local hooks to ensure code quality before pushing.
- **React (Frontend)**:
    - **ESLint 9+**: Modern flat-config for strict React rules.
    - **Prettier**: Enforced for consistent code style.

### 3. Documentation & Discovery
- **API Reference**: Fully documented FastAPI Swagger UI (`/docs`) with Pydantic descriptions and example payloads.
- **README.md**: Comprehensive guide including architecture diagrams (C4 model), local development setup, and environment variable references.
- **Task Runner**: A `run.py` or `Makefile` to unify common commands (e.g., `make dev`, `make test`).

## Decision Log

| Decision | Chosen Option | Alternatives | Rationale |
| :--- | :--- | :--- | :--- |
| **Linting Tool** | Ruff | Black + Flake8 | Ruff is significantly faster and consolidates multiple tools into one, reducing configuration complexity. |
| **Documentation** | Interactive Swagger | Static Markdown | Interactive docs allow for real-time API testing, which is invaluable for frontend-backend coordination. |

## Assumptions
1. Developers have access to Docker for consistent local testing.
2. GitHub is the primary hosting provider for CI/CD.
