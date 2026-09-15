import { describe, expect, it } from "vitest";
import type { RoadParameters } from "./roadComponents";
import type { RoadComponentType } from "./roadComponents";
import { addRoadLayout, createEmptyScene, setRoadParameters } from "./sceneManifest";
import { renderSourceSvg, sceneToSvgElements, type SvgElement } from "./sceneSvg";

function elementsFor(
  component: RoadComponentType,
  changes: Partial<RoadParameters> = {},
): SvgElement[] {
  let scene = addRoadLayout(createEmptyScene("SE"), component, { x: 500, y: 500 });
  scene = setRoadParameters(scene, "road-1", changes);
  return sceneToSvgElements(scene);
}

function idsMatching(elements: SvgElement[], fragment: string): string[] {
  return elements.map((e) => e.id).filter((id) => id.includes(fragment));
}

describe("base shapes", () => {
  it("renders nothing for a Scene with no Road Layouts yet", () => {
    expect(sceneToSvgElements(createEmptyScene("SE"))).toEqual([]);
  });

  it("gives a straight road two arms and no north/south arm", () => {
    const ids = idsMatching(elementsFor("straight_road"), "surface-");
    expect(ids).toContain("road-1-surface-east");
    expect(ids).toContain("road-1-surface-west");
    expect(ids).not.toContain("road-1-surface-north");
  });

  it("gives a T-junction three arms", () => {
    const ids = idsMatching(elementsFor("t_junction"), "surface-");
    expect(ids).toEqual(
      expect.arrayContaining([
        "road-1-surface-west",
        "road-1-surface-east",
        "road-1-surface-south",
      ]),
    );
    expect(ids).not.toContain("road-1-surface-north");
  });

  it("gives a 4-way intersection all four arms", () => {
    const ids = idsMatching(elementsFor("four_way_intersection"), "surface-");
    for (const direction of ["north", "south", "east", "west"]) {
      expect(ids).toContain(`road-1-surface-${direction}`);
    }
  });

  it("gives a roundabout a ring and a centre island instead of a junction box", () => {
    const elements = elementsFor("roundabout");
    const ids = elements.map((e) => e.id);
    expect(ids).toContain("road-1-roundabout-ring");
    expect(ids).toContain("road-1-roundabout-island");
    expect(ids).not.toContain("road-1-surface-junction");
    expect(elements.filter((e) => e.tag === "circle")).toHaveLength(2);
  });
});

describe("lane marking variants", () => {
  it("draws a solid centreline with no dash pattern", () => {
    const line = elementsFor("straight_road", { lane_marking: "solid" }).find((e) =>
      e.id.includes("centreline"),
    );
    expect(line!.attrs["stroke-dasharray"]).toBeUndefined();
  });

  it("distinguishes a dashed centreline from a warning line", () => {
    const dashed = elementsFor("straight_road", { lane_marking: "dashed" }).find((e) =>
      e.id.includes("centreline"),
    );
    const warning = elementsFor("straight_road", { lane_marking: "warning" }).find((e) =>
      e.id.includes("centreline"),
    );

    expect(dashed!.attrs["stroke-dasharray"]).toBeDefined();
    expect(warning!.attrs["stroke-dasharray"]).toBeDefined();
    expect(warning!.attrs["stroke-dasharray"]).not.toBe(dashed!.attrs["stroke-dasharray"]);
  });
});

describe("pedestrian crossing", () => {
  it("draws no crossing when absent", () => {
    expect(idsMatching(elementsFor("four_way_intersection"), "crossing")).toEqual([]);
  });

  it("draws a crossing on every arm when present", () => {
    const ids = idsMatching(
      elementsFor("four_way_intersection", { pedestrian_crossing: "present" }),
      "crossing",
    );
    for (const direction of ["north", "south", "east", "west"]) {
      expect(ids.some((id) => id.includes(`crossing-${direction}`))).toBe(true);
    }
  });
});

