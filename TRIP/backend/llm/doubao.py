""""""

from __future__ import annotations

import os
from typing import Any, TypeVar

from pydantic import BaseModel

from backend.core.env import load_local_env
from backend.core.http import choose_http_proxy


DOUBAO_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3"
DEFAULT_DOUBAO_MODEL = "doubao-pro-4k"
_LEGACY_MODEL_ALIASES = {
    "doubao-pro": "doubao-pro-4k",
    "doubaopro": "doubao-pro-4k",
}

SchemaT = TypeVar("SchemaT", bound=BaseModel)


def normalize_doubao_model(model: str) -> str:
    return _LEGACY_MODEL_ALIASES.get(model.strip(), model.strip())


def resolve_doubao_model(model: str | None = None) -> str:
    chosen = model or os.getenv("DOUBAO_MODEL", DEFAULT_DOUBAO_MODEL)
    return normalize_doubao_model(chosen)


def build_chat_doubao(*, model: str | None = None, temperature: float = 0) -> Any:
    """"""
    load_local_env()
    api_key = os.getenv("DOUBAO_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError("Lack DOUBAO_API_KEY. please .env.local Try again after configuring.")
    try:
        import httpx
        from langchain_openai import ChatOpenAI
    except ModuleNotFoundError as exc:
        raise RuntimeError("Lack httpx or langchain-openai. Please install dependencies first.") from exc

    proxy = choose_http_proxy()
    return ChatOpenAI(
        model=resolve_doubao_model(model),
        api_key=api_key,
        base_url=DOUBAO_BASE_URL,
        temperature=temperature,
        http_client=httpx.Client(proxy=proxy, trust_env=False),
        http_async_client=httpx.AsyncClient(proxy=proxy, trust_env=False),
        http_socket_options=(),
    )


def build_structured_doubao(
    schema: type[SchemaT],
    *,
    model: str | None = None,
    temperature: float = 0,
) -> Any:
    """"""
    llm = build_chat_doubao(model=model, temperature=temperature)
    return llm.with_structured_output(schema, method="function_calling", strict=True)
