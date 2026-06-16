"""HTTP client helpers (asynchronous with resilience)."""

from __future__ import annotations

import logging
import urllib.parse
from typing import Any, Optional

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception

logger = logging.getLogger(__name__)

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) WandersyncAI/0.2"
)

_SECRET_QUERY_KEYS = ("key", "api_key", "access_token", "token")

def is_transient_error(e: Exception) -> bool:
    if isinstance(e, httpx.TimeoutException):
        return True
    if isinstance(e, httpx.RequestError):
        return True
    if isinstance(e, httpx.HTTPStatusError):
        return e.response.status_code >= 500 or e.response.status_code == 429
    return False

def redact_url(url: str) -> str:
    """"""
    parsed = urllib.parse.urlparse(url)
    query = urllib.parse.parse_qs(parsed.query, keep_blank_values=True)
    for secret_key in _SECRET_QUERY_KEYS:
        if secret_key in query:
            query[secret_key] = ["<redacted>"]
    redacted_query = urllib.parse.urlencode(query, doseq=True)
    return urllib.parse.urlunparse(parsed._replace(query=redacted_query))

class AsyncHttpClient:
    """"""
    def __init__(self):
        self.client: Optional[httpx.AsyncClient] = None

    def get_client(self) -> httpx.AsyncClient:
        if self.client is None or self.client.is_closed:
            self.client = httpx.AsyncClient(
                timeout=20.0,
                headers={
                    "User-Agent": USER_AGENT,
                    "Accept": "application/json",
                }
            )
        return self.client

    async def close(self):
        if self.client and not self.client.is_closed:
            await self.client.aclose()

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception(is_transient_error),
        reraise=True
    )
    async def get_json(self, url: str, params: Optional[dict] = None) -> dict[str, Any]:
        client = self.get_client()
        try:
            resp = await client.get(url, params=params)
            resp.raise_for_status()
            return resp.json()
        except httpx.HTTPStatusError as e:
            logger.error("HTTP error %d for URL: %s", e.response.status_code, redact_url(url))
            raise
        except Exception as e:
            logger.error("Request failed for URL: %s - %s", redact_url(url), str(e))
            raise

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception(is_transient_error),
        reraise=True
    )
    async def post_json(self, url: str, json_data: dict, params: Optional[dict] = None) -> dict[str, Any]:
        client = self.get_client()
        try:
            resp = await client.post(url, json=json_data, params=params)
            resp.raise_for_status()
            return resp.json()
        except httpx.HTTPStatusError as e:
            logger.error("HTTP POST error %d for URL: %s", e.response.status_code, redact_url(url))
            raise
        except Exception as e:
            logger.error("POST Request failed for URL: %s - %s", redact_url(url), str(e))
            raise


# Global instance
http_client = AsyncHttpClient()


# Legacy compatibility wrappers
async def async_http_get_json(url: str, **kwargs) -> dict[str, Any]:
    return await http_client.get_json(url)


def http_get_json(url: str) -> dict[str, Any]:
    """Sync wrapper for legacy code (use with caution)."""
    import asyncio
    try:
        # Check if loop is already running
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # This is bad in FastAPI but some legacy threads might use it
            import requests
            resp = requests.get(url, timeout=15)
            resp.raise_for_status()
            return resp.json()
    except Exception:
        pass
    
    return asyncio.run(async_http_get_json(url))
