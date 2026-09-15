import { useRef, useState } from "react";
import type { Position, SceneManifest } from "../scene/sceneManifest";
import { ROAD_COMPONENT_DRAG_TYPE, type RoadComponentType } from "../scene/roadComponents";
import { SCENE_VIEWBOX_SIZE, sceneToSvgElements } from "../scene/sceneSvg";

interface SceneCanvasProps {
  scene: SceneManifest;
  onPlaceComponent: (component: RoadComponentType, position: Position) => void;
  onMoveSceneObject: (sceneObjectId: string, position: Position) => void;
}

// Offset between the pointer and the dragged object's own position, so a drag
// moves the object by the same delta as the pointer instead of snapping its
// centre under the cursor.
interface Drag {
  sceneObjectId: string;
  offset: Position;
}

export function SceneCanvas({ scene, onPlaceComponent, onMoveSceneObject }: SceneCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<Drag | null>(null);

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
      onPointerMove={handlePointerMove}
      onPointerUp={() => setDrag(null)}
      onPointerCancel={() => setDrag(null)}
    >
      {sceneToSvgElements(scene).map((element) => {
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
    </svg>
  );
}
