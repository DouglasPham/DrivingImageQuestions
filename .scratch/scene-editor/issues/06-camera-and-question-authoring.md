# 06 — Camera assignment and Question authoring

**What to build:** A Content Maintainer designates one Road User as the Camera's anchor (`vehicle_id` — the driver's eye position), and authors the Question: its text and which Road User is the `correct_answer`. Every other Road User in the Scene is automatically treated as a Distractor — no separate distractor list to manage.

**Blocked by:** 05 — Place Road Users on the canvas

**Status:** ready-for-agent

- [ ] Content Maintainer can pick one Road User as the Camera's `vehicle_id`
- [ ] Camera is always framed "elevated three-quarter" (both wing mirrors visible), per ADR 0003 — no independent/unanchored camera mode is offered
- [ ] Content Maintainer can enter Question text and select one Road User as `correct_answer`
- [ ] All other Road Users are shown as Distractors automatically, computed rather than stored
