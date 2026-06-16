#  [TRANSLATED] 

** [TRANSLATED] ** [TRANSLATED] 2026-06-13  
** [TRANSLATED] ** [TRANSLATED] feature/manual-edit  
** [TRANSLATED] ** [TRANSLATED]  +  [TRANSLATED] 

---

##  [TRANSLATED] 

|  [TRANSLATED]  |  [TRANSLATED]  |
|------|------|
|  [TRANSLATED]  |  [TRANSLATED]  |
|  [TRANSLATED]  |  [TRANSLATED]  +  [TRANSLATED]  |
|  [TRANSLATED] / [TRANSLATED]  |  [TRANSLATED]  +  [TRANSLATED]  |
|  [TRANSLATED] / [TRANSLATED]  |  [TRANSLATED]  +  [TRANSLATED]  |
|  [TRANSLATED]  |  [TRANSLATED]  +  [TRANSLATED]  finalize |
|  [TRANSLATED]  |  [TRANSLATED]  |
|  [TRANSLATED]  |  [TRANSLATED]  |
|  [TRANSLATED]  |  [TRANSLATED]  |
| Hotel / Notes  [TRANSLATED]  |  [TRANSLATED]  +  [TRANSLATED]  |

---

##  [TRANSLATED] 

**Hotel / Notes /  [TRANSLATED]   [TRANSLATED]  final_plan JSON blob [TRANSLATED]  A [TRANSLATED] **

 [TRANSLATED] final_plan  [TRANSLATED]  JSON blob  [TRANSLATED]  SQLite [TRANSLATED] hotel/notes/day_themes  [TRANSLATED]  plan  [TRANSLATED]  `update_plan_json` [TRANSLATED]  ALTER TABLE  [TRANSLATED] 

---

##  [TRANSLATED] 

### 3.1 `app/providers/amap/poi.py` — `poi_to_spot`  [TRANSLATED] 

 [TRANSLATED]  `address` [TRANSLATED]  `tel` [TRANSLATED]  null [TRANSLATED] 

```python
"address": normalize_address(poi.get("address", "")),
"tel": str(poi.get("tel") or "").strip() or None,
```

 [TRANSLATED]  `restaurant_to_dict` [TRANSLATED] `helpers.py` [TRANSLATED]  `open_time` [TRANSLATED] `tel` [TRANSLATED] `category` [TRANSLATED]  `type`  [TRANSLATED] 

### 3.2 `app/planning/nodes.py` — `finalize_node`  [TRANSLATED] 

 [TRANSLATED]  final_plan  [TRANSLATED]  `candidate_spots`  [TRANSLATED]  pois  [TRANSLATED]  20  [TRANSLATED] `name / rating / photo / location / open_time / address` [TRANSLATED] 

```python
placed_names = {s["name"] for day in state.route for s in day.get("spots", [])}
candidate_spots = [
    {k: v for k, v in s.items() if k in ("name","rating","photo","location","open_time","address")}
    for s in state.pois if s["name"] not in placed_names
][:20]
final_plan["candidate_spots"] = candidate_spots
```

### 3.3 `app/api/plan_routes.py` —  [TRANSLATED] 

**`GET /api/poi/nearby`**

 [TRANSLATED]  `search_around_pois` [TRANSLATED]  `distance`  [TRANSLATED] 

```
Query params: lat, lng, type [TRANSLATED]  |  [TRANSLATED] , radius=1500
Response: { results: [{name, rating, address, distance, location, photo, tel, open_time}] }
```

**`PUT /api/plan/{plan_id}/metadata`**

Body: `{ hotel, notes, day_themes: {"1": " [TRANSLATED] "} }`

 [TRANSLATED]  `update_plan_json` merge  [TRANSLATED]  final_plan JSON [TRANSLATED]  timeline  [TRANSLATED]  JWT  [TRANSLATED]  plan  [TRANSLATED] 

### 3.4 `optimize_day`  [TRANSLATED] 

 [TRANSLATED]  TSP  [TRANSLATED]  `finalize_node`  [TRANSLATED] 
-  [TRANSLATED] 
-  [TRANSLATED] 

 [TRANSLATED] / [TRANSLATED] / [TRANSLATED] 

---

##  [TRANSLATED] 

### 4.1 `api.js`

