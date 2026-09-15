---
status: accepted
---

# File-based Scene storage now, database later

Scenes (Source SVG, Scene Manifest, reference PNG, final image, Validation Report) are stored as files in git, one folder per Scene — not in a database. This keeps the system simple to operate while the question bank and team are small, and matches the existing "archive everything together for reproducibility" workflow. The team expects to migrate to a database (with object storage for images) once Scene volume or concurrent-editing needs grow; that migration is deferred, not designed for yet.
