import { Input } from '../ui/input';
import clsx from 'clsx';
import { Canvas } from 'fabric';
import React, { useEffect, useState } from 'react';
import { Label } from '../ui/label';

interface Props {
  canvas: Canvas | null;
  className?: string;
}

export const CanvasSettings: React.FC<Props> = ({ canvas, className }) => {
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
    <div className={clsx('flex bg-gray-800 text-white flex-col gap-y-2 p-2 rounded-xl', className)}>
      <h2 className="font-semibold">Canvas settings</h2>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="width">Width</Label>
        <Input
          className="bg-white text-black p-2"
          id="width"
          placeholder="Width"
          type="number"
          value={width}
          onChange={handleChangeWidth}
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="height">Height</Label>
        <Input
          className="bg-white text-black p-2"
          id="height"
          placeholder="Height"
          type="number"
          value={height}
          onChange={handleChangeHeight}
        />
      </div>
    </div>
  );
};
