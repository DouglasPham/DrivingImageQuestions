import { invoke } from "@tauri-apps/api/core";
import type { SceneManifest } from "./sceneManifest";
import { renderSourceSvg } from "./sceneSvg";

export interface SceneSummary {
  scene_id: string;
}

export async function saveScene(manifest: SceneManifest): Promise<void> {
  await invoke("save_scene", {
    sceneId: manifest.scene_id,
    manifestJson: JSON.stringify(manifest, null, 2),
    svg: renderSourceSvg(manifest),
  });
}

export async function listScenes(): Promise<SceneSummary[]> {
  return invoke("list_scenes");
}

export async function loadScene(sceneId: string): Promise<SceneManifest> {
  const manifestJson = await invoke<string>("load_scene", { sceneId });
  return JSON.parse(manifestJson) as SceneManifest;
}
