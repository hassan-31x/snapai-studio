import React, { useState } from "react";
import ColorPicker from "./color-picker";
import { useCanvasHook } from "@/context/canvas-provider";

const FillColor = () => {
  const [color, setColor] = useState("#000000");
  const { canvasEditor } = useCanvasHook();

  const onColorChange = (color: string) => {
    setColor(color);
    if (canvasEditor) {
      canvasEditor.getActiveObject()?.set({
        fill: color,
      });
      canvasEditor.renderAll();
    }
  };

  return (
    <div>
      <ColorPicker value={color} onChange={onColorChange} />
    </div>
  );
};

export default FillColor;
