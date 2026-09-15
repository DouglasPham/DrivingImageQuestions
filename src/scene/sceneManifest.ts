import { findJurisdiction } from "./jurisdictions";
import {
  DEFAULT_ROAD_PARAMETERS,
  type RoadComponentType,
  type RoadParameters,
} from "./roadComponents";

export interface Position {
  x: number;
  y: number;
}

export interface RoadLayout {
  id: string;
  component: RoadComponentType;
  position: Position;
  parameters: RoadParameters;
}

export interface RoadUser {
  id: string;
  type: string;
  color: string;
  position: Position;
  heading: number;
  action: string;
}

export interface StaticFeature {
  id: string;
  type: string;
  position: Position;
}

// Jurisdiction is the single source of truth for driving side, so the manifest
// deliberately has no driving_side field — derive it with drivingSideFor().
export interface SceneManifest {
  scene_id: string;
  jurisdiction: string;
  camera: {
    vehicle_id: string | null;
  };
  question: {
    text: string;
    correct_answer: string | null;
    explanation: string;
  };
  road_layouts: RoadLayout[];
  road_users: RoadUser[];
  static_features: StaticFeature[];
  required_visible_objects: string[];
}

// A fresh Scene has a Jurisdiction (and thus a derived driving_side) and
// nothing else yet — no Camera, no Question, no Scene Objects. Those are
// authored in later steps of the Editor, not at creation time.
export function createEmptyScene(jurisdictionCode: string): SceneManifest {
  const jurisdiction = findJurisdiction(jurisdictionCode);
  if (!jurisdiction) {
    throw new Error(`Unknown jurisdiction: "${jurisdictionCode}"`);
  }

  return {
    scene_id: crypto.randomUUID(),
    jurisdiction: jurisdiction.code,
    camera: { vehicle_id: null },
    question: { text: "", correct_answer: null, explanation: "" },
    road_layouts: [],
    road_users: [],
    static_features: [],
    required_visible_objects: [],
  };
}

// Counts up from the highest id in use rather than from the list length, so an
// id is never handed out twice after an earlier Road Layout has been deleted.
function nextRoadLayoutId(existing: RoadLayout[]): string {
  const highest = existing.reduce((max, layout) => {
    const suffix = Number(layout.id.replace(/^road-/, ""));
    return Number.isFinite(suffix) && suffix > max ? suffix : max;
  }, 0);
  return `road-${highest + 1}`;
}

export function addRoadLayout(
  manifest: SceneManifest,
  component: RoadComponentType,
  position: Position,
): SceneManifest {
  const layout: RoadLayout = {
    id: nextRoadLayoutId(manifest.road_layouts),
    component,
    position,
    parameters: DEFAULT_ROAD_PARAMETERS,
  };
  return { ...manifest, road_layouts: [...manifest.road_layouts, layout] };
}

export function setRoadParameters(
  manifest: SceneManifest,
  layoutId: string,
  changes: Partial<RoadParameters>,
): SceneManifest {
  return {
    ...manifest,
    road_layouts: manifest.road_layouts.map((layout) =>
      layout.id === layoutId
        ? { ...layout, parameters: { ...layout.parameters, ...changes } }
        : layout,
    ),
  };
}

export function moveRoadLayout(
  manifest: SceneManifest,
  layoutId: string,
  position: Position,
): SceneManifest {
  return {
    ...manifest,
    road_layouts: manifest.road_layouts.map((layout) =>
      layout.id === layoutId ? { ...layout, position } : layout,
    ),
  };
}
