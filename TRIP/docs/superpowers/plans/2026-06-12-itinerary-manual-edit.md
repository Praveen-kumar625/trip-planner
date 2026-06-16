#  [TRANSLATED]  /  [TRANSLATED]  /  [TRANSLATED] 

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:**  [TRANSLATED] SortableJS [TRANSLATED] / [TRANSLATED] / [TRANSLATED] 

**Architecture:**  [TRANSLATED] draft +  [TRANSLATED] ——`GET /api/poi/search` [TRANSLATED] Key  [TRANSLATED]  `PUT /api/plan/{plan_id}/timeline` [TRANSLATED]  timeline  [TRANSLATED]  plan_json [TRANSLATED]  `update_plan_json`  [TRANSLATED]  plan_id [TRANSLATED] 

**Tech Stack:** FastAPI + SQLite [TRANSLATED] SortableJS 1.15 [TRANSLATED] CDN [TRANSLATED] React 18  [TRANSLATED]  JSX [TRANSLATED] pytest + TestClient [TRANSLATED] 

** [TRANSLATED] ** `docs/superpowers/specs/2026-06-12-itinerary-manual-edit-design.md` [TRANSLATED] 

** [TRANSLATED] **
-  [TRANSLATED] `python run.py` [TRANSLATED] http://localhost:8765 [TRANSLATED] `python -m pytest tests/test_manual_edit_api.py -v`
-  [TRANSLATED] `plan_json.days[] = {day, date, theme, timeline[]}` [TRANSLATED] timeline  [TRANSLATED] 
  -  [TRANSLATED]  `{type:"attraction", name, start_time, end_time, period, rating, open_time, photo, location:{lat,lng}, tip, dist_from_prev_km}`
  -  [TRANSLATED]  `{type:"lunch"|"dinner", name, rating, cost, address, photo, location, reason, no_restaurant?, dist_from_prev_km}`
-  [TRANSLATED] JSX  [TRANSLATED]  Babel Standalone  [TRANSLATED]  `Object.assign(window, {...})`  [TRANSLATED] ** [TRANSLATED]  import/export**
-  [TRANSLATED] UI  [TRANSLATED] 

---

### Task 1:  [TRANSLATED]  —  [TRANSLATED]  POI  [TRANSLATED]  `search_city_pois`

 [TRANSLATED]  `search_attraction_pois`  [TRANSLATED] / [TRANSLATED] 

**Files:**
- Modify: `app/providers/amap/poi.py` [TRANSLATED]  `search_attraction_pois`  [TRANSLATED] 
- Test: `tests/test_manual_edit_api.py` [TRANSLATED] 

- [ ] **Step 1:  [TRANSLATED] **

 [TRANSLATED]  `tests/test_manual_edit_api.py` [TRANSLATED] 

```python
""" [TRANSLATED]  API  [TRANSLATED] search_city_pois / poi  [TRANSLATED]  / PUT timeline  [TRANSLATED] """

from __future__ import annotations

import uuid

import pytest
from fastapi.testclient import TestClient


# ─── search_city_pois ────────────────────────────────────────

class TestSearchCityPois:
    def test_ [TRANSLATED] (self, monkeypatch):
        from app.providers.amap import poi as poi_mod

        captured = {}

        def fake_get(url):
            captured["url"] = url
            return {"status": "1", "pois": [{"name": " [TRANSLATED] ", "location": "118.77,32.06"}]}

        monkeypatch.setattr(poi_mod, "http_get_json", fake_get)
        out = poi_mod.search_city_pois(" [TRANSLATED] ", "k", keywords=" [TRANSLATED] ", types=" [TRANSLATED] ", offset=8)
        assert out == [{"name": " [TRANSLATED] ", "location": "118.77,32.06"}]
        assert "citylimit=true" in captured["url"]
        assert "offset=8" in captured["url"]

    def test_ [TRANSLATED] RuntimeError(self, monkeypatch):
        from app.providers.amap import poi as poi_mod

        monkeypatch.setattr(poi_mod, "http_get_json", lambda url: {"status": "0", "info": "INVALID_KEY"})
        with pytest.raises(RuntimeError, match="INVALID_KEY"):
            poi_mod.search_city_pois(" [TRANSLATED] ", "k", keywords="x", types=" [TRANSLATED] ")
```

- [ ] **Step 2:  [TRANSLATED] **

Run: `python -m pytest tests/test_manual_edit_api.py -v`
Expected: FAIL [TRANSLATED] `AttributeError: ... has no attribute 'search_city_pois'`

- [ ] **Step 3:  [TRANSLATED]  `search_city_pois`**

 [TRANSLATED]  `app/providers/amap/poi.py`  [TRANSLATED]  `search_attraction_pois`  [TRANSLATED] 

```python
def search_city_pois(
    city: str,
    api_key: str,
    *,
    keywords: str,
    types: str,
    offset: int = 8,
) -> list[dict[str, Any]]:
    """ [TRANSLATED] / [TRANSLATED] """
    params: dict[str, str] = {
        "key": api_key,
        "keywords": keywords,
        "types": types,
        "city": city,
        "citylimit": "true",
        "offset": str(offset),
        "page": "1",
        "extensions": "all",
        "output": "json",
    }
    url = f"{AMAP_TEXT_SEARCH_URL}?{urllib.parse.urlencode(params)}"
    for attempt in range(4):
        data = http_get_json(url)
        if data.get("status") == "1":
            pois = data.get("pois", [])
            return pois if isinstance(pois, list) else []
        info = str(data.get("info") or " [TRANSLATED] ")
        if info not in AMAP_RATE_LIMIT_INFOS or attempt >= 3:
            raise RuntimeError(f" [TRANSLATED] {info}")
        time.sleep(1.2 * (attempt + 1))
    return []
```

- [ ] **Step 4:  [TRANSLATED] **

Run: `python -m pytest tests/test_manual_edit_api.py -v`
Expected: 2 passed

- [ ] **Step 5:  [TRANSLATED] **

```bash
git add app/providers/amap/poi.py tests/test_manual_edit_api.py
git commit -m "feat(amap):  [TRANSLATED]  search_city_pois  [TRANSLATED] "
```

---

### Task 2:  [TRANSLATED]  — `GET /api/poi/search`  [TRANSLATED] 

**Files:**
- Modify: `app/api/plan_routes.py` [TRANSLATED]  import [TRANSLATED] 
- Test: `tests/test_manual_edit_api.py` [TRANSLATED] 

- [ ] **Step 1:  [TRANSLATED]  fixture  [TRANSLATED] **

 [TRANSLATED]  `tests/test_manual_edit_api.py`  [TRANSLATED] 

