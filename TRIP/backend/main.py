import os
from pathlib import Path
from contextlib import asynccontextmanager
import secrets

from fastapi import FastAPI, Request, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
import logging

logger = logging.getLogger(__name__)

from backend.core.database import init_db
from backend.core.env import settings
from backend.core.http import http_client

# Import routers from the vertical slices (modules)
from backend.modules.auth.router import router as auth_router
from backend.modules.itinerary.router import router as history_router
from backend.modules.trip.router import router as plan_router
from backend.modules.user.router import router as profile_router
from backend.modules.system.router import router as system_router
from backend.modules.finance.router import router as finance_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        await init_db()
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
    yield
    # Shutdown
    from backend.core.cache import cache_service
    try:
        await cache_service.close()
        await http_client.close()
    except Exception as e:
        logger.error(f"Failed to close services: {e}")

app = FastAPI(
    title="Wandersync AI",
    version="0.2.0",
    lifespan=lifespan
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation error", "errors": exc.errors()},
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error occurred.", "type": type(exc).__name__}
    )

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: https: blob: https://maps.gstatic.com https://maps.googleapis.com; "
            "connect-src 'self' https://maps.googleapis.com;"
        )
        return response

class CSRFMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if request.method not in ("GET", "HEAD", "OPTIONS"):
            csrf_cookie = request.cookies.get("XSRF-TOKEN")
            csrf_header = request.headers.get("X-XSRF-TOKEN")
            if not csrf_cookie or csrf_cookie != csrf_header:
                return JSONResponse(
                    status_code=403,
                    content={"detail": "CSRF validation failed"}
                )
        
        response = await call_next(request)
        
        # Always set a fresh CSRF token in a cookie if not present
        if not request.cookies.get("XSRF-TOKEN"):
            response.set_cookie(
                key="XSRF-TOKEN",
                value=secrets.token_urlsafe(32),
                httponly=False, # Must be accessible to frontend JS
                samesite="lax",
                secure=False
            )
        return response

app.add_middleware(CSRFMiddleware)
app.add_middleware(SecurityHeadersMiddleware)

# Standardize prefixes if needed, currently they seem to have their own in routers
app.include_router(auth_router)
app.include_router(history_router)
app.include_router(profile_router)
app.include_router(plan_router)
app.include_router(system_router)
app.include_router(finance_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "0.2.0"}

@app.get("/api/config")
async def config():
    return {
        "google_maps_api_key": settings.GOOGLE_MAPS_API_KEY,
    }

_FRONTEND_DIR = Path(__file__).resolve().parent.parent / "frontend" / "dist"

@app.get("/")
async def index():
    if (_FRONTEND_DIR / "index.html").exists():
        return FileResponse(_FRONTEND_DIR / "index.html")
    return {"message": "Frontend not built yet. Run 'npm run build' in frontend directory."}

if _FRONTEND_DIR.exists():
    app.mount("/", StaticFiles(directory=str(_FRONTEND_DIR), html=True), name="frontend")
