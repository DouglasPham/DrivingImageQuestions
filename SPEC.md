# Spec: Scene Editor for Driving Theory Questions

> No issue tracker is configured for this project (`/setup-matt-pocock-skills` has not been run), so this spec is saved as a local file rather than published to a tracker. Publish it once a tracker is set up.

## Problem Statement

A Content Maintainer who owns the driving-theory question bank currently has no way to build a Scene except by hand-writing raw JSON (the Scene Manifest) and SVG. This is slow, error-prone, and gives no guarantee that the realistic image eventually generated from a Scene still matches the traffic-logic facts (signs, signals, positions, right-of-way) that determine the correct answer — so mistakes can silently make a published question wrong or ambiguous.

## Solution

Build a Scene Manifest module that is the validated, single source of truth for a Scene, and a WYSIWYG Editor on top of it that lets a Content Maintainer draw a Scene on a top-down canvas, have the Source SVG generated deterministically from it, trigger realistic-image generation, and record a Validation Report — all in one sitting, in one tool, with the finished Scene archived as files in git.

## User Stories

1. As a Content Maintainer, I want to draw a new Scene from scratch on a top-down canvas, so that I don't have to write raw JSON or SVG by hand.
2. As a Content Maintainer, I want to add Road Users (cars, pedestrians, cyclists) to the canvas with position, heading, and action, so that I can construct realistic traffic situations.
3. As a Content Maintainer, I want to add Static Features (signs, signals, lane markings, stop lines, crossings) to the canvas, so that I can represent the traffic-control context of the situation.
4. As a Content Maintainer, I want the Source SVG to be generated automatically and deterministically from what I draw, so that the SVG and the Scene Manifest never drift out of sync.
5. As a Content Maintainer, I want to specify the Jurisdiction for a Scene, so that the driving side (left/right) is derived automatically and I can't accidentally create an inconsistent Scene.
6. As a Content Maintainer, I want to be blocked from saving a Scene with a jurisdiction/driving-side mismatch, so that inconsistent Scenes never enter the question bank.
7. As a Content Maintainer, I want to designate one Road User as the Camera's anchor (`vehicle_id`), so that the realistic image is always rendered from that vehicle's driver-eye position.
8. As a Content Maintainer, I want the Camera to always be framed "elevated three-quarter" so both wing mirrors are visible, so that images are consistent with what a driver would actually see.
9. As a Content Maintainer, I want to specify the Question text and mark exactly one Road User as `correct_answer`, so that the Scene has an unambiguous intended answer.
10. As a Content Maintainer, I want every other Road User in the Scene to automatically be treated as a Distractor, so that I don't have to separately manage a list of wrong answers.
11. As a Content Maintainer, I want to mark a set of Scene Objects as `required_visible_objects`, so that I can catch when a generated image occludes evidence needed to answer the Question.
12. As a Content Maintainer, I want the system to validate that every ID referenced in `required_visible_objects` and `correct_answer` actually exists among the Scene's Road Users/Static Features, so that I catch typos or dangling references before generating an image.
13. As a Content Maintainer, I want to be prevented from pointing the Camera's `vehicle_id` at a Road User that doesn't exist (or was deleted), so that Scenes never end up with a dangling Camera reference.
14. As a Content Maintainer, I want to trigger realistic-image generation directly from the Editor, so that I don't have to leave the tool to see the final photo-realistic result.
15. As a Content Maintainer, I want to see the exact instantiated Generation Prompt that was sent for a Scene, so that I understand why the model produced what it produced.
16. As a Content Maintainer, I want to generate several candidate images for the same Scene, so that I can pick the best one rather than accepting the first result.
17. As a Content Maintainer, I want to compare a candidate image against the Scene Manifest / Source SVG object by object, so that I can confirm it hasn't altered a sign, signal, marking, lane, road-user position, visibility condition, or right-of-way fact.
18. As a Content Maintainer, I want to reject a candidate image and regenerate, so that I never accept a photo that changes the traffic logic.
19. As a Content Maintainer, I want to write a Validation Report noting any intentional visual differences, so that anyone reviewing the Scene later understands deliberate deviations without re-deriving them.
20. As a Content Maintainer, I want the finished Scene (Source SVG, Scene Manifest, reference PNG, final image, Validation Report) archived together as one unit, so that the whole Scene is reproducible and auditable later.
21. As a Content Maintainer, I want each Scene stored as files in git rather than a database, so that I can review changes with normal git history/diffs without operating extra infrastructure.
22. As a Content Maintainer, I want to start a new Scene from an existing one's geometry, so that I can reuse a layout without being forced to reuse its Question (Scenes stay 1:1 with Questions — copying creates a new Scene, it does not attach a second Question to the old one).
23. As a Content Maintainer, I want to do all of the above alone, without needing a separate reviewer/QA person, so that I can publish new questions quickly at the current team size.

