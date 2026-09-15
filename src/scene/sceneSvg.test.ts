import { describe, expect, it } from "vitest";
import { addRoadLayout, createEmptyScene } from "./sceneManifest";
import { renderSourceSvg, sceneToSvgElements } from "./sceneSvg";

describe("sceneToSvgElements", () => {
  it("renders nothing for a Scene with no Road Layouts yet", () => {
    expect(sceneToSvgElements(createEmptyScene("SE"))).toEqual([]);
  });

  it("renders a placed straight road centred on its Road Layout position", () => {
    const scene = addRoadLayout(createEmptyScene("SE"), "straight_road", {
      x: 500,
      y: 300,
    });

    const surface = sceneToSvgElements(scene).find((el) => el.tag === "rect");
    expect(surface).toBeDefined();
    expect(surface!.attrs.x).toBe(300); // 500 - 400/2
    expect(surface!.attrs.y).toBe(240); // 300 - 120/2
    expect(surface!.attrs.width).toBe(400);
    expect(surface!.attrs.height).toBe(120);
  });

  it("gives every element an id derived from the Road Layout's stable id", () => {
    const scene = addRoadLayout(createEmptyScene("SE"), "straight_road", {
      x: 500,
      y: 500,
    });

    const layoutId = scene.road_layouts[0].id;
    for (const el of sceneToSvgElements(scene)) {
      expect(el.id.startsWith(layoutId)).toBe(true);
    }
  });
});

describe("renderSourceSvg", () => {
  it("renders an empty manifest as an empty svg root, inventing no content", () => {
    const svg = renderSourceSvg(createEmptyScene("SE"));
    expect(svg).toContain("<svg");
    expect(svg).not.toMatch(/<(rect|circle|path|line|g)[\s>]/);
  });

  it("includes each placed Road Layout, carrying its stable id into the SVG", () => {
    const scene = addRoadLayout(createEmptyScene("SE"), "straight_road", {
      x: 500,
      y: 500,
    });

    const svg = renderSourceSvg(scene);
    expect(svg).toContain(`id="${scene.road_layouts[0].id}-surface"`);
    expect(svg).toContain("<rect");
  });

  it("asserts no lane marking, since the manifest records no marking variant yet", () => {
    const scene = addRoadLayout(createEmptyScene("SE"), "straight_road", {
      x: 500,
      y: 500,
    });

    expect(renderSourceSvg(scene)).not.toContain("stroke-dasharray");
  });

  it("is deterministic for the same manifest", () => {
    const scene = addRoadLayout(createEmptyScene("SE"), "straight_road", {
      x: 250,
      y: 750,
    });
    expect(renderSourceSvg(scene)).toBe(renderSourceSvg(scene));
  });
});
