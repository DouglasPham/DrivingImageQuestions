# Map: Sign Component artwork

**Label:** `wayfinder:map`

## Destination

Decide how Sign Components are sourced, stored, and rendered — accurately enough
to meet CONTEXT.md's "drawn to the exact official standard" — so that
[04 — Sign Component library scoped by Jurisdiction](../scene-editor/issues/04-sign-component-library.md)
becomes buildable without further open questions.

## Notes

- **Domain:** see `CONTEXT.md` for Sign Component, Static Feature, Scene Object,
  Jurisdiction, Source SVG. A **Sign Component** is the prefab template in the
  library; the placed instance on canvas is a **Static Feature**.
- **Skills:** `/grilling` and `/domain-modeling` for decision tickets;
  `/research` for the sourcing and licensing questions.
- **Standing constraints this effort must respect:**
  - The Scene Manifest is the single source of truth; the Source SVG is
    generated from it deterministically, with stable ids on every meaningful
    object (`CONTEXT.md`, ADR 0005).
  - `AGENTS.md`: "Do not use AI-generated text for sign faces; composite exact
    sign artwork after generation when needed." Sign faces are legal artwork,
    not something to approximate.
  - Sign Components are scoped by Jurisdiction — a Scene must not be able to
    show a sign from the wrong country's standard.
- **Already settled, do not re-litigate:** Road Components are *computed
  geometry*, not drawn artwork — composable parameters (traffic control,
  crossing, bike lane, lane marking) cannot come from a static drawing. Settled
  by shipping ticket 03 (commit `6e4f82f`).
- **Start with Sweden.** Content Maintainer confirmed SE is the jurisdiction to
  build first; GB/US/AU support is not required for this effort to reach its
  destination. Relevant to ticket 03 (jurisdiction scoping), which already
  flags that `jurisdictions.ts` may need to shed the other three until they
  have their own sign sets.

## Decisions so far

<!-- one line per closed ticket: gist + link -->

- [01 — Where does official sign artwork come from?](issues/01-where-does-official-sign-artwork-come-from.md) —
  Sweden: Transportstyrelsen serves official EPS vectors for every sign,
  publicly downloadable (though unlinked) and explicitly free to use;
  Copyright Act statute-exclusion backs this up. GB/US/AU surveyed for later;
  US strongest, AU is the risk case. Format varies completely across
  jurisdictions — expect per-jurisdiction adapters, not one importer. Full
  findings: [research/01-sign-artwork-sources.md](research/01-sign-artwork-sources.md).

## Not yet specified

- **How a sign's placement relates to the road it governs.** A yield sign
  belongs to a particular approach of a particular junction, but Static Features
  currently carry only a position. Whether a sign should reference the Road
  Layout/arm it governs is a real modelling question, but it cannot be phrased
  sharply until the artwork format is settled.
- **How sign artwork interacts with the realistic-image generation step.**
  `AGENTS.md` says exact sign artwork is composited *after* generation; what that
  compositing needs from the Sign Component (anchor points? a mask? the
  unrendered face?) is invisible from here.
- **Whether the library needs sign variants** (size classes, supplementary
  plates, temporary/roadwork versions) or just one face per sign type.

## Out of scope

- **draw.io as any part of the pipeline** — ruled out by the Content Maintainer.
  Its SVG export carries generated ids and nested transforms that fight the
  stable-id requirement on the Source SVG. The empty `test.drawio` experiment is
  abandoned.
- **Re-opening how Road Components are authored** — settled by ticket 03; roads
  are computed geometry. Revisiting it would redraw this map's destination.