describe("bike lane", () => {
  it("draws nothing when absent", () => {
    expect(idsMatching(elementsFor("straight_road"), "bikelane")).toEqual([]);
  });

  it("renders a separated cycle path differently from one shared with pedestrians", () => {
    const shared = elementsFor("straight_road", { bike_lane: "shared_path" }).find((e) =>
      e.id.includes("bikelane"),
    );
    const separated = elementsFor("straight_road", { bike_lane: "separated" }).find((e) =>
      e.id.includes("bikelane"),
    );

    expect(shared).toBeDefined();
    expect(separated).toBeDefined();
    // A separated path is set back from the carriageway by a buffer.
    expect(separated!.attrs).not.toEqual(shared!.attrs);
  });
});

describe("traffic control", () => {
  it("draws no stop line when there is no traffic control", () => {
    expect(idsMatching(elementsFor("four_way_intersection"), "stopline")).toEqual([]);
  });

  it("distinguishes a stop line from a give-way line", () => {
    const stop = elementsFor("four_way_intersection", { traffic_control: "stop_sign" }).find((e) =>
      e.id.includes("stopline"),
    );
    const yieldLine = elementsFor("four_way_intersection", {
      traffic_control: "yield_sign",
    }).find((e) => e.id.includes("stopline"));

    expect(stop!.attrs["stroke-dasharray"]).toBeUndefined();
    expect(yieldLine!.attrs["stroke-dasharray"]).toBeDefined();
  });

  it("puts the stop line on the approaching carriageway, which side depending on the jurisdiction", () => {
    const stopLineFor = (jurisdiction: string) => {
      let scene = addRoadLayout(createEmptyScene(jurisdiction), "four_way_intersection", {
        x: 500,
        y: 500,
      });
      scene = setRoadParameters(scene, "road-1", { traffic_control: "stop_sign" });
      return sceneToSvgElements(scene).find((e) => e.id === "road-1-stopline-east")!;
    };

    // Sweden drives on the right, the United Kingdom on the left, so the
    // governed half of the same arm is mirrored between them.
    expect(stopLineFor("SE").attrs.y).not.toBe(stopLineFor("GB").attrs.y);
  });

  it("renders a signal head only for a traffic light, so it cannot be confused with a stop sign", () => {
    expect(
      idsMatching(elementsFor("four_way_intersection", { traffic_control: "traffic_light" }), "signal"),
    ).not.toEqual([]);
    expect(
      idsMatching(elementsFor("four_way_intersection", { traffic_control: "stop_sign" }), "signal"),
    ).toEqual([]);
  });
});

describe("parameters compose", () => {
  it("renders every parameter's contribution at once, not a prefab per combination", () => {
    const ids = elementsFor("four_way_intersection", {
      traffic_control: "traffic_light",
      pedestrian_crossing: "present",
      bike_lane: "separated",
      lane_marking: "solid",
    }).map((e) => e.id);

    expect(ids.some((id) => id.includes("stopline"))).toBe(true);
    expect(ids.some((id) => id.includes("crossing"))).toBe(true);
    expect(ids.some((id) => id.includes("bikelane"))).toBe(true);
    expect(ids.some((id) => id.includes("centreline"))).toBe(true);
  });

  it("gives every element a unique id", () => {
    const ids = elementsFor("roundabout", {
      traffic_control: "yield_sign",
      pedestrian_crossing: "present",
      bike_lane: "separated",
    }).map((e) => e.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("renderSourceSvg", () => {
  it("renders an empty manifest as an empty svg root, inventing no content", () => {
    const svg = renderSourceSvg(createEmptyScene("SE"));
    expect(svg).toContain("<svg");
    expect(svg).not.toMatch(/<(rect|circle|path|line|g)[\s>]/);
  });

  it("includes each placed Road Layout, carrying its stable id into the SVG", () => {
    const scene = addRoadLayout(createEmptyScene("SE"), "straight_road", { x: 500, y: 500 });
    expect(renderSourceSvg(scene)).toContain(`id="${scene.road_layouts[0].id}-surface-east"`);
  });

  it("is deterministic for the same manifest", () => {
    let scene = addRoadLayout(createEmptyScene("SE"), "roundabout", { x: 250, y: 750 });
    scene = setRoadParameters(scene, "road-1", { pedestrian_crossing: "present" });
    expect(renderSourceSvg(scene)).toBe(renderSourceSvg(scene));
  });
});
