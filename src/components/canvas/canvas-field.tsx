import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from 'fabric';
import clsx from 'clsx';
import { CanvasToolbar } from './canvas-toolbar';

interface Props {
  className?: string;
}

export const CanvasField: React.FC<Props> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 1000,
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
    <div
      className={clsx('flex flex-col items-center justify-center min-h-screen h-full', className)}>
      <canvas id="canvas" ref={canvasRef} />
      <CanvasToolbar canvas={canvas} />
    </div>
  );
};
