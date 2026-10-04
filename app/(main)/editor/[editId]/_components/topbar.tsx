import React, { useEffect, useState } from "react";
import ShapeSetting from "./shape-setting";
import { useCanvasHook } from "@/context/canvas-provider";

const TopBar = () => {
  const [showShapeSetting, setShowShapeSetting] = useState(false);

  const { canvasEditor } = useCanvasHook();

  useEffect(() => {
    if (!canvasEditor) return;
    const selected = () =>
      setShowShapeSetting(!!canvasEditor.getActiveObject());
    const cleared = () => setShowShapeSetting(false);
    canvasEditor.on("selection:created", selected);
    canvasEditor.on("selection:updated", selected);
    canvasEditor.on("selection:cleared", cleared);
    return () => {
      canvasEditor.off("selection:created", selected);
      canvasEditor.off("selection:updated", selected);
      canvasEditor.off("selection:cleared", cleared);
    };
  }, [canvasEditor]);

  return (
    <div className="w-full h-10 bg-white flex items-center">
      {showShapeSetting && <ShapeSetting />}
    </div>
  );
};

export default TopBar;
