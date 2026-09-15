# 02 — How does sign artwork enter the Source SVG?

**Type:** grilling

**Blocked by:** 01 — Where does official sign artwork come from?

**Status:** open

## Question

Road Components are computed geometry: `sceneToSvgElements` turns a manifest into
a list of `SvgElement` descriptors, and the same descriptors drive both the React
canvas and the serialised Source SVG, which is what keeps them identical by
construction (ADR 0005).

A sourced sign face is the opposite kind of thing — an opaque blob of artwork
with its own internal structure, ids, and paths, that nobody computes.

So: how does such a blob enter a pipeline built on descriptors, without breaking
the two properties the pipeline exists to protect — determinism, and stable ids
on every meaningful object?

Candidate shapes to pull apart:

- Inline the artwork's markup into the Source SVG under a wrapper carrying the
  Static Feature's stable id — faithful, but the manifest no longer fully
  determines the output unless the artwork is version-pinned somehow.
- Reference the artwork (`<use>`, or an `<image>` href) and ship it as a separate
  asset — keeps the Source SVG small and the manifest authoritative, but the
  archived Scene is no longer one self-contained file.
- Normalise each sign at build time into descriptors the existing renderer can
  emit, so signs and roads flow through one path.

Also settle: does the `SvgElement` descriptor type need to grow a case for
artwork, or does artwork bypass descriptors entirely — and if it bypasses them,
what stops the canvas and the Source SVG drifting apart?
