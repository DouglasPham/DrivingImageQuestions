# 08 — Generation Prompt and realistic image generation

**What to build:** From a valid Scene, a Content Maintainer clicks "Generate image" inside the Editor. `buildGenerationPrompt(manifest)` fills the Generation Prompt template with this Scene's data, the Editor calls the external image-generation model, and several candidate images are shown without leaving the tool.

**Blocked by:** 07 — required_visible_objects marking and Scene validation

**Status:** ready-for-agent

- [ ] `buildGenerationPrompt(manifest)` is implemented as a pure function and produces the instantiated Generation Prompt for a given Scene
- [ ] The Editor can only trigger generation for a Scene that passes `validateScene`
- [ ] Triggering generation calls the external image-generation API and requests multiple candidates
- [ ] Candidate images are displayed in the Editor alongside the Generation Prompt that produced them