```python
# ─── API  [TRANSLATED]  ────────────────────────────────────────

@pytest.fixture()
def client(tmp_path, monkeypatch):
    """ [TRANSLATED]  SQLite  [TRANSLATED]  Redis  [TRANSLATED] """
    import app.core.database as database

    monkeypatch.setattr(database, "_DB_PATH", tmp_path / "test.db")
    database.init_db()

    import app.api.plan_routes as plan_routes
    monkeypatch.setattr(plan_routes, "get_cached", lambda key: None)
    monkeypatch.setattr(plan_routes, "set_cached", lambda key, value, ttl: None)

    from app.main import app
    return TestClient(app)


def make_auth():
    """ [TRANSLATED]  id + Bearer  [TRANSLATED] """
    from app.core.auth import create_token

    uid = str(uuid.uuid4())
    return uid, {"Authorization": "Bearer " + create_token(uid)}


# ─── GET /api/poi/search ─────────────────────────────────────

class TestPoiSearch:
    def test_ [TRANSLATED] 401(self, client):
        r = client.get("/api/poi/search", params={"city": " [TRANSLATED] ", "kw": " [TRANSLATED] "})
        assert r.status_code == 401

    def test_ [TRANSLATED] kind [TRANSLATED] 400(self, client):
        _, headers = make_auth()
        r = client.get("/api/poi/search", params={"city": " [TRANSLATED] ", "kw": "x", "kind": "hotel"}, headers=headers)
        assert r.status_code == 400

    def test_attraction [TRANSLATED] (self, client, monkeypatch):
        import app.api.plan_routes as plan_routes

        captured = {}

        def fake_search(city, key, *, keywords, types, offset):
            captured.update(city=city, keywords=keywords, types=types)
            return [{
                "name": " [TRANSLATED] ", "location": "118.77,32.06",
                "biz_ext": {"rating": "4.7", "opentime2": " [TRANSLATED] "},
                "address": " [TRANSLATED] ", "photos": [],
            }]

        monkeypatch.setattr(plan_routes, "search_city_pois", fake_search)
        monkeypatch.setattr(plan_routes, "amap_key", lambda: "fake-key")

        _, headers = make_auth()
        r = client.get("/api/poi/search", params={"city": " [TRANSLATED] ", "kw": " [TRANSLATED] "}, headers=headers)
        assert r.status_code == 200
        assert captured["types"] == " [TRANSLATED] "
        results = r.json()["results"]
        assert results[0]["name"] == " [TRANSLATED] "
        assert results[0]["rating"] == 4.7
        assert results[0]["address"] == " [TRANSLATED] "
        assert results[0]["location"] == {"lng": 118.77, "lat": 32.06}

    def test_restaurant [TRANSLATED] (self, client, monkeypatch):
        import app.api.plan_routes as plan_routes

        captured = {}

        def fake_search(city, key, *, keywords, types, offset):
            captured["types"] = types
            return [{
                "name": " [TRANSLATED] ", "location": "118.78,32.04", "type": " [TRANSLATED] ; [TRANSLATED] ",
                "biz_ext": {"rating": "4.6", "cost": "80"}, "address": " [TRANSLATED] ", "photos": [],
            }]

        monkeypatch.setattr(plan_routes, "search_city_pois", fake_search)
        monkeypatch.setattr(plan_routes, "amap_key", lambda: "fake-key")

        _, headers = make_auth()
        r = client.get("/api/poi/search", params={"city": " [TRANSLATED] ", "kw": " [TRANSLATED] ", "kind": "restaurant"}, headers=headers)
        assert r.status_code == 200
        assert captured["types"] == " [TRANSLATED] "
        results = r.json()["results"]
        assert results[0]["cost"] == "80"

    def test_ [TRANSLATED] 502(self, client, monkeypatch):
        import app.api.plan_routes as plan_routes

        def boom(city, key, *, keywords, types, offset):
            raise RuntimeError(" [TRANSLATED] QUOTA")

        monkeypatch.setattr(plan_routes, "search_city_pois", boom)
        monkeypatch.setattr(plan_routes, "amap_key", lambda: "fake-key")

        _, headers = make_auth()
        r = client.get("/api/poi/search", params={"city": " [TRANSLATED] ", "kw": "x"}, headers=headers)
        assert r.status_code == 502
```

- [ ] **Step 2:  [TRANSLATED] **

Run: `python -m pytest tests/test_manual_edit_api.py -v`
Expected: TestPoiSearch  [TRANSLATED]  FAIL [TRANSLATED] 404 [TRANSLATED] TestSearchCityPois  [TRANSLATED]  PASS

- [ ] **Step 3:  [TRANSLATED] **

`app/api/plan_routes.py`  [TRANSLATED]  import  [TRANSLATED] 

```python
from app.core.cache import POI_TTL, get_cached, poi_cache_key, set_cached
from app.planning.helpers import amap_key, restaurant_to_dict
from app.providers.amap.poi import (
    ATTRACTION_TYPE,
    normalize_address,
    poi_to_spot,
    search_city_pois,
)
```

 [TRANSLATED] `haversine_km`  [TRANSLATED]  import  [TRANSLATED] 

```python
# ───  [TRANSLATED] POI  [TRANSLATED]  ──────────────────────────────────


@router.get("/api/poi/search")
def poi_search(
    city: str,
    kw: str,
    kind: str = "attraction",
    authorization: str | None = Header(default=None),
):
    """ [TRANSLATED] / [TRANSLATED]  Key  [TRANSLATED]  Redis  [TRANSLATED] """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail=" [TRANSLATED] ")
    if not decode_token(authorization[7:]):
        raise HTTPException(status_code=401, detail="token  [TRANSLATED] ")
    if kind not in ("attraction", "restaurant"):
        raise HTTPException(status_code=400, detail="kind  [TRANSLATED]  attraction  [TRANSLATED]  restaurant")

    cache_key = poi_cache_key(city, f"manual:{kind}:{kw}")
    cached = get_cached(cache_key)
    if cached is not None:
        return {"results": cached}

    types = ATTRACTION_TYPE if kind == "attraction" else " [TRANSLATED] "
    try:
        raw = search_city_pois(city, amap_key(), keywords=kw, types=types, offset=8)
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))

    results: list[dict] = []
    for poi in raw:
        parsed = poi_to_spot(poi) if kind == "attraction" else restaurant_to_dict(poi)
        if not parsed:
            continue
        if kind == "attraction":
            # poi_to_spot  [TRANSLATED] 
            parsed["address"] = normalize_address(poi.get("address"))
        results.append(parsed)
    results = results[:8]

    set_cached(cache_key, results, POI_TTL)
    return {"results": results}
```

- [ ] **Step 4:  [TRANSLATED] **

Run: `python -m pytest tests/test_manual_edit_api.py -v`
Expected:  [TRANSLATED]  PASS

- [ ] **Step 5:  [TRANSLATED] **

