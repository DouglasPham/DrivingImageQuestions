# 01 — Create and save an empty Scene

**What to build:** A Content Maintainer opens the Tauri desktop Editor, starts a new Scene, picks a Jurisdiction, and saves it. The Scene is persisted as a folder of files (Scene Manifest JSON + an initially-empty Source SVG) on disk, ready to be committed to git — no database.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Editor app launches as a Tauri desktop app with a React UI shell
- [ ] "New Scene" flow lets the Content Maintainer pick a Jurisdiction, which is stored as the single source of truth (driving side is derived from it, never entered independently)
- [ ] Saving writes a Scene folder to disk containing a Scene Manifest JSON file and a Source SVG file
- [ ] Re-opening the app can load a previously saved Scene folder back into the Editor
