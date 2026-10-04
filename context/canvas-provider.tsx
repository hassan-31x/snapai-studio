"use client";
import { createContext, useContext } from "react";
import type { Canvas } from "fabric";
export const CanvasContext = createContext<{
  canvasEditor: Canvas | null;
  setCanvasEditor: (canvas: Canvas | null) => void;
}>({ canvasEditor: null, setCanvasEditor: () => {} });
export function useCanvasHook() {
  return useContext(CanvasContext);
}
