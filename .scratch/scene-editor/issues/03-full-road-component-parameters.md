# 03 — Full base shapes and composable Road Component parameters

**What to build:** Beyond the straight road, a Content Maintainer can place T-junction, 4-way intersection, and roundabout Road Components, and independently configure each one's traffic control (none / traffic light / stop sign / yield sign), pedestrian crossing (present/absent), bike lane (absent / shared with pedestrian path / separated), and lane-marking variant (solid / dashed / warning) — as composable parameters, not a separate prefab per combination.

**Blocked by:** 02 — Place a basic Road Component on the canvas

**Status:** ready-for-agent

- [ ] T-junction, 4-way intersection, and roundabout base shapes are available in the Road Component palette
- [ ] Each placed Road Component exposes independent parameters: traffic control, pedestrian crossing, bike lane, lane-marking variant
- [ ] Changing a parameter updates the rendered SVG geometry/markings correctly for that combination
- [ ] Any combination of base shape + parameters can be saved and reloaded without loss
