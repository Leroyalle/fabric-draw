import { CanvasToolbar } from './canvas-toolbar';
import { CanvasObjectSettings } from './canvas-object-settings';
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Line } from 'fabric';
import { CanvasSettings } from './canvas-settings';
import { clearGuidelines, handleObjectMoving } from './lib';
import { CanvasCropping } from './canvas-cropping';

interface Props {
  className?: string;
}

export const CanvasField: React.FC<Props> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [guidelines, setGuidelines] = useState<Line[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 500,
        height: 500,
      });

      initCanvas.backgroundColor = '#fff';
      initCanvas.renderAll();
      setCanvas(initCanvas);

      initCanvas.on('object:moving', function (e) {
        handleObjectMoving(initCanvas, e.target, guidelines, setGuidelines);
      });

      initCanvas.on('object:modified', function () {
        clearGuidelines(initCanvas);
      });

      return () => {
        initCanvas.dispose();
      };
    }
  }, [canvasRef]);

  const handleFramesUpdate = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div className={className}>
      <CanvasCropping canvas={canvas} onFramesUpdate={handleFramesUpdate} />
      <CanvasToolbar canvas={canvas} canvasRef={canvasRef} />
      <canvas id="canvas" ref={canvasRef} />
      <CanvasObjectSettings canvas={canvas} />
      <CanvasSettings canvas={canvas} refreshKey={refreshKey} />
    </div>
  );
};