```bash
git add app/api/plan_routes.py tests/test_manual_edit_api.py
git commit -m "feat(api):  [TRANSLATED]  /api/poi/search  [TRANSLATED] / [TRANSLATED] "
```

---

### Task 3:  [TRANSLATED]  — `PUT /api/plan/{plan_id}/timeline`  [TRANSLATED] 

**Files:**
- Modify: `app/api/plan_routes.py` [TRANSLATED] 
- Test: `tests/test_manual_edit_api.py` [TRANSLATED] 

- [ ] **Step 1:  [TRANSLATED] **

 [TRANSLATED]  `tests/test_manual_edit_api.py`  [TRANSLATED] 

```python
# ─── PUT /api/plan/{plan_id}/timeline ────────────────────────

def make_plan(uid: str) -> str:
    """ [TRANSLATED]  plan_id [TRANSLATED] """
    from app.core.database import get_conn
    from app.core.memory import save_itinerary

    plan = {
        "destination": " [TRANSLATED] ", "start_date": "2026-06-10", "end_date": "2026-06-10",
        "days_count": 1,
        "days": [{
            "day": 1, "date": "2026-06-10", "theme": " [TRANSLATED] ",
            "timeline": [
                {"type": "attraction", "name": " [TRANSLATED] ", "start_time": "09:00", "end_time": "11:30",
                 "period": "morning", "location": {"lat": 32.058, "lng": 118.848}},
                {"type": "lunch", "name": " [TRANSLATED] ", "location": {"lat": 32.02, "lng": 118.79}},
                {"type": "attraction", "name": " [TRANSLATED] ", "start_time": "14:00", "end_time": "17:00",
                 "period": "afternoon", "location": {"lat": 32.021, "lng": 118.788}},
            ],
        }],
    }
    with get_conn() as conn:
        return save_itinerary(uid, plan, " [TRANSLATED] ", conn)


class TestSaveTimeline:
    def test_ [TRANSLATED] 401(self, client):
        r = client.put("/api/plan/x/timeline", json={"days": []})
        assert r.status_code == 401

    def test_ [TRANSLATED] 404(self, client):
        _, headers = make_auth()
        r = client.put("/api/plan/ [TRANSLATED] /timeline", json={"days": []}, headers=headers)
        assert r.status_code == 404

    def test_ [TRANSLATED] 403(self, client):
        owner, _ = make_auth()
        pid = make_plan(owner)
        _, other_headers = make_auth()
        r = client.put(f"/api/plan/{pid}/timeline", json={"days": []}, headers=other_headers)
        assert r.status_code == 403

    def test_day [TRANSLATED] 400(self, client):
        uid, headers = make_auth()
        pid = make_plan(uid)
        r = client.put(f"/api/plan/{pid}/timeline",
                       json={"days": [{"day": 9, "timeline": []}]}, headers=headers)
        assert r.status_code == 400

    def test_ [TRANSLATED] type [TRANSLATED] 422(self, client):
        uid, headers = make_auth()
        pid = make_plan(uid)
        r = client.put(f"/api/plan/{pid}/timeline",
                       json={"days": [{"day": 1, "timeline": [{"name": " [TRANSLATED] "}]}]}, headers=headers)
        assert r.status_code == 422

    def test_ [TRANSLATED] name422(self, client):
        uid, headers = make_auth()
        pid = make_plan(uid)
        r = client.put(f"/api/plan/{pid}/timeline",
                       json={"days": [{"day": 1, "timeline": [{"type": "attraction"}]}]}, headers=headers)
        assert r.status_code == 422

    def test_ [TRANSLATED] _ [TRANSLATED] _ [TRANSLATED] (self, client):
        from app.core.database import get_conn
        from app.core.memory import load_itinerary
        from app.planning.helpers import haversine_km

        uid, headers = make_auth()
        pid = make_plan(uid)

        #  [TRANSLATED] 
        new_timeline = [
            {"type": "attraction", "name": " [TRANSLATED] ", "start_time": "09:00", "end_time": "11:30",
             "period": "morning", "location": {"lat": 32.021, "lng": 118.788},
             "dist_from_prev_km": 999},
            {"type": "lunch", "name": " [TRANSLATED] ", "location": {"lat": 32.02, "lng": 118.79},
             "dist_from_prev_km": 999},
            {"type": "attraction", "name": " [TRANSLATED] ", "start_time": "14:00", "end_time": "17:00",
             "period": "afternoon", "location": {"lat": 32.058, "lng": 118.848}},
        ]
        r = client.put(f"/api/plan/{pid}/timeline",
                       json={"days": [{"day": 1, "timeline": new_timeline}]}, headers=headers)
        assert r.status_code == 200

        saved = r.json()["plan"]["days"][0]["timeline"]
        assert [it["name"] for it in saved] == [" [TRANSLATED] ", " [TRANSLATED] ", " [TRANSLATED] "]
        #  [TRANSLATED]  =  [TRANSLATED]  haversine  [TRANSLATED]  999  [TRANSLATED] 
        assert "dist_from_prev_km" not in saved[0]
        expect = round(haversine_km({"lat": 32.021, "lng": 118.788}, {"lat": 32.02, "lng": 118.79}), 2)
        assert saved[1]["dist_from_prev_km"] == expect

        #  [TRANSLATED] 
        with get_conn() as conn:
            reloaded = load_itinerary(pid, conn)["plan"]
        assert reloaded["days"][0]["timeline"] == saved
```

- [ ] **Step 2:  [TRANSLATED] **

Run: `python -m pytest tests/test_manual_edit_api.py -v -k SaveTimeline`
Expected:  [TRANSLATED]  401  [TRANSLATED]  FAIL [TRANSLATED] 405/404 [TRANSLATED] 

 [TRANSLATED] FastAPI  [TRANSLATED]  PUT  [TRANSLATED]  405/404  [TRANSLATED]  401 [TRANSLATED] `test_ [TRANSLATED] 401`  [TRANSLATED]  FAIL—— [TRANSLATED] 

- [ ] **Step 3:  [TRANSLATED] **

`app/api/plan_routes.py`  [TRANSLATED] 

