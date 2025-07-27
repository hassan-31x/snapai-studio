import { createContext } from "react";

export const CanvasContext = createContext({
  canvasEditor: null,
  setCanvasEditor: (canvas: any) => {},
})