""""""



from __future__ import annotations



import logging

import math

import os

import re

import time

from datetime import date, timedelta

from typing import Any



logger = logging.getLogger(__name__)



from backend.core.env import settings

def amap_key() -> str:
    key = settings.AMAP_API_KEY.strip()
    if not key:
        raise RuntimeError("AMAP_API_KEY not configured. Please set it in .env")
    return key







def parse_iso_date(text: str) -> date | None:

    text = (text or "").strip()

    if not text:

        return None

    try:

        return date.fromisoformat(text)

    except ValueError:

        return None







EARTH_RADIUS_KM = 6371.0088





def haversine_km(a: dict[str, float], b: dict[str, float]) -> float:

    """"""

    lat1, lon1 = math.radians(a["lat"]), math.radians(a["lng"])

    lat2, lon2 = math.radians(b["lat"]), math.radians(b["lng"])

    dlat, dlon = lat2 - lat1, lon2 - lon1

    h = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2

    return 2 * EARTH_RADIUS_KM * math.asin(math.sqrt(h))





def _has_coords(loc: Any) -> bool:

    """"""

    return (

        isinstance(loc, dict)

        and isinstance(loc.get("lat"), (int, float))

        and isinstance(loc.get("lng"), (int, float))

    )





def cluster_pois_by_location(

    pois: list[dict[str, Any]], k: int

) -> dict[str, int]:

    """"""

    result: dict[str, int] = {}

    valid: list[tuple[str, dict[str, float]]] = []

    for s in pois:

        loc = s.get("location")

        if _has_coords(loc):

            valid.append((s["name"], loc))

        else:

            result[s["name"]] = -1



    n = len(valid)

    if n == 0:

        return result

    k = max(1, min(k, n))

    if k == 1:

        for name, _ in valid:

            result[name] = 0

        return result



    ordered = sorted(valid, key=lambda x: (x[1]["lng"], x[1]["lat"]))

    centroids = [

        {"lat": ordered[round(i * (n - 1) / (k - 1))][1]["lat"],

         "lng": ordered[round(i * (n - 1) / (k - 1))][1]["lng"]}

        for i in range(k)

    ]



    assign: dict[str, int] = {}

    for _ in range(20):

        new_assign = {

            name: min(range(k), key=lambda c: haversine_km(centroids[c], loc))

            for name, loc in valid

        }

        if new_assign == assign:

            break

        assign = new_assign

        for c in range(k):

            members = [loc for name, loc in valid if assign[name] == c]

            if members:

                centroids[c] = {

                    "lat": sum(m["lat"] for m in members) / len(members),

                    "lng": sum(m["lng"] for m in members) / len(members),

                }



    result.update(assign)

    return result







_JUNK_PREF = {"null", "none", "undefined", "n/a", "na", "not specified", "no preference", "any", "default", "unset"}





def clean_pref(v: str | None) -> str | None:

    """"""

    s = (v or "").strip()

    return None if (not s or s.lower() in _JUNK_PREF) else s







def fetch_city_spots(city: str, api_key: str, *, max_spots: int = 30) -> list[dict[str, Any]]:
    """"""
    keywords_list = [f"{city} attractions", f"{city} popular spots", f"{city} must visit"]
    seen: set[str] = set()
    spots: list[dict[str, Any]] = []

    for kw in keywords_list:
        if len(spots) >= max_spots:
            break
        for raw in search_attraction_pois(city, api_key, keywords=kw):
            if len(spots) >= max_spots:
                break
            name = raw.get("name", "")
            if name in seen:
                continue
            spot = poi_to_spot(raw)
            if spot:
                seen.add(name)
                spots.append(spot)
    return spots

