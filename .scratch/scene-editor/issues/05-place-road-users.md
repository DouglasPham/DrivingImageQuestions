# 05 — Place Road Users on the canvas

**What to build:** A Content Maintainer places Road Users (cars, pedestrians, cyclists) on the canvas, each with a position, heading, and an `action` (intent), distinct from Static Features by having no automatic geometry — just position/heading/action.

**Blocked by:** 01 — Create and save an empty Scene

**Status:** ready-for-agent

- [ ] Road User types (car, pedestrian, cyclist) are available to place on the canvas
- [ ] Each placed Road User can have its position and heading adjusted (drag/rotate)
- [ ] Each Road User has an `action` field the Content Maintainer can set (e.g. straight, turning)
- [ ] Placing a Road User adds an entry (with a stable ID) to the Scene Manifest's road user list
