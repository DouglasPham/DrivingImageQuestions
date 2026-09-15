# Driving Theory Scene Agent

Converts an exact top-down SVG traffic scenario into a realistic street-scene image for a driving-theory question, preserving every fact that determines the correct answer.

## Language

**Scene**:
A single driving-theory question and the exact traffic situation that answers it, 1:1, plus every artifact archived for it: the SVG, the Scene Manifest, the rasterized reference PNG, the final realistic image, and the validation report. A Scene is not reusable across multiple questions — a new question means a new Scene, even if the geometry is copied from an existing one.
_Avoid_: Question (as a standalone concept), Situation, Scenario

**Scene Manifest**:
The JSON data structure inside a Scene that describes it in full: jurisdiction, driving side, camera, question text/answer/explanation, road users, and required visible objects. Authored first (via the Editor); it is the single source of truth, and every other artifact in the Scene is generated from or checked against it.
_Avoid_: Manifest (alone, when Scene Manifest is meant), Scene (when the JSON specifically is meant)

**Editor**:
The WYSIWYG visual authoring tool used by a Content Maintainer to build a Scene end to end: a top-down canvas for drawing roads and dragging/positioning/rotating Road Users and Static Features, plus an integrated "generate realistic image" step so the Content Maintainer can trigger image generation and review/reject candidates without leaving the tool. Human-only — no AI/agent API for direct manipulation.
_Avoid_: Builder, Designer

**Content Maintainer**:
The person who owns the driving-theory question bank and uses the Editor to author and update Scenes/Questions.
_Avoid_: Author, User (too generic)

**Source SVG**:
The top-down SVG diagram generated deterministically from the Scene Manifest, with stable element IDs for every meaningful object (road users, signs, signals, markings). Authoritative for road geometry once generated, because it is generated directly from the manifest rather than hand-drawn.
_Avoid_: SVG (alone), Diagram, Scene SVG

**Question**:
The entity-answer question posed by a Scene: it asks the test-taker to identify a specific Road User in the scene (e.g., "which vehicle must give way?"). `correct_answer` is a Road User ID, not free text or a multiple-choice option.
_Avoid_: Prompt (reserved for the image-generation prompt, see below)

**Distractor**:
Any Road User present in a Scene other than the one identified by `correct_answer`. A Distractor must look plausible as an answer to the Question when rendered, while being demonstrably incorrect under the jurisdiction's traffic rules.
_Avoid_: Wrong answer, Decoy

**Scene Object**:
The supertype of anything in a Scene with a stable ID and a position that must be checked for visibility — covers Road User, Static Feature, and Road Layout. `required_visible_objects` is a list of Scene Object IDs, mixing all three kinds freely.
_Avoid_: Element, Item

**Road Layout**:
The road/intersection geometry itself (straight road, T-junction, 4-way intersection, roundabout, curve) — the spatial scaffold that Road Users and Static Features are positioned against. A third kind of Scene Object, distinct from Road User (no action/intent) and Static Feature (it's the road, not something placed on/beside the road).
_Avoid_: Static Feature (too narrow — reserved for things placed on/beside the road), Road Segment, Background

**Road Component**:
A prefab template in the Editor's library that a Content Maintainer drags onto the canvas to create a Road Layout instance. A small set of base shapes (straight road, T-junction, 4-way intersection, roundabout) is combined with independent parameters — traffic control (none / traffic light / stop sign / yield sign), pedestrian crossing (present/absent), bike lane/cycle path (absent / shared with pedestrian path / separated), lane-marking variant (solid / dashed / warning) — rather than enumerating a separate prefab for every combination. Guarantees correct traffic-geometry and lane markings by construction; never freehand-drawn.
_Avoid_: Template (too generic), Prefab (implementation-flavored)

**Sign Component**:
A prefab template in the Editor's library for a specific regulatory sign (e.g. "yield sign"), drawn to the exact official standard — not freehand-drawn. The library is scoped by Jurisdiction: a Content Maintainer only sees/places Sign Components valid for the Scene's Jurisdiction, so a Scene can't end up with a sign from the wrong country's standard.
_Avoid_: Sign (the placed Static Feature instance on canvas), Icon

**Road User**:
A kind of Scene Object that is a dynamic actor with a position, heading, and an `action` (intent) — cars, pedestrians, cyclists. Distinguished from Static Features by having an action/intent that participates in right-of-way logic.
_Avoid_: Vehicle (too narrow — excludes pedestrians/cyclists), Actor

**Static Feature**:
A kind of Scene Object that is non-moving, with geometry but no action — signs, signals, lane markings, stop lines, crossings. Distinguished from Road Users by having no intent or motion.
_Avoid_: Infrastructure, Object (too generic)

**Camera**:
The viewpoint a Scene is rendered from: always anchored to a specific Road User's `vehicle_id` (the driver's eye position), never an independent floating viewpoint. Framed as "elevated three-quarter" — angled and wide enough to keep both wing mirrors visible in shot, not a straight-ahead-only view.
_Avoid_: Elevated view (as an independent/unanchored camera mode), Viewpoint alone

**Validation Report**:
The Content Maintainer's own written comparison of the final image against the Scene Manifest / Source SVG, object by object, noting any intentional visual differences — done in the Editor, in the same sitting as authoring and image generation. No separate reviewer/QA role exists yet; automating this step is an open future decision, not the current model.
_Avoid_: Review, QA Report

**Generation Prompt**:
The text instruction sent to the image-generation model to turn a Scene's finalized Source SVG / reference PNG into the realistic final image. One instantiated Generation Prompt is archived per Scene (filled in with that Scene's camera view, lighting, etc.), not a shared unfilled template.
_Avoid_: Prompt (alone), Scene Draft Prompt (a separate, currently out-of-scope concept for bootstrapping a base SVG from text)

**Jurisdiction**:
The country or region whose traffic rules and sign standards govern a Scene (e.g. "SE"). The single source of truth for driving side — a Scene is never authored with a jurisdiction/driving-side mismatch.
_Avoid_: Country (jurisdiction may be sub-national), Driving Side (derived, not stored independently)
