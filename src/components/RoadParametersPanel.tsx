import type { RoadLayout } from "../scene/sceneManifest";
import { findRoadComponent, type RoadParameters } from "../scene/roadComponents";

// Each parameter varies independently of the others (CONTEXT.md, Road
// Component), so the panel is a flat list of choices rather than a tree of
// shape-specific forms.
const PARAMETER_OPTIONS: {
  [K in keyof RoadParameters]: { label: string; options: { value: RoadParameters[K]; label: string }[] };
} = {
  traffic_control: {
    label: "Traffic control",
    options: [
      { value: "none", label: "None" },
      { value: "traffic_light", label: "Traffic light" },
      { value: "stop_sign", label: "Stop sign" },
      { value: "yield_sign", label: "Yield sign" },
    ],
  },
  pedestrian_crossing: {
    label: "Pedestrian crossing",
    options: [
      { value: "absent", label: "Absent" },
      { value: "present", label: "Present" },
    ],
  },
  bike_lane: {
    label: "Bike lane",
    options: [
      { value: "absent", label: "Absent" },
      { value: "shared_path", label: "Shared with pedestrian path" },
      { value: "separated", label: "Separated" },
    ],
  },
  lane_marking: {
    label: "Lane marking",
    options: [
      { value: "solid", label: "Solid" },
      { value: "dashed", label: "Dashed" },
      { value: "warning", label: "Warning" },
    ],
  },
};

const PARAMETER_KEYS = Object.keys(PARAMETER_OPTIONS) as (keyof RoadParameters)[];

interface RoadParametersPanelProps {
  layout: RoadLayout;
  onChange: (changes: Partial<RoadParameters>) => void;
}

export function RoadParametersPanel({ layout, onChange }: RoadParametersPanelProps) {
  return (
    <div className="parameters">
      <h3>
        {findRoadComponent(layout.component).name} <span className="scene-id">{layout.id}</span>
      </h3>

      {PARAMETER_KEYS.map((key) => (
        <p key={key}>
          <label htmlFor={`param-${key}`}>{PARAMETER_OPTIONS[key].label}</label>
          <select
            id={`param-${key}`}
            value={layout.parameters[key]}
            onChange={(e) => onChange({ [key]: e.currentTarget.value } as Partial<RoadParameters>)}
          >
            {PARAMETER_OPTIONS[key].options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </p>
      ))}
    </div>
  );
}
