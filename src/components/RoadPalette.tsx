import { ROAD_COMPONENTS, ROAD_COMPONENT_DRAG_TYPE } from "../scene/roadComponents";

export function RoadPalette() {
  return (
    <ul className="palette">
      {ROAD_COMPONENTS.map((component) => (
        <li
          key={component.type}
          className="palette-item"
          draggable
          onDragStart={(e) =>
            e.dataTransfer.setData(ROAD_COMPONENT_DRAG_TYPE, component.type)
          }
        >
          {component.name}
        </li>
      ))}
    </ul>
  );
}
