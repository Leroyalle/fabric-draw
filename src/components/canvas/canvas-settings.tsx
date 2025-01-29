import { Input } from '@chakra-ui/react';
import clsx from 'clsx';
import { Canvas } from 'fabric';
import React, { useEffect, useState } from 'react';
import { CanvasCroppingSettings } from './canvas-cropping-settings';

interface Props {
  canvas: Canvas | null;
  refreshKey: number;
  className?: string;
}

export const CanvasSettings: React.FC<Props> = ({ canvas, refreshKey, className }) => {
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);

  useEffect(() => {
    if (canvas) {
      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.renderAll();
    }
  }, [canvas, width, height]);

  const handleChangeWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    const intValue = parseInt(value, 10);
    setWidth(intValue);
  };

  const handleChangeHeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    const intValue = parseInt(value, 10);
    setHeight(intValue);
  };

  return (
    <div
      className={clsx(
        'flex flex-col gap-y-2 fixed left-1/2 bottom-4 -translate-x-1/2 max-w-[200px] bg-gray-100 p-2 rounded-xl',
        className,
      )}>
      <h2 className="font-semibold">Canvas settings</h2>
      <Input type="number" value={width} onChange={handleChangeWidth} />
      <Input type="number" value={height} onChange={handleChangeHeight} />
      <CanvasCroppingSettings canvas={canvas} refreshKey={refreshKey} />
    </div>
  );
};
