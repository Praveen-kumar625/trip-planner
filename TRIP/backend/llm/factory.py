""""""

from __future__ import annotations

from typing import Any, TypeVar, Literal

from pydantic import BaseModel
from backend.core.env import settings

SchemaT = TypeVar("SchemaT", bound=BaseModel)
LLMProvider = Literal["openai", "google", "anthropic"]

DEFAULT_PROVIDER = "openai"


def resolve_llm_provider() -> LLMProvider:
    """"""
    if settings.OPENAI_API_KEY:
        return "openai"
    if settings.GOOGLE_API_KEY:
        return "google"
    if settings.ANTHROPIC_API_KEY:
        return "anthropic"
    return DEFAULT_PROVIDER


def build_chat_llm(*, model: str | None = None, temperature: float = 0) -> Any:
    """"""
    provider = resolve_llm_provider()
    if provider == "openai":
        from langchain_openai import ChatOpenAI
        return ChatOpenAI(model=model or "gpt-4o", temperature=temperature)
    elif provider == "google":
        from langchain_google_genai import ChatGoogleGenerativeAI
        return ChatGoogleGenerativeAI(model=model or "gemini-1.5-pro", temperature=temperature)
    elif provider == "anthropic":
        from langchain_anthropic import ChatAnthropic
        return ChatAnthropic(model=model or "claude-3-5-sonnet-latest", temperature=temperature)


def build_structured_llm(
    schema: type[SchemaT],
    *,
    model: str | None = None,
    temperature: float = 0,
) -> Any:
    """"""
    llm = build_chat_llm(model=model, temperature=temperature)
    return llm.with_structured_output(schema)
