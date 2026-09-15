# 07 — required_visible_objects marking and Scene validation

**What to build:** A Content Maintainer marks a set of Scene Objects (Road Users, Static Features, or Road Layout elements) as `required_visible_objects`. Saving a Scene runs `validateScene` and blocks the save if any reference is dangling, the Camera's `vehicle_id` doesn't resolve to a real Road User, `correct_answer` doesn't resolve to a real Road User, or the Jurisdiction/driving-side pairing is inconsistent.

**Blocked by:** 02 — Place a basic Road Component on the canvas, 04 — Sign Component library scoped by Jurisdiction, 05 — Place Road Users on the canvas, 06 — Camera assignment and Question authoring

**Status:** ready-for-agent

- [ ] Content Maintainer can toggle any Scene Object (Road User, Static Feature, Road Layout element) as required-visible
- [ ] `validateScene(manifest)` is implemented as a pure function per `CONTEXT.md`/`SPEC.md` and covers: dangling IDs in `required_visible_objects`, `correct_answer` resolving to a real Road User, Camera `vehicle_id` resolving to a real Road User, and jurisdiction/driving-side consistency
- [ ] Saving a Scene that fails validation is blocked, with the specific error(s) shown to the Content Maintainer
- [ ] A valid Scene saves normally
