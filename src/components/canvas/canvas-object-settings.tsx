import { Input } from '../ui/input';
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
  const [opacity, setOpacity] = useState(1);

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
          <Input
            className="bg-white text-black p-2"
            type="number"
            value={width}
            onChange={handleWidthChange}
          />
          <Input
            className="bg-white text-black p-2"
            type="number"
            value={height}
            onChange={handleHeightChange}
          />
        </>
      )}
      {selectedObject.type === 'circle' && (
        <>
          <Input
            className="bg-white text-black p-2"
            type="number"
            placeholder="#FFFFFF"
            value={diameter}
            onChange={handleDiameterChange}
          />
        </>
      )}
      <Input value={color} type="color" onChange={handleColorChange} />
      <Input
        className="bg-white text-black p-2"
        type="number"
        placeholder="1"
        value={opacity}
        onChange={handleOpacityChange}
      />
    </div>
  );
};
