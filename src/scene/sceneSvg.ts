import type { RoadLayout, SceneManifest } from "./sceneManifest";
import { STRAIGHT_ROAD_LENGTH, STRAIGHT_ROAD_WIDTH } from "./roadComponents";

export const SCENE_VIEWBOX_SIZE = 1000;

export interface SvgElement {
  tag: "rect";
  id: string;
  // The Scene Object this shape belongs to, so the canvas can hit-test back to
  // the manifest entry without parsing element ids.
  sceneObjectId: string;
  attrs: Record<string, string | number>;
}

// The single geometry source for both renderers below. ADR 0005: the canvas
// and the Source SVG must be identical by construction, so neither one gets
// to describe a shape the other doesn't.
export function sceneToSvgElements(manifest: SceneManifest): SvgElement[] {
  return manifest.road_layouts.flatMap(roadLayoutElements);
}

function roadLayoutElements(layout: RoadLayout): SvgElement[] {
  switch (layout.component) {
    case "straight_road":
      return straightRoadElements(layout);
  }
}

// Road surface only. Lane markings carry traffic meaning (a dashed centreline
// says overtaking is permitted), so they stay unrendered until the manifest
// actually records a lane-marking variant.
function straightRoadElements(layout: RoadLayout): SvgElement[] {
  return [
    {
      tag: "rect",
      id: `${layout.id}-surface`,
      sceneObjectId: layout.id,
      attrs: {
        x: layout.position.x - STRAIGHT_ROAD_LENGTH / 2,
        y: layout.position.y - STRAIGHT_ROAD_WIDTH / 2,
        width: STRAIGHT_ROAD_LENGTH,
        height: STRAIGHT_ROAD_WIDTH,
        fill: "#4a4a4a",
      },
    },
  ];
}

function escapeAttr(value: string | number): string {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function serializeElement(element: SvgElement): string {
  const attrs = Object.entries(element.attrs)
    .map(([name, value]) => `${name}="${escapeAttr(value)}"`)
    .join(" ");
  return `<${element.tag} id="${escapeAttr(element.id)}" ${attrs} />`;
}

// Deterministically derives the Source SVG from a Scene Manifest. An empty
// manifest renders as an empty <svg> root — nothing is invented that isn't in
// the manifest.
export function renderSourceSvg(manifest: SceneManifest): string {
  const body = sceneToSvgElements(manifest).map(serializeElement).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SCENE_VIEWBOX_SIZE} ${SCENE_VIEWBOX_SIZE}" data-scene-id="${escapeAttr(manifest.scene_id)}">${body}</svg>`;
}
