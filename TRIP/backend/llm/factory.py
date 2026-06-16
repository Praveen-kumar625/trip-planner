""""""

from __future__ import annotations

from typing import Any, TypeVar, Literal

from pydantic import BaseModel
from backend.core.env import settings

SchemaT = TypeVar("SchemaT", bound=BaseModel)
LLMProvider = Literal["deepseek", "doubao", "openai", "dashscope"]

DEFAULT_PROVIDER = "deepseek"


def resolve_llm_provider() -> LLMProvider:
    """"""
    # In a real app, this might come from settings or user preference
    # For now, we'll try to find a provider that has a key
    if settings.DEEPSEEK_API_KEY:
        return "deepseek"
    if settings.DOUBAO_API_KEY:
        return "doubao"
    if settings.OPENAI_API_KEY:
        return "openai"
    return DEFAULT_PROVIDER


def build_chat_llm(*, model: str | None = None, temperature: float = 0) -> Any:
    """"""
    provider = resolve_llm_provider()
    if provider == "deepseek":
        from backend.llm.deepseek import build_chat_deepseek
        return build_chat_deepseek(model=model, temperature=temperature)
    elif provider == "doubao":
        from backend.llm.doubao import build_chat_doubao
        return build_chat_doubao(model=model, temperature=temperature)
    # Add other providers as needed


def build_structured_llm(
    schema: type[SchemaT],
    *,
    model: str | None = None,
    temperature: float = 0,
) -> Any:
    """"""
    provider = resolve_llm_provider()
    if provider == "deepseek":
        from backend.llm.deepseek import build_structured_deepseek
        return build_structured_deepseek(schema, model=model, temperature=temperature)
    elif provider == "doubao":
        from backend.llm.doubao import build_structured_doubao
        return build_structured_doubao(schema, model=model, temperature=temperature)
    # Add other providers as needed
