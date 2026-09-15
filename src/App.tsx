import { useEffect, useState } from "react";
import { drivingSideFor, JURISDICTIONS } from "./scene/jurisdictions";
import {
  addRoadLayout,
  createEmptyScene,
  moveRoadLayout,
  type Position,
  type SceneManifest,
} from "./scene/sceneManifest";
import type { RoadComponentType } from "./scene/roadComponents";
import { listScenes, loadScene, saveScene, type SceneSummary } from "./scene/sceneStorage";
import { RoadPalette } from "./components/RoadPalette";
import { SceneCanvas } from "./components/SceneCanvas";
import "./App.css";

function App() {
  const [scenes, setScenes] = useState<SceneSummary[]>([]);
  const [jurisdiction, setJurisdiction] = useState(JURISDICTIONS[0].code);
  const [currentScene, setCurrentScene] = useState<SceneManifest | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refreshScenes() {
    setScenes(await listScenes());
  }

  useEffect(() => {
    refreshScenes().catch((e) => setError(String(e)));
  }, []);

  // A new Scene lives in memory until the Content Maintainer saves it, so an
  // abandoned one never leaves a folder behind in the git-backed store.
  function handleNewScene() {
    setError(null);
    try {
      setCurrentScene(createEmptyScene(jurisdiction));
      setUnsavedChanges(true);
    } catch (e) {
      setError(String(e));
    }
  }

  async function handleOpenScene(sceneId: string) {
    setError(null);
    try {
      setCurrentScene(await loadScene(sceneId));
      setUnsavedChanges(false);
    } catch (e) {
      setError(String(e));
    }
  }

  async function handleSave() {
    if (!currentScene) return;
    setError(null);
    try {
      await saveScene(currentScene);
      setUnsavedChanges(false);
      await refreshScenes();
    } catch (e) {
      setError(String(e));
    }
  }

  function handlePlaceComponent(component: RoadComponentType, position: Position) {
    setCurrentScene((scene) => (scene ? addRoadLayout(scene, component, position) : scene));
    setUnsavedChanges(true);
  }

  function handleMoveSceneObject(sceneObjectId: string, position: Position) {
    setCurrentScene((scene) => (scene ? moveRoadLayout(scene, sceneObjectId, position) : scene));
    setUnsavedChanges(true);
  }

  return (
    <main className="container">
      <h1>Scene Editor</h1>

      <section>
        <h2>New Scene</h2>
        <label htmlFor="jurisdiction-select">Jurisdiction</label>
        <select
          id="jurisdiction-select"
          value={jurisdiction}
          onChange={(e) => setJurisdiction(e.currentTarget.value)}
        >
          {JURISDICTIONS.map((j) => (
            <option key={j.code} value={j.code}>
              {j.name} ({j.drivingSide}-hand traffic)
            </option>
          ))}
        </select>
        <button type="button" onClick={handleNewScene}>
          Create Scene
        </button>
      </section>

      <section>
        <h2>Saved Scenes</h2>
        {scenes.length === 0 ? (
          <p>No Scenes saved yet.</p>
        ) : (
          <ul>
            {scenes.map((s) => (
              <li key={s.scene_id}>
                {s.scene_id}{" "}
                <button type="button" onClick={() => handleOpenScene(s.scene_id)}>
                  Open
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {currentScene && (
        <section>
          <h2>
            Current Scene — {currentScene.jurisdiction} (
            {drivingSideFor(currentScene.jurisdiction) ?? "unknown"}-hand traffic)
          </h2>
          <p className="scene-id">{currentScene.scene_id}</p>

          <div className="editor">
            <RoadPalette />
            <SceneCanvas
              scene={currentScene}
              onPlaceComponent={handlePlaceComponent}
              onMoveSceneObject={handleMoveSceneObject}
            />
          </div>

          <button type="button" onClick={handleSave} disabled={!unsavedChanges}>
            {unsavedChanges ? "Save Scene" : "Saved"}
          </button>
        </section>
      )}

      {error && <p role="alert">{error}</p>}
    </main>
  );
}

export default App;
