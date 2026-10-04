import React from "react";
import { Square, Circle as CircleIcon, Triangle, Minus } from "lucide-react";
import { Circle, Line, Rect } from "fabric";
import { useCanvasHook } from "@/context/canvas-provider";

const shapeList = [
  {
    name: "Rectangle",
    icon: <Square />,
  },
  {
    name: "Circle",
    icon: <CircleIcon />,
  },
  {
    name: "Triangle",
    icon: <Triangle />,
  },
  {
    name: "Line",
    icon: <Minus />,
  },
];

const Shapes = () => {
  const { canvasEditor } = useCanvasHook();

  const onShapeSelect = (shape: string) => {
    const properties = {
      left: 100,
      top: 100,
      radius: 50,
      width: 100,
      height: 100,
      fill: "black",
      stroke: "black",
      strokeWidth: 0,
    };
    if (!canvasEditor) return;

    if (shape === "Circle") {
      const circleRef = new Circle({
        ...properties,
      });
      canvasEditor.add(circleRef);
    } else if (shape === "Rectangle") {
      const rectangleRef = new Rect({
        ...properties,
      });
      canvasEditor.add(rectangleRef);
    } else if (shape === "Line") {
      const lineRef = new Line([50, 50, 200, 200], {
        stroke: "black",
        strokeWidth: 5,
      });
      canvasEditor.add(lineRef);
    }
    canvasEditor.renderAll();
  };

  return (
    <div className="flex flex-wrap gap-2">
      {shapeList.map((shape) => (
        <div
          key={shape.name}
          onClick={() => onShapeSelect(shape.name)}
          className="p-2 border border-gray-300 rounded-md cursor-pointer"
        >
          {shape.icon}
        </div>
      ))}
    </div>
  );
};

export default Shapes;
