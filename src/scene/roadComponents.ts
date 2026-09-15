// Road Components are the Editor's prefab library: a Content Maintainer drags
// one onto the canvas to create a Road Layout instance (CONTEXT.md). A small
// set of base shapes is combined with independent parameters rather than
// enumerating a prefab per combination, and geometry is computed rather than
// drawn, so traffic geometry stays correct by construction.

export type RoadComponentType =
  | "straight_road"
  | "t_junction"
  | "four_way_intersection"
  | "roundabout";

export type TrafficControl = "none" | "traffic_light" | "stop_sign" | "yield_sign";
export type PedestrianCrossing = "absent" | "present";
export type BikeLane = "absent" | "shared_path" | "separated";
export type LaneMarking = "solid" | "dashed" | "warning";

export interface RoadParameters {
  traffic_control: TrafficControl;
  pedestrian_crossing: PedestrianCrossing;
  bike_lane: BikeLane;
  lane_marking: LaneMarking;
}

export interface RoadComponent {
  type: RoadComponentType;
  name: string;
  arms: Direction[];
}

export type Direction = "north" | "south" | "east" | "west";

export const ROAD_COMPONENTS: RoadComponent[] = [
  { type: "straight_road", name: "Straight road", arms: ["west", "east"] },
  { type: "t_junction", name: "T-junction", arms: ["west", "east", "south"] },
  {
    type: "four_way_intersection",
    name: "4-way intersection",
    arms: ["north", "south", "east", "west"],
  },
  {
    type: "roundabout",
    name: "Roundabout",
    arms: ["north", "south", "east", "west"],
  },
];

export function findRoadComponent(type: RoadComponentType): RoadComponent {
  const component = ROAD_COMPONENTS.find((c) => c.type === type);
  if (!component) throw new Error(`Unknown Road Component: "${type}"`);
  return component;
}

export const DEFAULT_ROAD_PARAMETERS: RoadParameters = {
  traffic_control: "none",
  pedestrian_crossing: "absent",
  bike_lane: "absent",
  lane_marking: "dashed",
};

// Geometry, in Scene viewBox units.
export const ROAD_WIDTH = 120;
export const ARM_LENGTH = 200;
export const JUNCTION_HALF = ROAD_WIDTH / 2;
export const ROUNDABOUT_RADIUS = 110;
export const ROUNDABOUT_ISLAND_RADIUS = 55;

// Outward unit vector per arm direction. Working in vectors keeps every
// contributor below written once instead of once per compass direction.
export const DIRECTION_VECTORS: Record<Direction, { x: number; y: number }> = {
  north: { x: 0, y: -1 },
  south: { x: 0, y: 1 },
  east: { x: 1, y: 0 },
  west: { x: -1, y: 0 },
};

// Drag payload identifying a Road Component dragged from the palette.
export const ROAD_COMPONENT_DRAG_TYPE = "application/x-road-component";
