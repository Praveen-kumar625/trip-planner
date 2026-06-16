""""""

from __future__ import annotations

from pathlib import Path
from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

def load_local_env():
    env_path = Path(__file__).resolve().parents[2] / ".env.local"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)


class Settings(BaseSettings):
    """"""
    # API Keys & Secrets
    SECRET_KEY: str = Field(default="dev-secret-key-change-me-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Third-Party APIs
    AMAP_JS_KEY: str = ""
    AMAP_JS_SECURITY_CODE: str = ""
    AMAP_API_KEY: str = ""

    # Database
    DATABASE_URL: str = Field(default="sqlite+aiosqlite:///./data/app.db")
    REDIS_URL: str = Field(default="redis://localhost:6379/0")

    # LLM Providers
    OPENAI_API_KEY: Optional[str] = None
    DEEPSEEK_API_KEY: Optional[str] = None
    DOUBAO_API_KEY: Optional[str] = None
    DASHSCOPE_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parents[2] / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