```python
# ───  [TRANSLATED]  timeline ─────────────────────────────


def _recalc_dists(timeline: list[dict]) -> None:
    """ [TRANSLATED]  dist_from_prev_km [TRANSLATED] """
    for i, item in enumerate(timeline):
        if i == 0:
            item.pop("dist_from_prev_km", None)
            continue
        prev_loc = timeline[i - 1].get("location")
        cur_loc = item.get("location")
        if prev_loc and cur_loc:
            item["dist_from_prev_km"] = round(haversine_km(prev_loc, cur_loc), 2)
        else:
            item.pop("dist_from_prev_km", None)


class TimelineDayPayload(BaseModel):
    day: int                  # 1-based
    timeline: list[dict]


class SaveTimelineRequest(BaseModel):
    days: list[TimelineDayPayload]


@router.put("/api/plan/{plan_id}/timeline")
def save_timeline(
    plan_id: str,
    req: SaveTimelineRequest,
    authorization: str | None = Header(default=None),
):
    """ [TRANSLATED]  timeline [TRANSLATED]  timeline [TRANSLATED]  plan  [TRANSLATED] """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail=" [TRANSLATED] ")
    user_id = decode_token(authorization[7:])
    if not user_id:
        raise HTTPException(status_code=401, detail="token  [TRANSLATED] ")

    with get_conn() as conn:
        row = conn.execute(
            "SELECT user_id FROM itineraries WHERE id=?", (plan_id,)
        ).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail=" [TRANSLATED] ")
        if row["user_id"] != user_id:
            raise HTTPException(status_code=403, detail=" [TRANSLATED] ")
        data = load_itinerary(plan_id, conn)

    plan = data["plan"]
    day_by_no = {d.get("day"): d for d in plan.get("days", [])}
    for payload in req.days:
        day_obj = day_by_no.get(payload.day)
        if not day_obj:
            raise HTTPException(status_code=400, detail=f" [TRANSLATED]  {payload.day}  [TRANSLATED] ")
        for item in payload.timeline:
            if not isinstance(item, dict) or not item.get("type"):
                raise HTTPException(status_code=422, detail="timeline  [TRANSLATED]  type")
            if item["type"] == "attraction" and not item.get("name"):
                raise HTTPException(status_code=422, detail=" [TRANSLATED]  name")
        _recalc_dists(payload.timeline)
        day_obj["timeline"] = payload.timeline

    with get_conn() as conn:
        ok = update_plan_json(plan_id, user_id, plan, conn)
    if not ok:
        raise HTTPException(status_code=500, detail=" [TRANSLATED] ")

    return {"plan": plan}
```

- [ ] **Step 4:  [TRANSLATED] **

Run: `python -m pytest tests/test_manual_edit_api.py -v`
Expected:  [TRANSLATED]  PASS

- [ ] **Step 5:  [TRANSLATED] **

```bash
git add app/api/plan_routes.py tests/test_manual_edit_api.py
git commit -m "feat(api):  [TRANSLATED]  PUT /api/plan/{id}/timeline  [TRANSLATED] "
```

---

### Task 4:  [TRANSLATED]  — SortableJS CDN + api.js  [TRANSLATED]  + edit.jsx  [TRANSLATED] 

**Files:**
- Modify: `frontend/index.html:18` [TRANSLATED] Babel script  [TRANSLATED]  SortableJS [TRANSLATED]  edit.jsx [TRANSLATED] 
- Modify: `frontend/api.js` [TRANSLATED] `revertDay`  [TRANSLATED]  +  [TRANSLATED] 
- Create: `frontend/edit.jsx` [TRANSLATED] Task 5  [TRANSLATED] 

- [ ] **Step 1: index.html  [TRANSLATED] **

Babel  [TRANSLATED] `@babel/standalone` [TRANSLATED] 

```html
  <!-- SortableJS [TRANSLATED]  -->
  <script src="https://unpkg.com/sortablejs@1.15.6/Sortable.min.js" crossorigin></script>
```

 [TRANSLATED]  `components.jsx`  [TRANSLATED]  `pages.jsx`  [TRANSLATED] 

```html
  <script type="text/babel" src="/edit.jsx"></script>
```

- [ ] **Step 2: api.js  [TRANSLATED] **

 [TRANSLATED]  `revertDay`  [TRANSLATED] 

```js
/* ──  [TRANSLATED]  ─────────────────────────────────────── */
async function searchPoi(city, kw, kind) {
  const qs = new URLSearchParams({ city, kw, kind });
  const r = await fetch(`/api/poi/search?${qs}`, { headers: authHeaders() });
  if (!r.ok) { const d = await r.json().catch(() => ({})); throw new Error(d.detail || " [TRANSLATED] "); }
  return (await r.json()).results || [];
}

async function saveTimeline(plan_id, days) {
  const r = await fetch(`/api/plan/${encodeURIComponent(plan_id)}/timeline`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ days }),
  });
  if (!r.ok) { const d = await r.json().catch(() => ({})); throw new Error(d.detail || " [TRANSLATED] "); }
  return r.json();
}
```

 [TRANSLATED]  `Object.assign(window, {...})`  [TRANSLATED]  `searchPoi, saveTimeline,` [TRANSLATED]  `optimizeDay, revertDay,`  [TRANSLATED] 

- [ ] **Step 3:  [TRANSLATED]  edit.jsx  [TRANSLATED] **

 [TRANSLATED]  `frontend/edit.jsx` [TRANSLATED] 

```jsx
// edit.jsx —  [TRANSLATED]  /  [TRANSLATED]  /  [TRANSLATED]  /  [TRANSLATED] Task 5  [TRANSLATED] 
```

- [ ] **Step 4:  [TRANSLATED] **

 [TRANSLATED]  `python run.py` [TRANSLATED]  http://localhost:8765  [TRANSLATED] `window.Sortable`  [TRANSLATED]  `window.searchPoi`  [TRANSLATED] DevTools console  [TRANSLATED] 

- [ ] **Step 5:  [TRANSLATED] **

```bash
git add frontend/index.html frontend/api.js frontend/edit.jsx
git commit -m "feat(frontend):  [TRANSLATED] ——SortableJS CDN [TRANSLATED] searchPoi/saveTimeline  [TRANSLATED] "
```

---

### Task 5:  [TRANSLATED]  — edit.jsx  [TRANSLATED] 

 [TRANSLATED]  +  [TRANSLATED]  +  [TRANSLATED]  +  [TRANSLATED]  +  [TRANSLATED]  +  [TRANSLATED]  window [TRANSLATED] 

**Files:**
- Modify: `frontend/edit.jsx` [TRANSLATED] 

- [ ] **Step 1:  [TRANSLATED]  edit.jsx**

