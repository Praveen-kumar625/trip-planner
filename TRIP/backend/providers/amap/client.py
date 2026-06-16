""""""

from __future__ import annotations

from typing import Any


AMAP_TEXT_SEARCH_URL = "https://restapi.amap.com/v3/place/text"
AMAP_AROUND_SEARCH_URL = "https://restapi.amap.com/v3/place/around"
AMAP_RATE_LIMIT_INFOS = {
    "CUQPS_HAS_EXCEEDED_THE_LIMIT",
    "USER_DAILY_QUERY_OVER_LIMIT",
    "USER_KEY_RECYCLED",
}


def int_or_none(value: Any) -> int | None:
    """"""
    return int(value) if str(value).isdigit() else None
