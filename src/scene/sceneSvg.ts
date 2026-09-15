import { drivingSideFor, type DrivingSide } from "./jurisdictions";
import type { RoadLayout, SceneManifest } from "./sceneManifest";
import {
  ARM_LENGTH,
  DIRECTION_VECTORS,
  JUNCTION_HALF,
  ROAD_WIDTH,
  ROUNDABOUT_ISLAND_RADIUS,
  ROUNDABOUT_RADIUS,
  findRoadComponent,
  type Direction,
  type LaneMarking,
} from "./roadComponents";

export const SCENE_VIEWBOX_SIZE = 1000;

export interface SvgElement {
  tag: "rect" | "line" | "circle";
  id: string;
  // The Scene Object this shape belongs to, so the canvas can hit-test back to
  // the manifest entry without parsing element ids.
  sceneObjectId: string;
  attrs: Record<string, string | number>;
}

const SURFACE_FILL = "#4a4a4a";
const MARKING_FILL = "#f2f2f2";
const ISLAND_FILL = "#7a8c6a";
const SHARED_PATH_FILL = "#b9b4a8";
const CYCLE_LANE_FILL = "#8c5a4a";

const HALF_ROAD = ROAD_WIDTH / 2;

const DASH_PATTERNS: Record<LaneMarking, string | null> = {
  solid: null,
  dashed: "24 18",
  // A warning line runs long dashes with short gaps, unlike an ordinary
  // dashed centreline — the distinction carries overtaking meaning.
  warning: "48 12",
};

// The single geometry source for both renderers below. ADR 0005: the canvas
// and the Source SVG must be identical by construction, so neither one gets
// to describe a shape the other doesn't.
export function sceneToSvgElements(manifest: SceneManifest): SvgElement[] {
  const drivingSide = drivingSideFor(manifest.jurisdiction);
  return manifest.road_layouts.flatMap((layout) => roadLayoutElements(layout, drivingSide));
}

// Each contributor below reads one parameter and is blind to the others, so
// base shape and parameters compose instead of multiplying into a prefab per
// combination (CONTEXT.md, Road Component).
function roadLayoutElements(layout: RoadLayout, drivingSide: DrivingSide | null): SvgElement[] {
  return [
    ...surfaceElements(layout),
    ...laneMarkingElements(layout),
    ...bikeLaneElements(layout),
    ...pedestrianCrossingElements(layout),
    ...trafficControlElements(layout, drivingSide),
  ];
}

// Where a component's arms begin: outside the roundabout ring, or outside the
// junction box for every other base shape.
function innerRadius(layout: RoadLayout): number {
  return layout.component === "roundabout" ? ROUNDABOUT_RADIUS : JUNCTION_HALF;
}

function armsOf(layout: RoadLayout): Direction[] {
  return findRoadComponent(layout.component).arms;
}

// Builds an axis-aligned rect from arm-local coordinates: `along` runs outward
// from the component's centre, `across` runs perpendicular to the arm. Working
// in these terms means each contributor is written once, not once per compass
// direction.
function armRect(
  layout: RoadLayout,
  direction: Direction,
  along: [number, number],
  across: [number, number],
): { x: number; y: number; width: number; height: number } {
  const u = DIRECTION_VECTORS[direction];
  const p = { x: -u.y, y: u.x };

  const xs: number[] = [];
  const ys: number[] = [];
  for (const d of along) {
    for (const o of across) {
      xs.push(layout.position.x + u.x * d + p.x * o);
      ys.push(layout.position.y + u.y * d + p.y * o);
    }
  }

  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
}

// A point in arm-local coordinates: `along` outward from centre, `across`
// perpendicular to the arm.
function armPoint(
  layout: RoadLayout,
  direction: Direction,
  along: number,
  across: number,
): { x: number; y: number } {
  const u = DIRECTION_VECTORS[direction];
  return {
    x: layout.position.x + u.x * along + -u.y * across,
    y: layout.position.y + u.y * along + u.x * across,
  };
}

function rect(
  id: string,
  layout: RoadLayout,
  box: { x: number; y: number; width: number; height: number },
  fill: string,
): SvgElement {
  return { tag: "rect", id, sceneObjectId: layout.id, attrs: { ...box, fill } };
}

function surfaceElements(layout: RoadLayout): SvgElement[] {
  const arms = armsOf(layout).map((direction) =>
    rect(
      `${layout.id}-surface-${direction}`,
      layout,
      armRect(layout, direction, [0, ARM_LENGTH], [-HALF_ROAD, HALF_ROAD]),
      SURFACE_FILL,
    ),
  );

  if (layout.component !== "roundabout") {
    return [
      rect(
        `${layout.id}-surface-junction`,
        layout,
        armRect(layout, "east", [-JUNCTION_HALF, JUNCTION_HALF], [-HALF_ROAD, HALF_ROAD]),
        SURFACE_FILL,
      ),
      ...arms,
    ];
  }

  return [
    ...arms,
    circle(`${layout.id}-roundabout-ring`, layout, ROUNDABOUT_RADIUS, SURFACE_FILL),
    circle(`${layout.id}-roundabout-island`, layout, ROUNDABOUT_ISLAND_RADIUS, ISLAND_FILL),
  ];
}