## Implementation Decisions

- **Primary seam: the Scene Manifest module.** A set of pure functions/class operating only on the Scene Manifest data structure, with no dependency on the Editor UI or the external image-generation API:
  - `validateScene(manifest)` — checks jurisdiction↔driving-side consistency (driving side is derived from jurisdiction, never stored/authored independently), that `correct_answer` and every ID in `required_visible_objects` resolve to a real Scene Object, and that the Camera's `vehicle_id` resolves to a real Road User.
  - `renderSourceSvg(manifest)` — deterministically generates the Source SVG from the manifest. The manifest is the only source of truth; the SVG is never hand-edited independently of it.
  - `buildGenerationPrompt(manifest)` — fills the Generation Prompt template with this Scene's data (camera view, lighting, etc.) to produce the instantiated Generation Prompt that gets archived with the Scene.
- **Data model** (per `CONTEXT.md`): Scene Manifest holds `scene_id`, `jurisdiction`, `camera.vehicle_id`, `question.{text, correct_answer, explanation}`, a list of Road Users (`id, type, color, position, heading, action`), a list of Static Features (`id, type, position, ...`), and `required_visible_objects` (a list of Scene Object IDs spanning both Road Users and Static Features). `driving_side` and the Distractor list are both derived, not stored: driving side from a jurisdiction lookup table, distractors as "every Road User except `correct_answer`."
- **Camera** always requires a `vehicle_id` and is always framed "elevated three-quarter" (wide/angled enough to keep both wing mirrors in shot). There is no independent/unanchored camera mode — see [ADR 0003](docs/adr/0003-camera-always-anchored-to-driver.md). `AGENTS.md` line 25 still describes an alternative "elevated" mode and needs a follow-up correction outside this spec's scope.
- **Editor** is a single WYSIWYG tool used by one Content Maintainer end-to-end: canvas authoring, triggering image generation, and writing the Validation Report all happen in it, human-only (no AI/agent API for direct manipulation) — see [ADR 0002](docs/adr/0002-editor-is-single-integrated-tool.md).
- **Storage**: one folder per Scene, committed as files in git — no database in this phase. A future migration to a database + object storage is expected once Scene volume grows, but is not designed for now — see [ADR 0001](docs/adr/0001-file-based-scene-storage.md).
- **Question/Distractor model**: a Question always asks the test-taker to identify one Road User (`correct_answer`); it is never free-text or independent multiple-choice options.

## Testing Decisions

- Test only the Scene Manifest module's external behavior — given a manifest, assert on `validateScene`'s pass/fail result and error messages, on `renderSourceSvg`'s output structurally (expected element IDs present, not brittle full-SVG string diffing), and on `buildGenerationPrompt`'s output containing the expected substitutions. Don't test internal implementation details of how the SVG is constructed.
- This is the first module in the repo, so there's no prior test-pattern art to follow yet — these tests establish the convention for the project going forward.
- The Editor UI (canvas interactions) and the actual call to the external image-generation API are explicitly not covered by this seam's tests. Cover them with manual/e2e verification (run the Editor, draw a Scene, generate an image, confirm it visually) rather than unit tests, since a canvas and a third-party generative model are both unsuited to the pure-function seam above.

## Out of Scope

- Scene Draft Prompt (text → base SVG bootstrap step) — deferred, not designed yet.
- Automated Validation Report generation (vision-model-based object matching) — Validation Report stays a manual, human-written comparison for now.
- A separate QA/reviewer role or workflow distinct from the Content Maintainer.
- Database-backed storage or multi-user concurrent editing.
- Multiple Questions sharing one Scene (Scenes remain strictly 1:1 with Questions).
- The four "Open decisions" still listed in `context.md` (target country/sign library, output viewpoint/dimensions beyond the Camera decision above, visual style, automated-validation level) — these are tracked separately and not resolved by this spec.

## Further Notes

- This spec assumes the domain vocabulary and decisions already recorded in `CONTEXT.md` and `docs/adr/0001`–`0003` in this repo; implementers should treat those as authoritative rather than re-deriving terminology.
- `AGENTS.md` line 25 ("Prefer a driver-eye or elevated three-quarter camera angle specified by the question") contradicts ADR 0003 and should be corrected in a follow-up edit, but that edit is not part of this spec.
