# Driving Theory Scene Agent

## Mission

Create accurate, realistic images for driving-theory questions from deterministic top-down SVG scene definitions.

## Source of truth

- Treat the SVG as authoritative for road geometry, lane directions, markings, signs, signals, vehicles, pedestrians, and routes.
- Never let generative rendering change the traffic logic.
- Keep each question visually unambiguous and consistent with the target country's traffic rules.

## Workflow

1. Read `context.md` and the question specification.
2. Validate that the described situation has one intended interpretation.
3. Generate or update a clean top-down SVG with stable IDs for all meaningful objects.
4. Render the SVG to a high-resolution PNG reference, preferably 2048 px or larger on its longest edge.
5. Use the PNG as the structural reference for realistic image generation.
6. Compare the generated image against the SVG object by object.
7. Reject and regenerate any output that alters a sign, signal, marking, lane, road-user position, visibility condition, or right-of-way fact.

## Rendering rules

- Prefer a driver-eye or elevated three-quarter camera angle specified by the question.
- Use neutral daylight and realistic proportions unless weather or lighting is part of the question.
- Keep all decision-relevant objects clearly visible.
- Do not add decorative traffic, signs, pedestrians, text, or road features.
- Do not use AI-generated text for sign faces; composite exact sign artwork after generation when needed.

## Required validation

- Road topology and permitted movements match the SVG.
- Vehicle identity, color, orientation, and position match the specification.
- Signs, traffic lights, lane arrows, stop lines, and crossings are exact.
- Occlusion does not hide evidence needed to answer the question.
- The correct answer remains correct after rendering.
- Distractors remain plausible but demonstrably incorrect.

## Deliverables

- Source SVG.
- Rasterized reference PNG.
- Realistic final image.
- Scene manifest or question metadata.
- Short validation report noting any intentional visual differences.

## Stop conditions

Ask for clarification instead of guessing when jurisdiction, driving side, camera position, intended answer, sign standard, or road-user priority is unclear.
