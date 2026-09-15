// Road Components are the Editor's prefab library: a Content Maintainer drags
// one onto the canvas to create a Road Layout instance (CONTEXT.md). Geometry
// is fixed by the prefab, never freehand-drawn, so traffic geometry and lane
// markings are correct by construction.

export type RoadComponentType = "straight_road";

export interface RoadComponent {
  type: RoadComponentType;
  name: string;
}

export const ROAD_COMPONENTS: RoadComponent[] = [
  { type: "straight_road", name: "Straight road" },
];

export const STRAIGHT_ROAD_LENGTH = 400;
export const STRAIGHT_ROAD_WIDTH = 120;

// Drag payload identifying a Road Component dragged from the palette.
export const ROAD_COMPONENT_DRAG_TYPE = "application/x-road-component";