|  [TRANSLATED]  |  [TRANSLATED]  |
|------|------|
| `initAmapForDay` | `path`  [TRANSLATED]  `kind !== "meal"`  [TRANSLATED]  |
|  [TRANSLATED]  `searchNearby(lat, lng, type, radius)` |  [TRANSLATED]  `/api/poi/nearby` |
|  [TRANSLATED]  `saveMetadata(planId, data)` |  [TRANSLATED]  `PUT /api/plan/{id}/metadata` |
| `adaptPlan` |  [TRANSLATED]  `address` [TRANSLATED] `tel` [TRANSLATED] `candidate_spots` [TRANSLATED] `hotel` [TRANSLATED] `notes` [TRANSLATED]  theme  [TRANSLATED]  `day_themes`  [TRANSLATED]  |

### 4.2 `components.jsx`

**`AttractionCard`  [TRANSLATED] ** [TRANSLATED] `address` [TRANSLATED] 📍 [TRANSLATED] `tel` [TRANSLATED] 📞 [TRANSLATED] `cost` [TRANSLATED] 💰  [TRANSLATED] 

**`MealCard`  [TRANSLATED] ** [TRANSLATED] `open_time` [TRANSLATED] 🕐 [TRANSLATED] `tel` [TRANSLATED] 📞 [TRANSLATED] `category` [TRANSLATED] 

** [TRANSLATED]  `NavRow`  [TRANSLATED] **

 [TRANSLATED]  item  [TRANSLATED]  `NavRow` [TRANSLATED] 
-  [TRANSLATED]  `dist_from_prev_km` [TRANSLATED] 
-  [TRANSLATED] 🧭  [TRANSLATED] 
-  [TRANSLATED]  →  [TRANSLATED]  `{from: itemA.location, to: itemB.location}` [TRANSLATED] `MapPanel`  [TRANSLATED]  `Driving.search(A, B)` [TRANSLATED] 
-  [TRANSLATED]  →  [TRANSLATED] 

** [TRANSLATED]  `RecommendStrip`  [TRANSLATED] **

 [TRANSLATED] day-tabs  [TRANSLATED]  120px [TRANSLATED] 
-  [TRANSLATED] `plan.candidate_spots`
-  [TRANSLATED]  /  [TRANSLATED]  / ★ [TRANSLATED]  /  [TRANSLATED] 
-  [TRANSLATED] 
-  [TRANSLATED] `draggable="true"` [TRANSLATED]  drop target [TRANSLATED] drop  [TRANSLATED]  `applyEdit`  [TRANSLATED] 

** [TRANSLATED]  `NearbySearchModal`  [TRANSLATED] **

 [TRANSLATED] 📍  [TRANSLATED] 
-  [TRANSLATED]  Tab [TRANSLATED]  /  [TRANSLATED] 
-  [TRANSLATED]  radius=1500m [TRANSLATED]  500 / 1000 / 1500 / 3000
-  [TRANSLATED]  name / ★rating / distance / address

### 4.3 `pages.jsx`

**`TripDetailPage`  [TRANSLATED] ** [TRANSLATED] 
-  [TRANSLATED]  `confirm` [TRANSLATED] 
-  [TRANSLATED]  Hotel [TRANSLATED] + Notes [TRANSLATED] 
-  [TRANSLATED]  →  [TRANSLATED]  `saveMetadata`
- `MapPanel`  [TRANSLATED]  `activeNavPair` prop [TRANSLATED]  `NavRow`  [TRANSLATED] 

### 4.4 `edit.jsx`

-  [TRANSLATED]  `day-header`  [TRANSLATED]  ✏️ [TRANSLATED]  `<input>` [TRANSLATED]  `applyEdit`  [TRANSLATED]  `draft[dayIdx].theme` [TRANSLATED] 
- `RecommendStrip`  [TRANSLATED]  drop  [TRANSLATED]  `applyEdit`  [TRANSLATED] `edit.jsx`  [TRANSLATED]  `handleSpotDrop(dayI, targetIdx, candidateSpot)`

---

##  [TRANSLATED] 

```
LLM Pipeline
  └─ finalize_node
       ├─ final_plan.days[].timeline  ( [TRANSLATED]  +  [TRANSLATED]  address/tel)
       └─ final_plan.candidate_spots  ( [TRANSLATED] ≤20 [TRANSLATED] )

PUT /api/plan/{id}/metadata
  └─ update_plan_json(plan_id, {hotel, notes, day_themes})
       └─ SQLite trips.plan_json (merge [TRANSLATED]  timeline)

GET /api/poi/nearby
  └─ search_around_pois(location, type, radius)
       └─  [TRANSLATED]  distance  [TRANSLATED] 
```

---

##  [TRANSLATED] 

-  [TRANSLATED]  marker  [TRANSLATED]  →  [TRANSLATED] 
-  [TRANSLATED] 
-  [TRANSLATED] hotel/notes  [TRANSLATED]  plan JSON  [TRANSLATED]  plan [TRANSLATED] 
