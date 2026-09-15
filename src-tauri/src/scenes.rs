use serde::Serialize;
use std::fs;
use std::path::{Path, PathBuf};

// The scenes directory lives at the repo root, as a sibling of `src-tauri`
// (ADR 0001: Scenes are archived as files in git, one folder per Scene).
// Resolved from the crate's own manifest directory at compile time so a
// checkout built from source always writes into its own repo's `scenes/`.
fn scenes_dir() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .expect("src-tauri has a parent directory")
        .join("scenes")
}

// scene_id crosses the IPC boundary, so it is checked before it ever reaches
// the filesystem: anything but a plain name could escape the Scene's folder.
fn scene_dir(root: &Path, scene_id: &str) -> Result<PathBuf, String> {
    let is_plain_name = !scene_id.is_empty()
        && scene_id
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_');

    if !is_plain_name {
        return Err(format!("Invalid scene id: {scene_id:?}"));
    }
    Ok(root.join(scene_id))
}

#[derive(Serialize)]
pub struct SceneSummary {
    scene_id: String,
}

fn save_scene_in(
    root: &Path,
    scene_id: &str,
    manifest_json: &str,
    svg: &str,
) -> Result<(), String> {
    let dir = scene_dir(root, scene_id)?;
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    fs::write(dir.join("manifest.json"), manifest_json).map_err(|e| e.to_string())?;
    fs::write(dir.join("source.svg"), svg).map_err(|e| e.to_string())?;
    Ok(())
}

fn load_scene_in(root: &Path, scene_id: &str) -> Result<String, String> {
    let manifest = scene_dir(root, scene_id)?.join("manifest.json");
    fs::read_to_string(manifest).map_err(|e| e.to_string())
}

fn list_scenes_in(root: &Path) -> Result<Vec<SceneSummary>, String> {
    if !root.exists() {
        return Ok(Vec::new());
    }

    let mut summaries = Vec::new();
    for entry in fs::read_dir(root).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        // A folder without a manifest isn't a Scene.
        if entry.path().join("manifest.json").is_file() {
            summaries.push(SceneSummary {
                scene_id: entry.file_name().to_string_lossy().into_owned(),
            });
        }
    }
    summaries.sort_by(|a, b| a.scene_id.cmp(&b.scene_id));
    Ok(summaries)
}

#[tauri::command]
pub fn save_scene(scene_id: String, manifest_json: String, svg: String) -> Result<(), String> {
    save_scene_in(&scenes_dir(), &scene_id, &manifest_json, &svg)
}

#[tauri::command]
pub fn load_scene(scene_id: String) -> Result<String, String> {
    load_scene_in(&scenes_dir(), &scene_id)
}

#[tauri::command]
pub fn list_scenes() -> Result<Vec<SceneSummary>, String> {
    list_scenes_in(&scenes_dir())
}

#[cfg(test)]
mod tests {
    use super::*;

    fn temp_root(name: &str) -> PathBuf {
        let root = std::env::temp_dir().join(format!("scene-editor-{}-{name}", std::process::id()));
        let _ = fs::remove_dir_all(&root);
        root
    }

    #[test]
    fn saves_lists_and_loads_a_scene_back() {
        let root = temp_root("round-trip");
        let manifest = r#"{"scene_id":"abc","jurisdiction":"SE"}"#;

        save_scene_in(&root, "abc", manifest, "<svg></svg>").unwrap();

        assert_eq!(load_scene_in(&root, "abc").unwrap(), manifest);
        assert_eq!(fs::read_to_string(root.join("abc/source.svg")).unwrap(), "<svg></svg>");
        let listed: Vec<String> = list_scenes_in(&root)
            .unwrap()
            .into_iter()
            .map(|s| s.scene_id)
            .collect();
        assert_eq!(listed, vec!["abc".to_string()]);

        fs::remove_dir_all(&root).unwrap();
    }

    #[test]
    fn lists_nothing_when_no_scenes_have_been_saved() {
        assert!(list_scenes_in(&temp_root("empty")).unwrap().is_empty());
    }

    #[test]
    fn refuses_a_scene_id_that_would_escape_the_scenes_directory() {
        let root = temp_root("traversal");
        for bad in ["../escape", "a/b", "..", ""] {
            assert!(save_scene_in(&root, bad, "{}", "<svg></svg>").is_err());
            assert!(load_scene_in(&root, bad).is_err());
        }
    }
}
