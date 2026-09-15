---
status: accepted
---

# Editor is a Tauri desktop app, not a web app or native (.NET) app

The Editor is built as a desktop app using Tauri (web tech — HTML/CSS/JS — packaged into a native binary), not a browser-hosted web app and not a native .NET/WinUI app. Web tech gives the canvas near-free access to SVG rendering, which matches the Source SVG being an actual SVG document (per `CONTEXT.md`); a native .NET app would require building an SVG-capable renderer from scratch with no clear benefit for this use case. Tauri was chosen over Electron for a much smaller bundled runtime (no bundled Chromium/Node), since the Editor runs locally against a git-backed file store (see [ADR 0001](0001-file-based-scene-storage.md)) and doesn't need a server.
