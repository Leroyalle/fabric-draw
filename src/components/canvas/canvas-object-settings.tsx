import clsx from 'clsx';
import { Canvas, FabricObject } from 'fabric';
import React, { useEffect, useState } from 'react';
import {
  changeObjectColor,
  changeObjectDiameter,
  changeObjectHeight,
  changeObjectOpacity,
  changeObjectWidth,
  clearObjectSettings,
  onObjectSelection,
} from './lib';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface Props {
  canvas: Canvas | null;
  className?: string;
}

export const CanvasObjectSettings: React.FC<Props> = ({ canvas, className }) => {
  const [selectedObject, setSelectedObject] = useState<FabricObject | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [diameter, setDiameter] = useState(0);
  const [color, setColor] = useState<string>('');
  const [opacity, setOpacity] = useState(100);

  console.log(opacity);
  useEffect(() => {
    if (canvas) {
      canvas.on('selection:created', function (event) {
        handleObjectSelection(event.selected[0]);
      });

      canvas.on('selection:updated', function (event) {
        handleObjectSelection(event.selected[0]);
      });
      canvas.on('selection:cleared', function () {
        setSelectedObject(null);
        clearObjectSettings(setWidth, setHeight, setDiameter, setColor, setOpacity);
      });
      canvas.on('object:modified', function (event) {
        handleObjectSelection(event.target);
      });
      canvas.on('object:scaling', function (event) {
        handleObjectSelection(event.target);
      });
    }
  }, [canvas]);

  const handleObjectSelection = (object: FabricObject) => {
    onObjectSelection(
      object,
      setSelectedObject,
      setOpacity,
      setWidth,
      setHeight,
      setDiameter,
      setColor,
    );
  };

  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (canvas && selectedObject) changeObjectWidth(event, canvas, selectedObject, setWidth);
  };

  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (canvas && selectedObject) changeObjectHeight(event, canvas, selectedObject, setHeight);
  };

  const handleDiameterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (canvas && selectedObject) changeObjectDiameter(event, canvas, selectedObject, setDiameter);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (canvas && selectedObject) changeObjectColor(event, canvas, selectedObject, setColor);
  };

  const handleOpacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (canvas && selectedObject) changeObjectOpacity(event, canvas, selectedObject, setOpacity);
  };

  if (!selectedObject) {
    return null;
  }

  return (
    <div className={clsx('bg-gray-800 text-white p-2 rounded-xl flex flex-col gap-y-2', className)}>
      <h2 className="font-semibold">Object settings</h2>
      {selectedObject.type === 'rect' && (
        <>
          {/* <Input
            className="bg-white text-black p-2"
            type="number"
            value={width}
            onChange={handleWidthChange}
          /> */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="width">Width</Label>
            <Input
              className="bg-white text-black p-2"
              type="number"
              id="width"
              placeholder="Width"
              value={width}
              onChange={handleWidthChange}
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="height">Height</Label>
            <Input
              className="bg-white text-black p-2"
              type="number"
              id="height"
              placeholder="Height"
              value={height}
              onChange={handleHeightChange}
            />
          </div>
        </>
      )}
      {selectedObject.type === 'circle' && (
        <>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="diameter">Size</Label>
            <Input
              className="bg-white text-black p-2"
              type="number"
              id="diameter"
              placeholder="Size"
              value={diameter}
              onChange={handleDiameterChange}
            />
          </div>
        </>
      )}
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="color">Color</Label>
        <Input
          className="bg-white text-black p-2"
          id="color"
          placeholder="Color"
          value={color}
          type="color"
          onChange={handleColorChange}
        />
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="opacity">Opacity</Label>
        <Input
          className="bg-white text-black p-2"
          id="opacity"
          type="number"
          placeholder="100"
          value={opacity}
          onChange={handleOpacityChange}
        />
      </div>
    </div>
  );
};
