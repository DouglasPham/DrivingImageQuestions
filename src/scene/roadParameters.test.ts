import { describe, expect, it } from "vitest";
import { DEFAULT_ROAD_PARAMETERS } from "./roadComponents";
import { addRoadLayout, createEmptyScene, setRoadParameters } from "./sceneManifest";

describe("road parameters", () => {
  it("gives a newly placed Road Component the default parameter set", () => {
    const scene = addRoadLayout(createEmptyScene("SE"), "t_junction", { x: 500, y: 500 });
    expect(scene.road_layouts[0].parameters).toEqual(DEFAULT_ROAD_PARAMETERS);
  });

  it("changes one parameter independently, leaving the others untouched", () => {
    const placed = addRoadLayout(createEmptyScene("SE"), "four_way_intersection", {
      x: 500,
      y: 500,
    });
    const updated = setRoadParameters(placed, "road-1", { traffic_control: "stop_sign" });

    expect(updated.road_layouts[0].parameters).toEqual({
      ...DEFAULT_ROAD_PARAMETERS,
      traffic_control: "stop_sign",
    });
  });

  it("does not mutate the manifest it was given", () => {
    const placed = addRoadLayout(createEmptyScene("SE"), "straight_road", { x: 0, y: 0 });
    setRoadParameters(placed, "road-1", { bike_lane: "separated" });
    expect(placed.road_layouts[0].parameters.bike_lane).toBe("absent");
  });

  it("survives a round trip through JSON, so any combination can be saved and reloaded", () => {
    let scene = addRoadLayout(createEmptyScene("SE"), "roundabout", { x: 500, y: 500 });
    scene = setRoadParameters(scene, "road-1", {
      traffic_control: "yield_sign",
      pedestrian_crossing: "present",
      bike_lane: "separated",
      lane_marking: "warning",
    });

    expect(JSON.parse(JSON.stringify(scene))).toEqual(scene);
  });
});