```jsx
// edit.jsx —  [TRANSLATED]  /  [TRANSLATED]  /  [TRANSLATED]  /  [TRANSLATED] 

/* ──  [TRANSLATED]  ──────────────────────────────────── */

//  [TRANSLATED]  helpers.haversine_km  [TRANSLATED] 
function haversineKm(a, b) {
  const R = 6371.0;
  const rad = (x) => (x * Math.PI) / 180;
  const dlat = rad(b.lat - a.lat), dlon = rad(b.lng - a.lng);
  const h = Math.sin(dlat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dlon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

//  [TRANSLATED]  timeline  [TRANSLATED]  dist_from_prev_km [TRANSLATED]  _recalc_dists  [TRANSLATED] 
function recalcDayDists(timeline) {
  timeline.forEach((item, i) => {
    if (i === 0) { delete item.dist_from_prev_km; return; }
    const prev = timeline[i - 1].location, cur = item.location;
    if (prev && cur) item.dist_from_prev_km = Math.round(haversineKm(prev, cur) * 100) / 100;
    else delete item.dist_from_prev_km;
  });
}

//  [TRANSLATED] ——
//  [TRANSLATED] 
function reorderKeepTimes(timeline, from, to) {
  const slots = timeline
    .filter(it => it.type === "attraction")
    .map(it => ({ start_time: it.start_time, end_time: it.end_time, period: it.period }));
  const arr = timeline.slice();
  const [moved] = arr.splice(from, 1);
  arr.splice(to, 0, moved);
  let si = 0;
  return arr.map(it => (it.type === "attraction" ? { ...it, ...slots[si++] } : it));
}

/* ──  [TRANSLATED] / [TRANSLATED]   [TRANSLATED] · [TRANSLATED]  ───────────────── */
function PoiSearchModal({ city, kind, title, onPick, onClose }) {
  const [kw, setKw] = React.useState("");
  const [results, setResults] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");

  const search = async () => {
    if (!kw.trim() || loading) return;
    setLoading(true); setErr("");
    try {
      const r = await searchPoi(city, kw.trim(), kind);
      setResults(r);
      if (!r.length) setErr(" [TRANSLATED] ");
    } catch (e) { setErr(e.message || " [TRANSLATED] "); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card poi-search-card">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">{title}</div>
        <div className="poi-search-bar">
          <input className="form-input" autoFocus value={kw}
            placeholder={kind === "restaurant" ? " [TRANSLATED] " : " [TRANSLATED] "}
            onChange={(e) => setKw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()} />
          <button className="go-btn" onClick={search} disabled={loading || !kw.trim()}>
            {loading ? " [TRANSLATED] …" : " [TRANSLATED] "}
          </button>
        </div>
        {err && <div className="poi-search-err">{err}</div>}
        <div className="poi-results">
          {(results || []).map((p, i) => (
            <button key={i} className="poi-result" onClick={() => onPick(p)}>
              <span className="poi-result-name">{p.name}</span>
              <span className="poi-result-meta">
                {p.rating != null && <span>★ {Number(p.rating).toFixed(1)}</span>}
                {p.cost && <span>¥{p.cost}/ [TRANSLATED] </span>}
                {p.open_time && <span> [TRANSLATED]  {p.open_time}</span>}
                {p.address && <span>{p.address}</span>}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──  [TRANSLATED]  ─────────────────────────── */
function TimeRangeEditor({ start, end, onCommit }) {
  const [st, setSt] = React.useState(start || "");
  const [et, setEt] = React.useState(end || "");
  const [bad, setBad] = React.useState(false);

  //  [TRANSLATED] / [TRANSLATED] 
  React.useEffect(() => { setSt(start || ""); setEt(end || ""); setBad(false); }, [start, end]);

  const commit = () => {
    if (st && et && st >= et) { setBad(true); return; }
    setBad(false);
    if (st !== (start || "") || et !== (end || "")) onCommit(st || null, et || null);
  };

  return (
    <span className={`time-edit ${bad ? "bad" : ""}`}>
      <input type="time" value={st} onChange={(e) => setSt(e.target.value)} onBlur={commit} />
      <span>–</span>
      <input type="time" value={et} onChange={(e) => setEt(e.target.value)} onBlur={commit} />
      {bad && <span className="time-edit-err"> [TRANSLATED] </span>}
    </span>
  );
}

/* ──  [TRANSLATED]  ─────────────────────────────────────── */
function EditCard({ raw, dist, onReplace, onDelete, onTimeChange }) {
  const isAttr = raw.type === "attraction";
  const mealLabel = isAttr ? null : raw.type === "lunch" ? " [TRANSLATED] " : " [TRANSLATED] ";
  return (
    <div className="edit-card">
      <span className="drag-grip" title=" [TRANSLATED] ">⠿</span>
      <div className="edit-card-body">
        <div className="edit-card-title">
          <span>{raw.name || `${mealLabel || " [TRANSLATED] "} [TRANSLATED] `}</span>
          {mealLabel && <span className="meal-flag">{mealLabel}</span>}
          {dist != null && dist > 0 && <span className="edit-dist">↕ {dist} km</span>}
        </div>
        <div className="edit-card-meta">
          {isAttr && <TimeRangeEditor start={raw.start_time} end={raw.end_time} onCommit={onTimeChange} />}
          {raw.rating != null && <span className="star">★ {Number(raw.rating).toFixed(1)}</span>}
          {!isAttr && raw.cost && <span>¥{raw.cost}/ [TRANSLATED] </span>}
          {isAttr && raw.open_time && <span> [TRANSLATED]  {raw.open_time}</span>}
        </div>
      </div>
      <div className="edit-card-acts">
        <button className="edit-act" onClick={onReplace}>↔  [TRANSLATED] </button>
        <button className="edit-act danger" onClick={onDelete} title=" [TRANSLATED] ">✕</button>
      </div>
    </div>
  );
}

/* ──  [TRANSLATED]  ───────────────────────────────────── */
// ver [TRANSLATED]  draft  [TRANSLATED]  +1 [TRANSLATED]  key  [TRANSLATED] 
//  [TRANSLATED]  Sortable  [TRANSLATED]  DOM  [TRANSLATED]  React state  [TRANSLATED] SortableJS×React  [TRANSLATED] 
function EditableTimeline({ rawTimeline, ver, onReorder, onReplace, onDelete, onTimeChange, onAdd }) {
  const listRef = React.useRef(null);

  React.useEffect(() => {
    if (!listRef.current || !window.Sortable) return;
    const s = window.Sortable.create(listRef.current, {
      animation: 180,
      handle: ".drag-grip",
      ghostClass: "edit-ghost",
      onEnd: (evt) => {
        if (evt.oldIndex !== evt.newIndex) onReorder(evt.oldIndex, evt.newIndex);
      },
    });
    return () => s.destroy();
  }, [ver]); // eslint-disable-line

  return (
    <div className="edit-timeline">
      <div ref={listRef} key={ver} className="edit-list">
        {rawTimeline.map((raw, i) => (
          <EditCard key={`${ver}-${i}`} raw={raw} dist={raw.dist_from_prev_km}
            onReplace={() => onReplace(i)}
            onDelete={() => onDelete(i)}
            onTimeChange={(st, et) => onTimeChange(i, st, et)} />
        ))}
      </div>
      {rawTimeline.length === 0 && <div className="edit-empty"> [TRANSLATED] </div>}
      <div className="edit-add-row">
        <button className="edit-add" onClick={() => onAdd("attraction")}> [TRANSLATED]   [TRANSLATED] </button>
        <button className="edit-add" onClick={() => onAdd("lunch")}> [TRANSLATED]   [TRANSLATED] </button>
        <button className="edit-add" onClick={() => onAdd("dinner")}> [TRANSLATED]   [TRANSLATED] </button>
      </div>
    </div>
  );
}

/* ──  [TRANSLATED]  ─────────────────────────────────────── */
function EditToolbar({ canUndo, canRedo, saving, saveErr, onUndo, onRedo, onCancel, onSave }) {
  return (
    <div className="edit-toolbar">
      <button className="edit-tool" disabled={!canUndo} onClick={onUndo}>↩  [TRANSLATED] </button>
      <button className="edit-tool" disabled={!canRedo} onClick={onRedo}>↪  [TRANSLATED] </button>
      <span className="edit-toolbar-hint">{saveErr ? "" : " [TRANSLATED]  ⠿  [TRANSLATED]  ·  [TRANSLATED] "}</span>
      {saveErr && <span className="edit-save-err">{saveErr}</span>}
      <button className="edit-tool" onClick={onCancel}>✕  [TRANSLATED] </button>
      <button className="edit-tool primary" disabled={saving} onClick={onSave}>
        {saving ? " [TRANSLATED] …" : "✓  [TRANSLATED] "}
      </button>
    </div>
  );
}

Object.assign(window, {
  haversineKm, recalcDayDists, reorderKeepTimes,
  PoiSearchModal, TimeRangeEditor, EditCard, EditableTimeline, EditToolbar,
});
```

