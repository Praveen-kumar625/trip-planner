#  [TRANSLATED]  /  [TRANSLATED]  /  [TRANSLATED] 

 [TRANSLATED] 2026-06-12
 [TRANSLATED] 

##  [TRANSLATED] 

Agent  [TRANSLATED]  LLM [TRANSLATED] 

-  [TRANSLATED] / [TRANSLATED] 
-  [TRANSLATED]  /  [TRANSLATED] 
-  [TRANSLATED] 
-  [TRANSLATED] 
-  [TRANSLATED]  /  [TRANSLATED] 
-  [TRANSLATED] 

##  [TRANSLATED] 

|  [TRANSLATED]  |  [TRANSLATED]  |
|---|---|
|  [TRANSLATED]  |  [TRANSLATED]  plan_json [TRANSLATED]  plan_id |
|  [TRANSLATED]  |  [TRANSLATED]  |
|  [TRANSLATED]  |  [TRANSLATED]  |
|  [TRANSLATED]  |  [TRANSLATED]  |
|  [TRANSLATED] / [TRANSLATED]  |  [TRANSLATED]  haversine  [TRANSLATED]  |
|  [TRANSLATED]  |  [TRANSLATED]  |
|  [TRANSLATED]  | SortableJS [TRANSLATED] CDN  [TRANSLATED]  React  [TRANSLATED]  |

##  [TRANSLATED] 

```
 [TRANSLATED]  +  [TRANSLATED] 
   [TRANSLATED]  ──┐
   [TRANSLATED] / [TRANSLATED] / [TRANSLATED]  ──┤  [TRANSLATED]  →  [TRANSLATED]  draft →  [TRANSLATED]  →  [TRANSLATED]  →  [TRANSLATED] 
   [TRANSLATED]  ──┘
                ↓  [TRANSLATED] 
PUT /api/plan/{plan_id}/timeline  →   [TRANSLATED]  plan_json → update_plan_json [TRANSLATED] 
                ↓
 [TRANSLATED] / [TRANSLATED]   →  GET /api/poi/search  →   [TRANSLATED]  client + Redis  [TRANSLATED] 
```

 [TRANSLATED] 

##  [TRANSLATED] plan_routes.py  [TRANSLATED]  2  [TRANSLATED] 

### 1. `GET /api/poi/search?city= [TRANSLATED] &kw= [TRANSLATED] &kind=attraction|restaurant`

-  [TRANSLATED] Bearer token [TRANSLATED] 
- `kind=attraction` [TRANSLATED]  `search_attraction_pois` [TRANSLATED] types= [TRANSLATED] 
- `kind=restaurant` [TRANSLATED]  API [TRANSLATED] types= [TRANSLATED] 
-  [TRANSLATED]  `poi_to_spot`  [TRANSLATED] / [TRANSLATED] / [TRANSLATED] / [TRANSLATED] / [TRANSLATED] / [TRANSLATED]  8  [TRANSLATED] 
-  [TRANSLATED]  4xx/5xx + detail [TRANSLATED] 

### 2. `PUT /api/plan/{plan_id}/timeline`

- Body [TRANSLATED] `{ days: [{day: 1, timeline: [...]}, ...] }`
-  [TRANSLATED]  timeline [TRANSLATED]  plan_json [TRANSLATED]  plan [TRANSLATED]  weather/preferences  [TRANSLATED] 
-  [TRANSLATED] plan  [TRANSLATED] day  [TRANSLATED] timeline  [TRANSLATED]  name/type
- `dist_from_prev_km`  [TRANSLATED]  `haversine_km`  [TRANSLATED] 
-  [TRANSLATED]  `update_plan_json`

###  [TRANSLATED]  plan_id

LLM [TRANSLATED] parent_id  [TRANSLATED] AI  [TRANSLATED]  AI  [TRANSLATED]  YAGNI  [TRANSLATED] plan_json  [TRANSLATED] 

##  [TRANSLATED] TripDetailPage [TRANSLATED] 

###  [TRANSLATED] 

```
editing: bool                   [TRANSLATED] 
draft:   _raw.days  [TRANSLATED]      [TRANSLATED]  draft [TRANSLATED]  plan
undoStack / redoStack: []       [TRANSLATED]  =  [TRANSLATED]  draft.days  [TRANSLATED] 
```

