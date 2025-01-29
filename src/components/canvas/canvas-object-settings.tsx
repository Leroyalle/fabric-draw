import { Input } from '@chakra-ui/react';
import clsx from 'clsx';
import { Canvas, FabricObject, Circle, Rect } from 'fabric';
import React, { useEffect, useState } from 'react';
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
        clearSettings();
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
    if (!object) {
      return null;
    }
    setSelectedObject(object);

    if (object.type === 'rect') {
      const rect = object as Rect;
      setWidth(Math.round(rect.width * rect.scaleX));
      setHeight(Math.round(rect.height * rect.scaleY));
      setColor(rect.fill?.toString() || '');
    } else if (object.type === 'circle') {
      const circle = object as Circle;
      setDiameter(Math.round((circle.radius || 0) * 2 * circle.scaleX));
      setColor(circle.fill?.toString() || '');
      setWidth(0);
      setHeight(0);
    }
  };
  console.log(selectedObject);
  const clearSettings = () => {
    setWidth(0);
    setHeight(0);
    setDiameter(0);
    setColor('');
  };

  const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/,/g, '');
    const intValue = parseInt(value, 10);
    setWidth(intValue);

    if (selectedObject?.type === 'rect' && intValue >= 0) {
      selectedObject.set({ width: intValue / selectedObject.scaleX });
      canvas?.requestRenderAll();
    }
  };
  const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/,/g, '');
    const intValue = parseInt(value, 10);

    setHeight(intValue);
    if (selectedObject?.type === 'rect' && intValue >= 0) {
      selectedObject.set({ height: intValue / selectedObject.scaleY });
      canvas?.requestRenderAll();
    }
  };
  const handleDiameterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/,/g, '');
    const intValue = parseInt(value, 10);

    setDiameter(intValue);

    if (selectedObject?.type === 'circle' && intValue >= 0) {
      selectedObject.set({ radius: intValue / 2 / selectedObject.scaleY });
      canvas?.requestRenderAll();
    }
  };
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setColor(value);

    if (selectedObject) {
      selectedObject.set({ fill: value });
      canvas?.requestRenderAll();
    }
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
            value={diameter}
            onChange={handleDiameterChange}
          />
        </>
      )}
      <Input value={color} type="color" onChange={handleColorChange} />
    </div>
  );
};
