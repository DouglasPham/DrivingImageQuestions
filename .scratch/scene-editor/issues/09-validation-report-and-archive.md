# 09 — Validation Report, accept/reject, and archive the Scene

**What to build:** The Content Maintainer compares a candidate image against the Scene Manifest / Source SVG object by object, writes a Validation Report noting any intentional visual differences, and accepts one candidate as the final image (or rejects all and regenerates). Accepting archives the complete Scene bundle — Source SVG, Scene Manifest, reference PNG, final image, Validation Report — together as one unit.

**Blocked by:** 08 — Generation Prompt and realistic image generation

**Status:** ready-for-agent

- [ ] Content Maintainer can view a candidate image side by side with the Scene Manifest/Source SVG for object-by-object comparison
- [ ] Content Maintainer can write free-text Validation Report notes for a candidate
- [ ] Content Maintainer can reject all candidates and trigger regeneration (back to ticket 08's flow)
- [ ] Accepting a candidate marks it the Scene's final image and writes the complete Scene bundle (Source SVG, Scene Manifest, reference PNG, final image, Validation Report) to the Scene's folder on disk
