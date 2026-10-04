import React, { useState } from "react";
import ColorPicker from "./color-picker";
import { useCanvasHook } from "@/context/canvas-provider";

const BackgroundSetting = () => {
  const [color, setColor] = useState("#fff");
  const { canvasEditor } = useCanvasHook();

  const onColorChange = (color: string) => {
    setColor(color);
    if (canvasEditor) {
      (canvasEditor as any)?.set({
        backgroundColor: color,
        backgroundImage: null,
      });
      (canvasEditor as any)?.renderAll();
    }
  };
  return (
    <div className="">
      <ColorPicker value={color} onChange={(e) => onColorChange(e)} />
    </div>
  );
};

export default BackgroundSetting;
