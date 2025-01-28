import { CanvasToolbar } from './canvas-toolbar';
import { CanvasSettings } from './canvas-settings';
import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from 'fabric';

interface Props {
  className?: string;
}

export const CanvasField: React.FC<Props> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 500,
        height: 500,
      });

      initCanvas.backgroundColor = '#fff';
      initCanvas.renderAll();
      setCanvas(initCanvas);

      return () => {
        initCanvas.dispose();
      };
    }
  }, [canvasRef]);

  return (
    <div className={className}>
      <CanvasToolbar canvas={canvas} canvasRef={canvasRef} />
      <canvas id="canvas" ref={canvasRef} />
      <CanvasSettings canvas={canvas} />
    </div>
  );
};