- [ ] **Step 2:  [TRANSLATED] **

 [TRANSLATED]  http://localhost:8765  [TRANSLATED]  Babel  [TRANSLATED] `window.EditableTimeline`  [TRANSLATED] 

- [ ] **Step 3:  [TRANSLATED] **

```bash
git add frontend/edit.jsx
git commit -m "feat(frontend):  [TRANSLATED] —— [TRANSLATED] / [TRANSLATED] / [TRANSLATED] / [TRANSLATED] "
```

---

### Task 6:  [TRANSLATED]  — TripDetailPage  [TRANSLATED] 

**Files:**
- Modify: `frontend/pages.jsx` [TRANSLATED] TripDetailPage  [TRANSLATED]  289-465  [TRANSLATED] 

- [ ] **Step 1:  [TRANSLATED]  state  [TRANSLATED] **

 [TRANSLATED]  TripDetailPage  [TRANSLATED]  state  [TRANSLATED] `dayMsg`  [TRANSLATED] 

```jsx
  // ──  [TRANSLATED]  ──
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(null);          // _raw.days  [TRANSLATED] 
  const [undoStack, setUndoStack] = React.useState([]);    //  [TRANSLATED]  = draft  [TRANSLATED] 
  const [redoStack, setRedoStack] = React.useState([]);
  const [editVer, setEditVer] = React.useState(0);         //  [TRANSLATED]  +1 [TRANSLATED]  Sortable  [TRANSLATED] 
  const [saving, setSaving] = React.useState(false);
  const [saveErr, setSaveErr] = React.useState("");
  //  [TRANSLATED] { dayI, idx }  [TRANSLATED] { dayI, idx:null, addType }  [TRANSLATED] 
  const [searchTarget, setSearchTarget] = React.useState(null);

  const dirty = undoStack.length > 0;

  //  [TRANSLATED] / [TRANSLATED] 
  React.useEffect(() => {
    if (!editing || !dirty) return;
    const onBeforeUnload = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [editing, dirty]);

  const enterEdit = () => {
    setDraft(structuredClone(plan._raw.days));
    setUndoStack([]); setRedoStack([]); setSaveErr("");
    setEditing(true); setEditVer(v => v + 1);
  };

  const exitEdit = () => {
    if (dirty && !confirm(" [TRANSLATED] ")) return;
    setEditing(false); setDraft(null); setSaveErr("");
  };

  //  [TRANSLATED]  →  [TRANSLATED]  →  [TRANSLATED]  →  [TRANSLATED] 
  const applyEdit = (mutate) => {
    setUndoStack(s => [...s, draft]);
    setRedoStack([]);
    const next = structuredClone(draft);
    mutate(next);
    next.forEach(d => recalcDayDists(d.timeline));
    setDraft(next); setEditVer(v => v + 1);
  };

  const undo = () => {
    if (!undoStack.length) return;
    setRedoStack(r => [...r, draft]);
    setDraft(undoStack[undoStack.length - 1]);
    setUndoStack(s => s.slice(0, -1));
    setEditVer(v => v + 1);
  };

  const redo = () => {
    if (!redoStack.length) return;
    setUndoStack(s => [...s, draft]);
    setDraft(redoStack[redoStack.length - 1]);
    setRedoStack(r => r.slice(0, -1));
    setEditVer(v => v + 1);
  };

  const saveEdit = async () => {
    setSaving(true); setSaveErr("");
    try {
      const days = draft.map((d, i) => ({ day: d.day ?? i + 1, timeline: d.timeline }));
      const res = await saveTimeline(planId, days);
      const adapted = adaptPlan(res.plan, currentUsername);
      adapted.logs = plan.logs;
      setPlan(adapted);
      setEditing(false); setDraft(null);
      setOptimizedDays({});   //  [TRANSLATED] " [TRANSLATED] " [TRANSLATED] 
    } catch (e) {
      setSaveErr(e.message || " [TRANSLATED] ");
    } finally { setSaving(false); }
  };

  // ──  [TRANSLATED]  ──
  const handleReorder = (from, to) =>
    applyEdit(d => { d[dayIdx].timeline = reorderKeepTimes(d[dayIdx].timeline, from, to); });

  const handleDelete = (idx) =>
    applyEdit(d => { d[dayIdx].timeline.splice(idx, 1); });

  const handleTimeChange = (idx, st, et) =>
    applyEdit(d => { Object.assign(d[dayIdx].timeline[idx], { start_time: st, end_time: et }); });

  const handlePoiPick = (poi) => {
    const { idx, addType } = searchTarget;
    setSearchTarget(null);
    applyEdit(d => {
      const tl = d[dayIdx].timeline;
      if (idx != null) {
        const old = tl[idx];
        if (old.type === "attraction") {
          //  [TRANSLATED]  POI [TRANSLATED] 
          tl[idx] = { ...old, name: poi.name, rating: poi.rating ?? null,
            open_time: poi.open_time ?? null, location: poi.location,
            photo: poi.photo ?? null, tip: null };
        } else {
          tl[idx] = { type: old.type, name: poi.name, rating: poi.rating ?? null,
            cost: poi.cost ?? null, address: poi.address ?? null,
            location: poi.location, photo: poi.photo ?? null,
            reason: null, no_restaurant: false };
        }
      } else if (addType === "attraction") {
        tl.push({ type: "attraction", name: poi.name, rating: poi.rating ?? null,
          open_time: poi.open_time ?? null, location: poi.location,
          photo: poi.photo ?? null, tip: null,
          start_time: null, end_time: null, period: "afternoon" });
      } else {
        tl.push({ type: addType, name: poi.name, rating: poi.rating ?? null,
          cost: poi.cost ?? null, address: poi.address ?? null,
          location: poi.location, photo: poi.photo ?? null,
          reason: null, no_restaurant: false });
      }
    });
  };

  //  [TRANSLATED] draft  [TRANSLATED]  adaptPlan  [TRANSLATED] /items  [TRANSLATED] 
  const editedView = React.useMemo(() => {
    if (!editing || !draft) return null;
    const adapted = adaptPlan({ ...plan._raw, days: draft }, currentUsername);
    adapted.logs = plan.logs;
    return adapted;
  }, [editing, editVer]); // eslint-disable-line
```

 [TRANSLATED]  `startModify` [TRANSLATED] 

