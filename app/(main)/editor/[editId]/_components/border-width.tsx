import React, { useState } from "react";
import ColorPicker from "./color-picker";
import { useCanvasHook } from "@/context/canvas-provider";
import { Slider } from "@/components/ui/slider";

const BorderWidth = () => {
  const [borderWidth, setBorderWidth] = useState(1);
  const { canvasEditor } = useCanvasHook();

  const onBorderWidthChange = (value: number) => {
    setBorderWidth(value);
    if (canvasEditor) {
      canvasEditor.getActiveObject()?.set({
        strokeWidth: value,
      });
      canvasEditor.renderAll();
    }
  };

  return (
    <div>
      <h2>Border Width</h2>
      <Slider
        defaultValue={[borderWidth]}
        max={100}
        min={1}
        step={1}
        onValueChange={(value) => onBorderWidthChange(value[0])}
      />
    </div>
  );
};

export default BorderWidth;