-  [TRANSLATED] / [TRANSLATED]  timeline  [TRANSLATED]  10  [TRANSLATED] 
-  [TRANSLATED]  redoStack [TRANSLATED] 
-  [TRANSLATED] `draft = structuredClone(plan._raw.days)` [TRANSLATED] 
-  [TRANSLATED] PUT  [TRANSLATED]  →  [TRANSLATED]  plan  [TRANSLATED]  `adaptPlan`  [TRANSLATED] 
-  [TRANSLATED]  draft [TRANSLATED] 

###  [TRANSLATED]  =  [TRANSLATED]  draft →  [TRANSLATED]  dist →  [TRANSLATED] 

1. ** [TRANSLATED] ** [TRANSLATED] SortableJS  [TRANSLATED] `handle: '.drag-grip'` [TRANSLATED] `onEnd`  [TRANSLATED]  oldIndex/newIndex  [TRANSLATED] React  [TRANSLATED] onEnd  [TRANSLATED]  state +  [TRANSLATED]  `key={ [TRANSLATED] }`  [TRANSLATED]  DOM/state  [TRANSLATED]  1  [TRANSLATED]  1  [TRANSLATED] 
2. ** [TRANSLATED] / [TRANSLATED] ** [TRANSLATED] ↔  [TRANSLATED] →  [TRANSLATED]  plan.destination [TRANSLATED] →  [TRANSLATED]  `/api/poi/search` →  [TRANSLATED]  period [TRANSLATED]  lunch/dinner  [TRANSLATED]  POI [TRANSLATED] 
3. ** [TRANSLATED] ** [TRANSLATED] ✕ [TRANSLATED] 
4. ** [TRANSLATED] ** [TRANSLATED]  timeline  [TRANSLATED] +  [TRANSLATED] / [TRANSLATED] 
5. ** [TRANSLATED] ** [TRANSLATED]  →  [TRANSLATED]  `<input type="time">` [TRANSLATED] / [TRANSLATED]  <  [TRANSLATED] 

###  [TRANSLATED] 

 [TRANSLATED]  haversine [TRANSLATED]  helpers.py  [TRANSLATED]  `dist_from_prev_km` [TRANSLATED] `mapPoints`  [TRANSLATED]  draft  [TRANSLATED]  `MapPanel`  [TRANSLATED] 

###  [TRANSLATED] 

-  [TRANSLATED] `↩  [TRANSLATED] ` [TRANSLATED] `↪  [TRANSLATED] ` [TRANSLATED] `✕  [TRANSLATED] ` [TRANSLATED] `✓  [TRANSLATED] `
-  [TRANSLATED]  Day tab [TRANSLATED] draft  [TRANSLATED] 
-  [TRANSLATED]  → confirm  [TRANSLATED] 

###  [TRANSLATED] 

-  [TRANSLATED] / [TRANSLATED] 
-  [TRANSLATED] /401/404 [TRANSLATED]  draft [TRANSLATED] 
-  [TRANSLATED] 

##  [TRANSLATED] 

- SortableJS [TRANSLATED] `index.html`  [TRANSLATED]  CDN `<script>` [TRANSLATED]  React/Babel CDN  [TRANSLATED] 

##  [TRANSLATED] 

- ** [TRANSLATED] ** [TRANSLATED] pytest [TRANSLATED] 
  - `/api/poi/search` [TRANSLATED] kind  [TRANSLATED]  401
  - `PUT timeline` [TRANSLATED]  plan 404/403 [TRANSLATED] day  [TRANSLATED]  422 [TRANSLATED] 
- ** [TRANSLATED] ** [TRANSLATED]  `/qa`  [TRANSLATED] 
  -  [TRANSLATED] 
  -  [TRANSLATED] / [TRANSLATED] 
  -  [TRANSLATED] 
  -  [TRANSLATED] 

##  [TRANSLATED] 

-  [TRANSLATED] 
- LLM  [TRANSLATED] 
-  [TRANSLATED]  AI  [TRANSLATED] 
-  [TRANSLATED] 
