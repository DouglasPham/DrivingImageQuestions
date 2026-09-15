# 04 — Sign Component library scoped by Jurisdiction

**What to build:** A Content Maintainer opens a Sign Component palette and only sees signs valid for the Scene's Jurisdiction (e.g. only Swedish standard signs for a Scene with `jurisdiction: "SE"`), drawn to the exact official standard. Placing one adds a Static Feature to the Scene.

**Blocked by:** 01 — Create and save an empty Scene

**Status:** ready-for-agent

- [ ] Sign Component library contains at least one jurisdiction's official sign set, drawn to standard
- [ ] The palette filters to only the signs valid for the current Scene's Jurisdiction
- [ ] Placing a Sign Component adds a Static Feature entry (with a stable ID) to the Scene Manifest
- [ ] Saving/reloading preserves placed signs correctly
