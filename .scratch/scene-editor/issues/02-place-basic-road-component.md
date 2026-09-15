# 02 — Place a basic Road Component on the canvas

**What to build:** A Content Maintainer drags a "straight road" Road Component onto the canvas. It renders as real SVG (not a canvas/bitmap library — per ADR 0005), and saving the Scene records it as a Road Layout entry in the Scene Manifest with the Source SVG regenerated to match.

**Blocked by:** 01 — Create and save an empty Scene

**Status:** ready-for-agent

- [ ] Editor's canvas renders actual `<svg>` elements bound to Scene Manifest state (no export-from-canvas step)
- [ ] A "straight road" Road Component can be dragged from a palette onto the canvas and positioned
- [ ] Placing it adds a Road Layout entry (with a stable ID) to the Scene Manifest
- [ ] Saving regenerates the Source SVG deterministically from the Scene Manifest, including the placed road
