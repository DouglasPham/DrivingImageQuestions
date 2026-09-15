import { describe, expect, it } from "vitest";
import { drivingSideFor } from "./jurisdictions";
import {
  addRoadLayout,
  clearSceneObjects,
  createEmptyScene,
  moveRoadLayout,
} from "./sceneManifest";

describe("createEmptyScene", () => {
  it("stores the jurisdiction as the single source of truth for driving side", () => {
    const scene = createEmptyScene("GB");
    expect(scene.jurisdiction).toBe("GB");
    expect(drivingSideFor(scene.jurisdiction)).toBe("left");
  });

  it("never stores a driving side, so a manifest cannot contradict its jurisdiction", () => {
    expect(createEmptyScene("GB")).not.toHaveProperty("driving_side");
  });

  it("starts with no camera, no question, and no scene objects", () => {
    const scene = createEmptyScene("SE");
    expect(scene.camera.vehicle_id).toBeNull();
    expect(scene.question).toEqual({
      text: "",
      correct_answer: null,
      explanation: "",
    });
    expect(scene.road_layouts).toEqual([]);
    expect(scene.road_users).toEqual([]);
    expect(scene.static_features).toEqual([]);
    expect(scene.required_visible_objects).toEqual([]);
  });

  it("gives every new Scene a unique, stable scene_id", () => {
    const a = createEmptyScene("SE");
    const b = createEmptyScene("SE");
    expect(a.scene_id).not.toBe(b.scene_id);
    expect(a.scene_id.length).toBeGreaterThan(0);
  });

  it("rejects an unknown jurisdiction rather than saving an unresolvable driving side", () => {
    expect(() => createEmptyScene("ZZ")).toThrow(/jurisdiction/i);
  });
});

describe("addRoadLayout", () => {
  it("records the Road Component type and the position it was dropped at", () => {
    const scene = addRoadLayout(createEmptyScene("SE"), "straight_road", {
      x: 120,
      y: 340,
    });

    expect(scene.road_layouts).toHaveLength(1);
    expect(scene.road_layouts[0].component).toBe("straight_road");
    expect(scene.road_layouts[0].position).toEqual({ x: 120, y: 340 });
  });

  it("gives each Road Layout a stable, readable id", () => {
    let scene = createEmptyScene("SE");
    scene = addRoadLayout(scene, "straight_road", { x: 0, y: 0 });
    scene = addRoadLayout(scene, "straight_road", { x: 0, y: 0 });

    expect(scene.road_layouts.map((r) => r.id)).toEqual(["road-1", "road-2"]);
  });

  it("never reuses an id already taken by a surviving Road Layout", () => {
    let scene = createEmptyScene("SE");
    scene = addRoadLayout(scene, "straight_road", { x: 0, y: 0 });
    scene = addRoadLayout(scene, "straight_road", { x: 0, y: 0 });
    // Simulate the first road having been deleted.
    scene = { ...scene, road_layouts: scene.road_layouts.slice(1) };
    scene = addRoadLayout(scene, "straight_road", { x: 0, y: 0 });

    const ids = scene.road_layouts.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(["road-2", "road-3"]);
  });

  it("does not mutate the manifest it was given", () => {
    const before = createEmptyScene("SE");
    addRoadLayout(before, "straight_road", { x: 10, y: 10 });
    expect(before.road_layouts).toEqual([]);
  });
});

describe("clearSceneObjects", () => {
  it("removes every placed Scene Object", () => {
    let scene = createEmptyScene("SE");
    scene = addRoadLayout(scene, "straight_road", { x: 10, y: 10 });
    scene = addRoadLayout(scene, "roundabout", { x: 20, y: 20 });

    expect(clearSceneObjects(scene).road_layouts).toEqual([]);
  });

  it("keeps what identifies the Scene, so it is the same Scene emptied", () => {
    const scene = addRoadLayout(createEmptyScene("GB"), "t_junction", { x: 10, y: 10 });
    const cleared = clearSceneObjects(scene);

    expect(cleared.scene_id).toBe(scene.scene_id);
    expect(cleared.jurisdiction).toBe("GB");
  });

  it("does not mutate the manifest it was given", () => {
    const scene = addRoadLayout(createEmptyScene("SE"), "straight_road", { x: 10, y: 10 });
    clearSceneObjects(scene);
    expect(scene.road_layouts).toHaveLength(1);
  });
});

describe("moveRoadLayout", () => {
  it("repositions the named Road Layout, keeping its stable id", () => {
    const placed = addRoadLayout(createEmptyScene("SE"), "straight_road", { x: 10, y: 10 });
    const moved = moveRoadLayout(placed, "road-1", { x: 400, y: 250 });

    expect(moved.road_layouts[0].id).toBe("road-1");
    expect(moved.road_layouts[0].position).toEqual({ x: 400, y: 250 });
  });

  it("leaves other Road Layouts where they are", () => {
    let scene = createEmptyScene("SE");
    scene = addRoadLayout(scene, "straight_road", { x: 10, y: 10 });
    scene = addRoadLayout(scene, "straight_road", { x: 20, y: 20 });

    const moved = moveRoadLayout(scene, "road-2", { x: 900, y: 900 });
    expect(moved.road_layouts[0].position).toEqual({ x: 10, y: 10 });
  });

  it("does not mutate the manifest it was given", () => {
    const placed = addRoadLayout(createEmptyScene("SE"), "straight_road", { x: 10, y: 10 });
    moveRoadLayout(placed, "road-1", { x: 999, y: 999 });
    expect(placed.road_layouts[0].position).toEqual({ x: 10, y: 10 });
  });
});
