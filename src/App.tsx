import { useEffect, useState } from "react";
import { drivingSideFor, JURISDICTIONS } from "./scene/jurisdictions";
import {
  addRoadLayout,
  clearSceneObjects,
  createEmptyScene,
  moveRoadLayout,
  setRoadParameters,
  type Position,
  type SceneManifest,
} from "./scene/sceneManifest";
import type { RoadComponentType, RoadParameters } from "./scene/roadComponents";
import { listScenes, loadScene, saveScene, type SceneSummary } from "./scene/sceneStorage";
import { RoadPalette } from "./components/RoadPalette";
import { RoadParametersPanel } from "./components/RoadParametersPanel";
import { SceneCanvas } from "./components/SceneCanvas";
import "./App.css";

function App() {
  const [scenes, setScenes] = useState<SceneSummary[]>([]);
  const [jurisdiction, setJurisdiction] = useState(JURISDICTIONS[0].code);
  const [currentScene, setCurrentScene] = useState<SceneManifest | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Previous states, oldest first. A drag records one entry at the moment it
  // starts rather than one per pointer move, so undo steps back a whole drag.
  const [past, setPast] = useState<SceneManifest[]>([]);

  const selectedLayout = currentScene?.road_layouts.find((l) => l.id === selectedId) ?? null;

  function rememberForUndo() {
    if (currentScene) setPast((p) => [...p, currentScene]);
  }

  function handleUndo() {
    const previous = past[past.length - 1];
    if (!previous) return;

    setCurrentScene(previous);
    setPast(past.slice(0, -1));
    setSelectedId(null);
    setUnsavedChanges(true);
  }

  function handleClearAll() {
    if (!currentScene) return;
    rememberForUndo();
    setCurrentScene(clearSceneObjects(currentScene));
    setSelectedId(null);
    setUnsavedChanges(true);
  }

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
      setSelectedId(null);
      setPast([]);
      setUnsavedChanges(true);
    } catch (e) {
      setError(String(e));
    }
  }

  async function handleOpenScene(sceneId: string) {
    setError(null);
    try {
      setCurrentScene(await loadScene(sceneId));
      setSelectedId(null);
      setPast([]);
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
    rememberForUndo();
    setCurrentScene((scene) => (scene ? addRoadLayout(scene, component, position) : scene));
    setUnsavedChanges(true);
  }

  function handleMoveSceneObject(sceneObjectId: string, position: Position) {
    setCurrentScene((scene) => (scene ? moveRoadLayout(scene, sceneObjectId, position) : scene));
    setUnsavedChanges(true);
  }

  function handleChangeParameters(changes: Partial<RoadParameters>) {
    if (!selectedId) return;
    rememberForUndo();
    setCurrentScene((scene) => (scene ? setRoadParameters(scene, selectedId, changes) : scene));
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
              selectedId={selectedId}
              onPlaceComponent={handlePlaceComponent}
              onMoveSceneObject={handleMoveSceneObject}
              onSelect={setSelectedId}
              onBeginDrag={rememberForUndo}
            />
            {selectedLayout ? (
              <RoadParametersPanel layout={selectedLayout} onChange={handleChangeParameters} />
            ) : (
              <p className="parameters">Select a road to edit its parameters.</p>
            )}
          </div>

          <p className="actions">
            <button type="button" onClick={handleUndo} disabled={past.length === 0}>
              Undo
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              disabled={currentScene.road_layouts.length === 0}
            >
              Clear all
            </button>
            <button type="button" onClick={handleSave} disabled={!unsavedChanges}>
              {unsavedChanges ? "Save Scene" : "Saved"}
            </button>
          </p>
        </section>
      )}

      {error && <p role="alert">{error}</p>}
    </main>
  );
}

export default App;
