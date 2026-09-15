import { useRef, useState } from "react";
import type { Position, SceneManifest } from "../scene/sceneManifest";
import { ROAD_COMPONENT_DRAG_TYPE, type RoadComponentType } from "../scene/roadComponents";
import { SCENE_VIEWBOX_SIZE, sceneToSvgElements, type SvgElement } from "../scene/sceneSvg";

interface SceneCanvasProps {
  scene: SceneManifest;
  selectedId: string | null;
  onPlaceComponent: (component: RoadComponentType, position: Position) => void;
  onMoveSceneObject: (sceneObjectId: string, position: Position) => void;
  onSelect: (sceneObjectId: string | null) => void;
}

// Offset between the pointer and the dragged object's own position, so a drag
// moves the object by the same delta as the pointer instead of snapping its
// centre under the cursor.
interface Drag {
  sceneObjectId: string;
  offset: Position;
}

// Bounds of everything belonging to one Scene Object, used only to draw the
// selection outline. The outline is editor chrome drawn on top — it is never
// mixed into the scene's own elements, which stay identical to the Source SVG.
function boundsOf(elements: SvgElement[]): { x: number; y: number; width: number; height: number } | null {
  const xs: number[] = [];
  const ys: number[] = [];

  for (const { tag, attrs } of elements) {
    const n = (key: string) => Number(attrs[key]);
    if (tag === "rect") {
      xs.push(n("x"), n("x") + n("width"));
      ys.push(n("y"), n("y") + n("height"));
    } else if (tag === "circle") {
      xs.push(n("cx") - n("r"), n("cx") + n("r"));
      ys.push(n("cy") - n("r"), n("cy") + n("r"));
    } else {
      xs.push(n("x1"), n("x2"));
      ys.push(n("y1"), n("y2"));
    }
  }

  if (xs.length === 0) return null;
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
}

export function SceneCanvas({
  scene,
  selectedId,
  onPlaceComponent,
  onMoveSceneObject,
  onSelect,
}: SceneCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<Drag | null>(null);

  const elements = sceneToSvgElements(scene);
  const selectionBounds = selectedId
    ? boundsOf(elements.filter((e) => e.sceneObjectId === selectedId))
    : null;

  // Pointer events arrive in screen pixels; the manifest stores viewBox user
  // units, so convert through the SVG's own transform rather than guessing.
  function toSceneCoords(clientX: number, clientY: number): Position | null {
    const svg = svgRef.current;
    const screenToSvg = svg?.getScreenCTM()?.inverse();
    if (!svg || !screenToSvg) return null;

    const point = new DOMPoint(clientX, clientY).matrixTransform(screenToSvg);
    return { x: Math.round(point.x), y: Math.round(point.y) };
  }

  function handleDrop(event: React.DragEvent<SVGSVGElement>) {
    event.preventDefault();
    const component = event.dataTransfer.getData(ROAD_COMPONENT_DRAG_TYPE);
    if (!component) return;

    const position = toSceneCoords(event.clientX, event.clientY);
    if (position) onPlaceComponent(component as RoadComponentType, position);
  }

  function handlePointerDown(event: React.PointerEvent<SVGElement>, sceneObjectId: string) {
    const layout = scene.road_layouts.find((l) => l.id === sceneObjectId);
    const pointer = toSceneCoords(event.clientX, event.clientY);
    if (!layout || !pointer) return;

    event.stopPropagation();
    onSelect(sceneObjectId);
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({
      sceneObjectId,
      offset: { x: layout.position.x - pointer.x, y: layout.position.y - pointer.y },
    });
  }

  function handlePointerMove(event: React.PointerEvent<SVGSVGElement>) {
    if (!drag) return;
    const pointer = toSceneCoords(event.clientX, event.clientY);
    if (!pointer) return;

    onMoveSceneObject(drag.sceneObjectId, {
      x: pointer.x + drag.offset.x,
      y: pointer.y + drag.offset.y,
    });
  }

  return (
    <svg
      ref={svgRef}
      className="scene-canvas"
      viewBox={`0 0 ${SCENE_VIEWBOX_SIZE} ${SCENE_VIEWBOX_SIZE}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onPointerDown={() => onSelect(null)}
      onPointerMove={handlePointerMove}
      onPointerUp={() => setDrag(null)}
      onPointerCancel={() => setDrag(null)}
    >
      {elements.map((element) => {
        const Tag = element.tag;
        return (
          <Tag
            key={element.id}
            id={element.id}
            cursor="grab"
            onPointerDown={(e: React.PointerEvent<SVGElement>) =>
              handlePointerDown(e, element.sceneObjectId)
            }
            {...element.attrs}
          />
        );
      })}

      {selectionBounds && (
        <rect
          className="selection-outline"
          x={selectionBounds.x - 6}
          y={selectionBounds.y - 6}
          width={selectionBounds.width + 12}
          height={selectionBounds.height + 12}
          fill="none"
          stroke="#2b6cb0"
          strokeWidth={3}
          strokeDasharray="8 6"
          pointerEvents="none"
        />
      )}
    </svg>
  );
}
