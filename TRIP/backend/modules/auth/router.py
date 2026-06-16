""""""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Depends, Response, Request
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.auth import (
    set_auth_cookies,
    verify_refresh_token,
    create_access_token,
    create_refresh_token
)
from backend.core.database import get_session
from backend.modules.auth.repository import AuthRepository
from backend.modules.auth.service import AuthService

router = APIRouter(prefix="/api/auth", tags=["auth"])


class AuthRequest(BaseModel):
    username: str
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str | None = None


@router.post("/register")
async def register(
    req: AuthRequest, 
    response: Response,
    session: AsyncSession = Depends(get_session)
):
    if not req.username.strip() or not req.password:
        raise HTTPException(400, "Username aur password dono zaruri hai")
    
    repo = AuthRepository(session)
    service = AuthService(repo)
    
    try:
        data = await service.register(req.username.strip(), req.password)
        set_auth_cookies(response, data["access_token"], data["refresh_token"])
        return {
            "user_id": data["user_id"],
            "username": data["username"],
            "access_token": data["access_token"] # Still return for SPA state
        }
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.post("/login")
async def login(
    req: AuthRequest, 
    response: Response,
    session: AsyncSession = Depends(get_session)
):
    repo = AuthRepository(session)
    service = AuthService(repo)
    
    try:
        data = await service.login(req.username.strip(), req.password)
        set_auth_cookies(response, data["access_token"], data["refresh_token"])
        return {
            "user_id": data["user_id"],
            "username": data["username"],
            "access_token": data["access_token"]
        }
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")


@router.post("/refresh")
async def refresh_token(
    request: Request,
    response: Response,
    req: RefreshRequest = None # Support both cookie and body for flexibility
):
    token = (req.refresh_token if req else None) or request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(401, "Refresh token missing")
    
    user_id = verify_refresh_token(token)
    if not user_id:
        raise HTTPException(401, "Invalid or expired refresh token")
    
    new_access = create_access_token(data={"sub": user_id})
    new_refresh = create_refresh_token(data={"sub": user_id})
    
    set_auth_cookies(response, new_access, new_refresh)
    return {"access_token": new_access}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token", path="/api/auth/refresh")
    return {"message": "Logged out successfully"}
