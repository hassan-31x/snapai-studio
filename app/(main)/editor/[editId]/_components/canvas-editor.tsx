import React, { useEffect, useRef, useState } from "react";
import { Canvas } from "fabric";
import { useCanvasHook } from "@/context/canvas-provider";
import TopBar from "./topbar";

type CanvasData = {
  width?: number;
  height?: number;
};

const CanvasEditor = ({ data }: { data?: CanvasData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const { canvasEditor, setCanvasEditor } = useCanvasHook();

  const { width = 1280, height = 720 } = data || {};

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: width / 2,
        height: height / 2,
        backgroundColor: "#fff",
      });

      //set High Resolution Canvas
      const scaleFactor = window.devicePixelRatio || 1;
      initCanvas.set({
        width: width * scaleFactor,
        height: height * scaleFactor,
        zoom: 1 / scaleFactor,
      });

      initCanvas.renderAll();
      setCanvas(initCanvas);
      setCanvasEditor(initCanvas);

      return () => {
        initCanvas.dispose();
      };
    }
  }, [width, height, setCanvasEditor]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement)?.closest(
          "input, textarea, [contenteditable=true]",
        )
      )
        return;
      if (e.key === "Delete" || e.key === "Backspace") {
        if (!canvasEditor) return;
        const activeObject = canvasEditor?.getActiveObject();

        if (activeObject) {
          canvasEditor?.remove(activeObject);
          canvasEditor?.renderAll();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canvasEditor]);

  return (
    <div className="w-full h-full bg-gray-300 flex flex-col items-center">
      <TopBar />
      <div className="w-full h-full flex items-center justify-center">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default CanvasEditor;