async def fetch_city_spots_async(city: str, api_key: str, *, max_spots: int = 30) -> list[dict[str, Any]]:
    """"""
    keywords_list = [f"{city} attractions", f"{city} popular spots", f"{city} must visit"]
    seen: set[str] = set()
    spots: list[dict[str, Any]] = []

    for kw in keywords_list:
        if len(spots) >= max_spots:
            break
        raw_pois = await search_attraction_pois_async(city, api_key, keywords=kw)
        for raw in raw_pois:
            if len(spots) >= max_spots:
                break
            name = raw.get("name", "")
            if name in seen:
                continue
            spot = poi_to_spot(raw)
            if spot:
                seen.add(name)
                spots.append(spot)
    return spots





def filter_by_rating(

    spots: list[dict[str, Any]], min_rating: float

) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:

    """"""

    kept = [s for s in spots if s.get("rating") is not None and s["rating"] >= min_rating]

    dropped = [s for s in spots if s not in kept]

    return kept, dropped







_CLUSTER_LABELS = "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮"





def _spot_line(s: dict[str, Any]) -> str:

    loc = s.get("location") or {}

    rating = f"{s['rating']:.1f}" if s.get("rating") else "N/A"
    open_t = s.get("open_time") or "Unknown"
    area = s.get("adname") or "Unknown"
    if _has_coords(loc):
        coord = f"Coords: {loc['lng']:.4f},{loc['lat']:.4f}"
    else:
        coord = "No coords"
    return f"- {s['name']} | Area: {area} | Rating: {rating} | Hours: {open_t} | {coord}"





def format_spots_for_llm(

    pois: list[dict[str, Any]],

    cluster_map: dict[str, int] | None = None,

) -> str:

    """"""

    if not cluster_map:

        return "\n".join(_spot_line(s) for s in pois)



    groups: dict[int, list[dict[str, Any]]] = {}

    for s in pois:

        cid = cluster_map.get(s["name"], -1)

        groups.setdefault(cid, []).append(s)



    blocks = []

    for cid in sorted(groups, key=lambda c: (c == -1, c)):

        if cid == -1:
            header = "\U0001f4cd Unclustered"
        else:
            label = _CLUSTER_LABELS[cid] if cid < len(_CLUSTER_LABELS) else f"#{cid + 1}"
            header = f"\U0001f4cd Area {label}"

        lines = "\n".join(_spot_line(s) for s in groups[cid])

        blocks.append(f"{header}\n{lines}")

    return "\n\n".join(blocks)





def spot_location_map(pois: list[dict[str, Any]]) -> dict[str, dict[str, float]]:

    return {s["name"]: s["location"] for s in pois}







_TIME_RANGE_RE = re.compile(r"(\d{1,2})[:：](\d{2})\s*[-~—–]\s*(\d{1,2})[:：](\d{2})")





def _to_minutes(hhmm: str) -> int | None:

    m = re.match(r"\s*(\d{1,2})[:：](\d{2})", hhmm or "")

    if not m:

        return None

    return int(m.group(1)) * 60 + int(m.group(2))





def open_time_violations(route: list[dict[str, Any]], pois: list[dict[str, Any]]) -> list[str]:

    """"""

    open_map = {s["name"]: (s.get("open_time") or "") for s in pois}

    bad: list[str] = []

    for day in route:

        for spot in day.get("spots", []):

            rng = _TIME_RANGE_RE.search(open_map.get(spot["name"], ""))

            if not rng:

                continue

            o_start = int(rng.group(1)) * 60 + int(rng.group(2))

            o_end = int(rng.group(3)) * 60 + int(rng.group(4))

            s_start = _to_minutes(spot.get("start_time", ""))

            s_end = _to_minutes(spot.get("end_time", ""))

            if s_start is None or s_end is None:

                continue

            if s_start < o_start or s_end > o_end:
                bad.append(
                    f"Day{day.get('day')} {spot['name']} scheduled {spot.get('start_time')}-{spot.get('end_time')}"
                    f" but opens {rng.group(0)}"
                )

    return bad





def unknown_spots(route: list[dict[str, Any]], pois: list[dict[str, Any]]) -> list[str]:

    """"""

    valid = {s["name"] for s in pois}

    bad = []

    for day in route:

        for spot in day.get("spots", []):

            if spot["name"] not in valid:

                bad.append(f"Day{day.get('day')} {spot['name']}")

    return bad