```jsx
  const startModify = () => {
    if (editing && !confirm(" [TRANSLATED] ")) return;
    if (!getAuth()) { onRequestLogin?.(); return; }
    if (!modQuery.trim() || !planId) return;
    onRequestModify?.(modQuery, planId);
  };
```

- [ ] **Step 2:  [TRANSLATED] **

 [TRANSLATED]  TripDetailPage  [TRANSLATED]  `const day = plan.days[dayIdx];`  [TRANSLATED] 

```jsx
  if (!plan) return null;
  const viewPlan = editing && editedView ? editedView : plan;
  const day = viewPlan.days[dayIdx];
```

 [TRANSLATED]  JSX  [TRANSLATED]  `plan.days.map`  [TRANSLATED]  day-tabs [TRANSLATED] `plan.weather` [TRANSLATED] `plan.tips`  [TRANSLATED]  `plan`  [TRANSLATED] —— [TRANSLATED] / [TRANSLATED]  `day` [TRANSLATED]  viewPlan [TRANSLATED] 

day-header  [TRANSLATED] / [TRANSLATED] 

```jsx
          <div className="day-header">
            <div className="day-theme">{day.theme}</div>
            {dayMsg && dayMsg.day === dayNo && <span className="day-opt-msg">{dayMsg.text}</span>}
            {!editing && planId && (
              <button className="optimize-btn" onClick={enterEdit}>✏️  [TRANSLATED] </button>
            )}
            {!editing && hasAttractions && planId && (
              isOptimized ? (
                <button className="revert-btn" onClick={() => handleRevert(dayNo)}>↩  [TRANSLATED] </button>
              ) : (
                <button className="optimize-btn" disabled={optimizingDay === dayNo} onClick={() => handleOptimize(dayNo)}>
                  {optimizingDay === dayNo ? " [TRANSLATED] …" : "🔀  [TRANSLATED] "}
                </button>
              )
            )}
          </div>
```

`<Timeline items={day.items} key={dayIdx} />`  [TRANSLATED] 

```jsx
          {editing ? (
            <>
              <EditToolbar canUndo={undoStack.length > 0} canRedo={redoStack.length > 0}
                saving={saving} saveErr={saveErr}
                onUndo={undo} onRedo={redo} onCancel={exitEdit} onSave={saveEdit} />
              <EditableTimeline rawTimeline={draft[dayIdx].timeline} ver={`${dayIdx}-${editVer}`}
                onReorder={handleReorder}
                onReplace={(idx) => setSearchTarget({ dayI: dayIdx, idx })}
                onDelete={handleDelete}
                onTimeChange={handleTimeChange}
                onAdd={(addType) => setSearchTarget({ dayI: dayIdx, idx: null, addType })} />
            </>
          ) : (
            <Timeline items={day.items} key={dayIdx} />
          )}
```

 [TRANSLATED]  `<MapPanel day={day} dayIdx={dayIdx} />`  [TRANSLATED] day  [TRANSLATED]  viewPlan [TRANSLATED] 

 [TRANSLATED] `concernModal`  [TRANSLATED] 

```jsx
      {searchTarget && (
        <PoiSearchModal
          city={plan.destination}
          kind={searchTarget.idx != null
            ? (draft[searchTarget.dayI].timeline[searchTarget.idx].type === "attraction" ? "attraction" : "restaurant")
            : (searchTarget.addType === "attraction" ? "attraction" : "restaurant")}
          title={searchTarget.idx != null ? " [TRANSLATED] …" : " [TRANSLATED] …"}
          onPick={handlePoiPick}
          onClose={() => setSearchTarget(null)} />
      )}
```

 [TRANSLATED] query-card  [TRANSLATED] 

```jsx
      {!editing && (
        <div className="query-card" style={{ margin: "30px auto 0", maxWidth: 760 }}>
          {/* … [TRANSLATED] … */}
        </div>
      )}
```

- [ ] **Step 3:  [TRANSLATED] **

 [TRANSLATED]  →  [TRANSLATED]  →  [TRANSLATED] ✏️  [TRANSLATED] / [TRANSLATED] 

- [ ] **Step 4:  [TRANSLATED] **

```bash
git add frontend/pages.jsx
git commit -m "feat(frontend):  [TRANSLATED] / [TRANSLATED] / [TRANSLATED] / [TRANSLATED] / [TRANSLATED] "
```

---

### Task 7:  [TRANSLATED]  —  [TRANSLATED]  CSS

**Files:**
- Modify: `frontend/style.css` [TRANSLATED] 

- [ ] **Step 1:  [TRANSLATED] **

 [TRANSLATED] `--card / --line-2 / --accent / --second / --ink-3`  [TRANSLATED]  style.css  [TRANSLATED] 

