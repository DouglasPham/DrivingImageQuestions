---
status: accepted
---

# Camera is always anchored to the driver's eye position

Every Scene's Camera is anchored to a specific Road User's `vehicle_id` — the driver's eye position — never an independent floating viewpoint. It is framed "elevated three-quarter" (angled and wide enough to keep both wing mirrors in shot), not straight-ahead-only. An independent, vehicle-less "elevated" viewpoint (as `AGENTS.md` currently mentions as an alternative) was considered and rejected: driver-eye is the only supported mode. `AGENTS.md` line 25 still describes "driver-eye or elevated three-quarter" as two alternatives and should be corrected to reflect this.