def last_spot_of_period(day: dict[str, Any], period: str) -> dict[str, Any] | None:

    """"""

    spots = [s for s in day.get("spots", []) if s.get("period") == period]

    if spots:

        return spots[-1]

    all_spots = day.get("spots", [])

    if not all_spots:

        return None

    return all_spots[0] if period == "morning" else all_spots[-1]





def dinner_anchor_spot(day: dict[str, Any]) -> dict[str, Any] | None:

    """"""

    evening_spots = [s for s in day.get("spots", []) if s.get("period") == "evening"]

    if evening_spots:

        return evening_spots[0]

    return last_spot_of_period(day, "afternoon")







def invoke_structured(llm: Any, messages: list[tuple[str, str]], *, retries: int = 3) -> Any:
    """"""
    total_chars = sum(len(role) + len(content) for role, content in messages)
    schema_name = getattr(getattr(llm, "schema", None), "__name__", None)
    if schema_name is None:
        for attr in ("_schema", "schema_", "output_schema"):
            s = getattr(llm, attr, None)
            if s and hasattr(s, "__name__"):
                schema_name = s.__name__
                break
    label = schema_name or "unknown"

    for attempt in range(retries):
        t0 = time.perf_counter()
        result = llm.invoke(messages)
        elapsed = time.perf_counter() - t0

        if result is not None:
            if attempt > 0:
                logger.warning(
                    "[invoke_structured] %s succeeded on attempt %d in %.2fs"
                    " (input %d chars)",
                    label, attempt + 1, elapsed, total_chars,
                )
            else:
                logger.debug(
                    "[invoke_structured] %s completed in %.2fs (input %d chars)",
                    label, elapsed, total_chars,
                )
            return result

        logger.warning(
            "[invoke_structured] %s attempt %d returned None in %.2fs, retrying...",
            label, attempt + 1, elapsed,
        )

    raise RuntimeError(f"Structured invoke failed after {retries} retries, all returned None")

from backend.core.cache import cache_service

async def async_invoke_structured(llm: Any, messages: list[tuple[str, str]], *, retries: int = 3, cache_ttl: int = 3600) -> Any:
    """"""
    import hashlib
    # Create a unique key based on messages and schema
    msg_str = json.dumps(messages, sort_keys=True)
    schema_name = getattr(getattr(llm, "schema", None), "__name__", "unknown")
    cache_key = f"llm_cache:{schema_name}:{hashlib.md5(msg_str.encode()).hexdigest()}"
    
    cached = await cache_service.get_cached(cache_key)
    if cached:
        logger.info("[async_invoke_structured] Cache hit for %s", schema_name)
        # Parse back to schema if needed, or return raw dict (depends on how it's used)
        # For simplicity, returning raw dict for now
        return cached

    total_chars = sum(len(role) + len(content) for role, content in messages)
    label = schema_name

    for attempt in range(retries):
        t0 = time.perf_counter()
        result = await llm.ainvoke(messages)
        elapsed = time.perf_counter() - t0

        if result is not None:
            # result is typically a Pydantic object
            res_dict = result.model_dump() if hasattr(result, "model_dump") else result
            await cache_service.set_cached(cache_key, res_dict, cache_ttl)
            
            if attempt > 0:
                logger.warning(
                    "[async_invoke_structured] %s succeeded on attempt %d in %.2fs"
                    " (input %d chars)",
                    label, attempt + 1, elapsed, total_chars,
                )
            else:
                logger.debug(
                    "[async_invoke_structured] %s completed in %.2fs (input %d chars)",
                    label, elapsed, total_chars,
                )
            return result

        logger.warning(
            "[async_invoke_structured] %s attempt %d returned None in %.2fs, retrying...",
            label, attempt + 1, elapsed,
        )

    raise RuntimeError(f"Structured ainvoke failed after {retries} retries, all returned None")