```css
/* ──  [TRANSLATED]  ─────────────────────────────────── */
.edit-toolbar {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 14px; margin-bottom: 14px;
  background: var(--card); border: 1px solid var(--line-2); border-radius: 12px;
  position: sticky; top: 10px; z-index: 20;
}
.edit-toolbar-hint { flex: 1; font-size: .78rem; color: var(--ink-3); }
.edit-save-err { flex: 1; font-size: .8rem; color: var(--accent); }
.edit-tool {
  font-size: .82rem; padding: 6px 14px; border-radius: 8px;
  border: 1px solid var(--line-2); background: var(--card); color: inherit; cursor: pointer;
}
.edit-tool:disabled { opacity: .4; cursor: default; }
.edit-tool.primary { background: var(--accent); color: var(--accent-ink); border-color: var(--accent); font-weight: 700; }

.edit-list { display: flex; flex-direction: column; gap: 10px; }
.edit-card {
  display: flex; align-items: center; gap: 10px;
  background: var(--card); border: 1px solid var(--line-2); border-radius: 12px;
  padding: 12px 14px;
}
.edit-ghost { opacity: .45; border-style: dashed; border-color: var(--accent); }
.drag-grip { cursor: grab; color: var(--ink-4); font-size: 1.1rem; user-select: none; padding: 4px 2px; }
.drag-grip:active { cursor: grabbing; }
.edit-card-body { flex: 1; min-width: 0; }
.edit-card-title { display: flex; align-items: center; gap: 8px; font-weight: 700; }
.edit-dist { font-size: .72rem; color: var(--ink-3); font-weight: 400; }
.edit-card-meta { display: flex; align-items: center; gap: 12px; margin-top: 4px; font-size: .8rem; color: var(--ink-3); flex-wrap: wrap; }
.edit-card-acts { display: flex; gap: 6px; }
.edit-act {
  font-size: .75rem; padding: 4px 10px; border-radius: 99px;
  border: 1px solid var(--line-2); background: transparent; color: inherit; cursor: pointer;
}
.edit-act.danger:hover { border-color: var(--accent); color: var(--accent); }

.edit-empty { padding: 26px 0; text-align: center; color: var(--ink-3); font-size: .85rem; }
.edit-add-row { display: flex; gap: 8px; margin-top: 12px; }
.edit-add {
  font-size: .8rem; padding: 7px 16px; border-radius: 99px;
  border: 1px dashed var(--line-2); background: transparent; color: var(--ink-3); cursor: pointer;
}
.edit-add:hover { border-color: var(--accent); color: var(--accent); }

.time-edit { display: inline-flex; align-items: center; gap: 4px; }
.time-edit input[type="time"] {
  border: 1px solid var(--line-2); border-radius: 6px; padding: 2px 6px;
  background: var(--card); color: inherit; font: inherit; font-size: .78rem;
}
.time-edit.bad input { border-color: var(--accent); }
.time-edit-err { font-size: .72rem; color: var(--accent); }

.poi-search-card { width: min(520px, 92vw); }
.poi-search-bar { display: flex; gap: 8px; margin-top: 6px; }
.poi-search-bar .form-input { flex: 1; }
.poi-search-err { margin-top: 10px; font-size: .82rem; color: var(--accent); }
.poi-results { margin-top: 12px; display: flex; flex-direction: column; gap: 8px; max-height: 320px; overflow-y: auto; }
.poi-result {
  text-align: left; padding: 10px 12px; border-radius: 10px;
  border: 1px solid var(--line-2); background: var(--card); color: inherit; cursor: pointer;
}
.poi-result:hover { border-color: var(--accent); }
.poi-result-name { display: block; font-weight: 700; }
.poi-result-meta { display: flex; gap: 10px; flex-wrap: wrap; font-size: .75rem; color: var(--ink-3); margin-top: 3px; }
```

 [TRANSLATED]  style.css  [TRANSLATED]  `--ink-4`  [TRANSLATED]  `.drag-grip`  [TRANSLATED]  `var(--ink-3)` [TRANSLATED]  `grep -n "ink-4" frontend/style.css`  [TRANSLATED] 

- [ ] **Step 2:  [TRANSLATED] **

 [TRANSLATED]  ghost  [TRANSLATED] 

- [ ] **Step 3:  [TRANSLATED] **

```bash
git add frontend/style.css
git commit -m "feat(frontend):  [TRANSLATED] / [TRANSLATED] / [TRANSLATED] / [TRANSLATED] "
```

---

### Task 8:  [TRANSLATED]  QA  [TRANSLATED]  +  [TRANSLATED] 

**Files:**
- Modify: `CLAUDE.md` [TRANSLATED]  edit.jsx [TRANSLATED] 

- [ ] **Step 1:  [TRANSLATED] **

Run: `python -m pytest tests/test_manual_edit_api.py tests/test_weather_mock.py -v`
Expected:  [TRANSLATED]  PASS

- [ ] **Step 2:  [TRANSLATED]  QA [TRANSLATED]  /qa  [TRANSLATED]  preview  [TRANSLATED] **

 [TRANSLATED] 
1.  [TRANSLATED]  ⠿ →  [TRANSLATED]  pill  [TRANSLATED] 
2.  [TRANSLATED] ↔  [TRANSLATED] →  [TRANSLATED] " [TRANSLATED] "→  [TRANSLATED]  →  [TRANSLATED] 
3.  [TRANSLATED]  placeholder  [TRANSLATED]  cost/address  [TRANSLATED] 
4.  [TRANSLATED]  10:00–09:00 →  [TRANSLATED] " [TRANSLATED] " [TRANSLATED]  →  [TRANSLATED] 
5.  [TRANSLATED]  +  [TRANSLATED]  →  [TRANSLATED]   [TRANSLATED] 
6.  [TRANSLATED] / [TRANSLATED]  3  [TRANSLATED]  →  [TRANSLATED]  3  [TRANSLATED]  →  [TRANSLATED]  2  [TRANSLATED] 
7.  [TRANSLATED]  →  [TRANSLATED]  →  [TRANSLATED]  →  [TRANSLATED] 
8.  [TRANSLATED] 
9.  [TRANSLATED] DevTools offline [TRANSLATED]  →  [TRANSLATED] 
10.  [TRANSLATED]  →  [TRANSLATED]  →  [TRANSLATED] 

 [TRANSLATED]  bug  [TRANSLATED] 

- [ ] **Step 3:  [TRANSLATED]  CLAUDE.md  [TRANSLATED] **

`CLAUDE.md`  [TRANSLATED]  `tweaks-panel.jsx`  [TRANSLATED] 

```
  edit.jsx           [TRANSLATED] / [TRANSLATED] / [TRANSLATED] / [TRANSLATED] 
```

- [ ] **Step 4:  [TRANSLATED] **

```bash
git add CLAUDE.md
git commit -m "docs: CLAUDE.md  [TRANSLATED]  edit.jsx"
```

---

##  [TRANSLATED] 

- **Spec  [TRANSLATED] ** [TRANSLATED] T5/T6 [TRANSLATED] ✓  [TRANSLATED] / [TRANSLATED] T2/T5/T6 [TRANSLATED] ✓  [TRANSLATED] / [TRANSLATED] T5/T6 [TRANSLATED] ✓  [TRANSLATED] T5/T6 [TRANSLATED] ✓  [TRANSLATED] / [TRANSLATED] T6 [TRANSLATED] ✓  [TRANSLATED] + [TRANSLATED] T3 [TRANSLATED] ✓  [TRANSLATED] T6/T8 [TRANSLATED] ✓  [TRANSLATED]  ✓
- ** [TRANSLATED] ** [TRANSLATED] `searchPoi(city, kw, kind)` / `saveTimeline(plan_id, days)`  [TRANSLATED] `reorderKeepTimes` / `recalcDayDists`  [TRANSLATED]  T5  [TRANSLATED] T6  [TRANSLATED] `PoiSearchModal` props  [TRANSLATED]  T6  [TRANSLATED] 
- ** [TRANSLATED] ** [TRANSLATED]  TBD/TODO [TRANSLATED] 
