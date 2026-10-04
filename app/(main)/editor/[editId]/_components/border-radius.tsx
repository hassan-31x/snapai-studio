import React, { useState } from "react";
import ColorPicker from "./color-picker";
import { useCanvasHook } from "@/context/canvas-provider";
import { Slider } from "@/components/ui/slider";

const BorderRadius = () => {
  const [borderRadius, setBorderRadius] = useState(1);
  const { canvasEditor } = useCanvasHook();

  const onBorderRadiusChange = (value: number) => {
    setBorderRadius(value);
    if (canvasEditor) {
      canvasEditor.getActiveObject()?.set({
        rx: value,
        ry: value,
      });
      canvasEditor.renderAll();
    }
  };

  return (
    <div>
      <h2>Border Radius</h2>
      <Slider
        defaultValue={[borderRadius]}
        max={100}
        step={1}
        onValueChange={(value) => onBorderRadiusChange(value[0])}
      />
    </div>
  );
};

export default BorderRadius;