def fetch_weather_for_dates(

    destination: str,

    start_date: date,

    end_date: date,

    api_key: str,

) -> tuple[list[dict[str, Any]], str | None]:

    """"""

    from backend.providers.weather.amap import fetch_forecast



    try:

        all_forecasts = fetch_forecast(destination, api_key)

    except Exception:

        all_forecasts = []



    if not all_forecasts:

        return [], "Weather data unavailable"



    forecast_map = {f["date"]: f for f in all_forecasts}



    travel_dates: list[str] = []

    cur = start_date

    while cur <= end_date:

        travel_dates.append(cur.isoformat())

        cur += timedelta(days=1)



    matched = [forecast_map[d] for d in travel_dates if d in forecast_map]

    missing_dates = [d for d in travel_dates if d not in forecast_map]



    if not matched:

        return [], "Weather forecast only covers the next 4 days. Your travel dates are beyond forecast range."



    note: str | None = None

    if missing_dates:

        note = (
            f"Weather forecast missing for dates: {', '.join(missing_dates)}. "
            "Plan may not reflect actual weather for those days."
        )



    return matched, note

async def fetch_weather_for_dates_async(
    destination: str,
    start_date: date,
    end_date: date,
    api_key: str,
) -> tuple[list[dict[str, Any]], str | None]:
    """"""
    from backend.providers.weather.amap import fetch_forecast_async

    try:
        all_forecasts = await fetch_forecast_async(destination, api_key)
    except Exception:
        all_forecasts = []

    if not all_forecasts:
        return [], "Weather data unavailable"

    forecast_map = {f["date"]: f for f in all_forecasts}

    travel_dates: list[str] = []
    cur = start_date
    while cur <= end_date:
        travel_dates.append(cur.isoformat())
        cur += timedelta(days=1)

    matched = [forecast_map[d] for d in travel_dates if d in forecast_map]
    missing_dates = [d for d in travel_dates if d not in forecast_map]

    if not matched:
        return [], "Weather forecast only covers the next 4 days. Your travel dates are beyond forecast range."

    note: str | None = None
    if missing_dates:
        note = (
            f"Weather forecast missing for dates: {', '.join(missing_dates)}. "
            "Plan may not reflect actual weather for those days."
        )

    return matched, note





def format_weather_for_llm(forecast: list[dict[str, Any]]) -> str:

    """"""

    if not forecast:

        return ""

    lines = []

    for w in forecast:

        warning = " ⚠️ Bad weather alert!" if w.get("is_bad") else ""

        lines.append(
            f"{w['date']}: Day: {w['day_weather']} / Night: {w['night_weather']}"
            f" Temp: {w['night_temp']}-{w['day_temp']}°C{warning}"
        )

    return "\n".join(lines)







def restaurant_to_dict(poi: dict[str, Any]) -> dict[str, Any] | None:

    """"""

    location = parse_location(poi.get("location"))

    if not location:

        return None



    biz_ext = poi.get("biz_ext") or {}

    if not isinstance(biz_ext, dict):

        biz_ext = {}



    cost_raw = str(biz_ext.get("cost", "")).strip()

    rating_raw = str(biz_ext.get("rating", "")).strip()

    try:

        rating: float | None = float(rating_raw) if rating_raw else None

    except ValueError:

        rating = None



    photos = poi.get("photos") or []

    photo: str | None = None

    if isinstance(photos, list) and photos and isinstance(photos[0], dict):

        photo = str(photos[0].get("url", "")).strip() or None



    open_time_r = (

        str(biz_ext.get("opentime2", "")).strip()

        or str(biz_ext.get("opentime", "")).strip()

        or None

    )

    tel_r = str(poi.get("tel") or "").strip() or None

    type_str = str(poi.get("type") or "")

    category = (type_str.split(";")[-1].strip() if ";" in type_str else type_str.strip()) or None



    return {

        "name": str(poi.get("name", "")),

        "cost": cost_raw or None,

        "rating": rating,

        "keytag": str(poi.get("type", "")),

        "location": location,

        "address": normalize_address(poi.get("address")),

        "photo": photo,

        "open_time": open_time_r,

        "tel": tel_r,

        "category": category,

    }

