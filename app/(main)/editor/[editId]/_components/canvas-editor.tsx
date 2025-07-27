import React, { useEffect, useRef, useState } from 'react'
import { Canvas } from 'fabric';
import { useCanvasHook } from '../page';

type CanvasData = {
  width?: number;
  height?: number;
}

const CanvasEditor = ({ data }: { data?: CanvasData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const { canvasEditor, setCanvasEditor } = useCanvasHook();

  const { width=1280, height=720 } = data || {};

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: width / 2,
        height: height / 2,
        backgroundColor: '#fff'
      });

      //set High Resolution Canvas
      const scaleFactor = window.devicePixelRatio || 1;
      initCanvas.set({
        width: width * scaleFactor,
        height: height * scaleFactor,
        zoom: 1 / scaleFactor
      });

      initCanvas.renderAll();
      setCanvas(initCanvas);
      setCanvasEditor(initCanvas);

      return () => {
        initCanvas.destroy();
      }
    }
  }, [canvasRef, data]);

  return (
    <div className='w-full h-full bg-gray-300 flex items-center justify-center'>
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}

export default CanvasEditor