function circle(id: string, layout: RoadLayout, radius: number, fill: string): SvgElement {
  return {
    tag: "circle",
    id,
    sceneObjectId: layout.id,
    attrs: { cx: layout.position.x, cy: layout.position.y, r: radius, fill },
  };
}

function laneMarkingElements(layout: RoadLayout): SvgElement[] {
  const dash = DASH_PATTERNS[layout.parameters.lane_marking];
  const start = innerRadius(layout);

  return armsOf(layout).map((direction) => {
    const u = DIRECTION_VECTORS[direction];
    const attrs: Record<string, string | number> = {
      x1: layout.position.x + u.x * start,
      y1: layout.position.y + u.y * start,
      x2: layout.position.x + u.x * ARM_LENGTH,
      y2: layout.position.y + u.y * ARM_LENGTH,
      stroke: MARKING_FILL,
      "stroke-width": 3,
    };
    if (dash) attrs["stroke-dasharray"] = dash;

    return { tag: "line", id: `${layout.id}-centreline-${direction}`, sceneObjectId: layout.id, attrs };
  });
}

function bikeLaneElements(layout: RoadLayout): SvgElement[] {
  const { bike_lane } = layout.parameters;
  if (bike_lane === "absent") return [];

  // A separated cycle path sits beyond a buffer strip; a shared path runs
  // directly against the carriageway edge.
  const gap = bike_lane === "separated" ? 10 : 0;
  const fill = bike_lane === "separated" ? CYCLE_LANE_FILL : SHARED_PATH_FILL;
  const near = HALF_ROAD + gap;
  const far = near + 20;
  const start = innerRadius(layout);

  return armsOf(layout).flatMap((direction) =>
    [1, -1].map((side) =>
      rect(
        `${layout.id}-bikelane-${direction}-${side > 0 ? "left" : "right"}`,
        layout,
        armRect(layout, direction, [start, ARM_LENGTH], [near * side, far * side]),
        fill,
      ),
    ),
  );
}

// Zebra stripes run parallel to the direction of travel, so the crossing is a
// short band along the arm subdivided across the carriageway — not bars laid
// across the road.
function pedestrianCrossingElements(layout: RoadLayout): SvgElement[] {
  if (layout.parameters.pedestrian_crossing === "absent") return [];

  const start = innerRadius(layout) + 14;
  const bandLength = 44;
  const stripeWidth = 12;
  const stripePitch = 24;

  return armsOf(layout).flatMap((direction) => {
    const stripes: SvgElement[] = [];
    for (let across = -HALF_ROAD; across + stripeWidth <= HALF_ROAD; across += stripePitch) {
      stripes.push(
        rect(
          `${layout.id}-crossing-${direction}-${stripes.length}`,
          layout,
          armRect(layout, direction, [start, start + bandLength], [across, across + stripeWidth]),
          MARKING_FILL,
        ),
      );
    }
    return stripes;
  });
}

// Renders the carriageway markings that each form of traffic control puts on
// the road. The physical sign face is jurisdiction-standard artwork and is a
// Static Feature placed separately, so it is deliberately not drawn here — but
// a signal head is generic rather than jurisdiction-specific, so it is.
function trafficControlElements(
  layout: RoadLayout,
  drivingSide: DrivingSide | null,
): SvgElement[] {
  const { traffic_control } = layout.parameters;
  if (traffic_control === "none") return [];

  const start = innerRadius(layout) + 8;
  // A stop or give-way line governs the approaching carriageway only, and
  // which half that is follows from the jurisdiction's driving side. With an
  // unknown jurisdiction, no half is claimed.
  const approach: [number, number] =
    drivingSide === "right"
      ? [-HALF_ROAD, 0]
      : drivingSide === "left"
        ? [0, HALF_ROAD]
        : [-HALF_ROAD, HALF_ROAD];

  return armsOf(layout).flatMap((direction) => {
    const elements: SvgElement[] = [];

    if (traffic_control === "yield_sign") {
      // A give-way line is broken where a stop line is continuous.
      const from = armPoint(layout, direction, start + 4, approach[0]);
      const to = armPoint(layout, direction, start + 4, approach[1]);
      elements.push({
        tag: "line",
        id: `${layout.id}-stopline-${direction}`,
        sceneObjectId: layout.id,
        attrs: {
          x1: from.x,
          y1: from.y,
          x2: to.x,
          y2: to.y,
          stroke: MARKING_FILL,
          "stroke-width": 8,
          "stroke-dasharray": "10 10",
        },
      });
    } else {
      elements.push(
        rect(
          `${layout.id}-stopline-${direction}`,
          layout,
          armRect(layout, direction, [start, start + 8], approach),
          MARKING_FILL,
        ),
      );
    }

    if (traffic_control === "traffic_light") {
      elements.push(
        rect(
          `${layout.id}-signal-${direction}`,
          layout,
          armRect(layout, direction, [start, start + 24], [HALF_ROAD + 4, HALF_ROAD + 16]),
          "#1f1f1f",
        ),
      );
    }
    return elements;
  });
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
