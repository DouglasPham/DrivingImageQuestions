---
status: accepted
---

# Editor canvas renders real SVG directly, no canvas/bitmap library

The Editor's canvas is React rendering actual `<svg>`/`<rect>`/`<path>` elements straight from Scene Manifest state, with pointer-event-based drag/rotate handling written by hand — not a canvas/bitmap engine like react-konva or Fabric.js. Those libraries render to `<canvas>` bitmaps and would need a separate "export to SVG" step, risking drift between what's shown on screen and the actual Source SVG archived for the Scene. Rendering real SVG keeps "what the Content Maintainer sees" and "the Source SVG" identical by construction, at the cost of writing drag/rotate/snap interactions by hand instead of getting them from a library.
