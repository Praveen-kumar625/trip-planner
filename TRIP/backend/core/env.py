""""""

from __future__ import annotations

from pathlib import Path
from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """"""
    # API Keys & Secrets
    SECRET_KEY: str = Field(default="dev-secret-key-change-me-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Google Maps Platform (Replaces AMap)
    GOOGLE_MAPS_API_KEY: str = ""
    OPENWEATHER_API_KEY: str = ""

    # Database
    DATABASE_URL: str = Field(default="sqlite+aiosqlite:///./data/app.db")
    REDIS_URL: str = Field(default="redis://localhost:6379/0")

    # LLM Providers (International/Indian only - No Chinese providers)
    OPENAI_API_KEY: Optional[str] = None
    # Add Google Gemini or Claude keys here as needed
    GOOGLE_API_KEY: Optional[str] = None 
    ANTHROPIC_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parents[2] / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
