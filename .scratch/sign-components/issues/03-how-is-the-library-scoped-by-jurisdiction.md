# 03 — How is the sign library scoped by Jurisdiction?

**Type:** grilling

**Blocked by:** 02 — How does sign artwork enter the Source SVG?

**Status:** open

## Question

`CONTEXT.md` requires that a Content Maintainer "only sees/places Sign Components
valid for the Scene's Jurisdiction, so a Scene can't end up with a sign from the
wrong country's standard."

Decide the mechanism, and how strict the guarantee is:

- Is the scoping a property of each Sign Component (each declares which
  jurisdictions it is valid in), or of the library (a registry per jurisdiction)?
  Many signs are near-identical across countries — does one artwork get reused
  across jurisdictions, or does each jurisdiction own its own copy?
- Is filtering the palette enough, or must a Scene be *prevented* from holding a
  mismatched sign — i.e. does this become a rule in the eventual `validateScene`?
- What happens to already-placed signs if a Scene's Jurisdiction is changed after
  authoring? Blocked, cleared, or flagged?
- `jurisdictions.ts` currently hardcodes SE/GB/US/AU purely so the picker could
  demonstrate driving-side derivation. If artwork only exists for one
  jurisdiction, should the others be removed until they have a sign set — a Scene
  whose jurisdiction has no signs is arguably not authorable.

The last point may make this ticket partly a scoping decision rather than a
design one, so watch for the answer pushing work out of scope.
