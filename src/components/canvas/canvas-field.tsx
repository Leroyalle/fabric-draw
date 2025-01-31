import { CanvasToolbar } from './canvas-toolbar';
import { CanvasObjectSettings } from './canvas-object-settings';
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Line } from 'fabric';
import { CanvasSettings } from './canvas-settings';
import { clearGuidelines, handleObjectMoving } from './lib';
import { LayersList } from '../layers';
import { CanvasCroppingSettings } from './canvas-cropping-settings';

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
      <div className="fixed top-1/2 left-4 -translate-y-1/2 max-w-[200px] z-10">
        <CanvasToolbar canvas={canvas} canvasRef={canvasRef} onFramesUpdate={handleFramesUpdate} />
      </div>
      <canvas id="canvas" ref={canvasRef} />
      <div className="flex flex-col gap-y-3 fixed right-4 top-1/2 -translate-y-1/2 max-w-[200px]">
        <CanvasObjectSettings canvas={canvas} />
        <CanvasSettings canvas={canvas} />
        <CanvasCroppingSettings canvas={canvas} refreshKey={refreshKey} />
        <LayersList canvas={canvas} />
      </div>
    </div>
  );
};
