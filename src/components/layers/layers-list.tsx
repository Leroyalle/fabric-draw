import { Button } from '@chakra-ui/react';
import clsx from 'clsx';
import { Canvas, FabricObject, TEvent, TPointerEvent } from 'fabric';
import { ArrowBigDown, ArrowBigUp, Eye, EyeOff } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface Props {
  canvas: Canvas | null;
}

export const LayersList: React.FC<Props> = ({ canvas }) => {
  const [layers, setLayers] = useState<Pick<FabricObject, 'id' | 'zIndex' | 'type'>[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<FabricObject | null>(null);

  const hideSelectLayer = () => {
    if (!selectedLayer) {
      return undefined;
    }

    const object = canvas?.getObjects().find((obj) => obj.id === selectedLayer.id);
    if (!object) return undefined;

    if (canvas) {
      const objects = canvas.getObjects();
      const findObject = objects.find((obj) => obj.id === selectedLayer.id);
      if (!findObject) return undefined;
      if (findObject.get('opacity') === 0) {
        findObject.set({ opacity: 1 });
      } else {
        findObject.set({ opacity: 0 });
      }
      canvas.renderAll();
      updateLayers();
    }
  };

  const addIdToObject = (object: FabricObject) => {
    if (!object.id) {
      const timestamp = new Date().getTime();
      object.id = `${object.type}-${timestamp}`;
    }
  };

  Canvas.prototype.updateZIndexes = function () {
    const objects = this.getObjects();
    objects.forEach((obj, index) => {
      addIdToObject(obj);
      obj.zIndex = index;
    });
  };

  const handleObjectSelect = (e: Partial<TEvent<TPointerEvent>> & { selected: FabricObject[] }) => {
    const targetObject = e.selected ? e.selected[0] : null;
    if (targetObject) {
      setSelectedLayer(targetObject);
    } else {
      setSelectedLayer(null);
    }
  };

  useEffect(() => {
    if (canvas) {
      canvas.on('object:added', updateLayers);
      canvas.on('object:removed', updateLayers);
      canvas.on('object:modified', updateLayers);

      canvas.on('selection:created', handleObjectSelect);
      canvas.on('selection:updated', handleObjectSelect);
      canvas.on('selection:cleared', () => setSelectedLayer(null));

      updateLayers();
      return () => {
        canvas.off('object:added', updateLayers);
        canvas.off('object:removed', updateLayers);
        canvas.off('object:modified', updateLayers);
        canvas.off('selection:created', handleObjectSelect);
        canvas.off('selection:updated', handleObjectSelect);
        canvas.off('selection:cleared', () => setSelectedLayer(null));
      };
    }
  }, [canvas]);

  const updateLayers = () => {
    if (canvas) {
      canvas.updateZIndexes();
      const objects = canvas
        .getObjects()
        .filter(
          (obj) =>
            !(obj.get('id').startsWith('horizontal-') || obj.get('id').startsWith('vertical-')),
        )
        .map((obj) => ({
          id: obj.id,
          zIndex: obj.zIndex,
          type: obj.type,
          opacity: obj.opacity,
        }));

      setLayers([...objects].reverse());
    }
  };

  const moveSelectLayer = (direction: 'up' | 'down') => {
    if (!selectedLayer) {
      return undefined;
    }

    if (canvas) {
      const objects = canvas.getObjects();
      const object = objects.find((obj) => obj.id === selectedLayer.id);

      if (object) {
        const currentIndex = objects.indexOf(object);

        if (direction === 'up' && currentIndex < objects.length - 1) {
          const temp = objects[currentIndex];
          objects[currentIndex] = objects[currentIndex + 1];
          objects[currentIndex + 1] = temp;
        } else if (direction === 'down' && currentIndex > 0) {
          const temp = objects[currentIndex];
          objects[currentIndex] = objects[currentIndex - 1];
          objects[currentIndex - 1] = temp;
        }

        const bgColor = canvas.backgroundColor;
        canvas.clear();
        objects.forEach((obj) => canvas.add(obj));
        canvas.backgroundColor = bgColor;
        canvas.renderAll();
        setSelectedLayer(object);
        canvas.setActiveObject(selectedLayer);
        updateLayers();
      }
    }
  };

  const selectLayerOnCanvas = (layerId: string) => {
    if (canvas) {
      const object = canvas.getObjects().find((obj) => obj.id === layerId);
      if (object) {
        canvas.setActiveObject(object);
        canvas.renderAll();
      }
    }
  };

  if (layers.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 text-white p-2 rounded-xl">
      <h2 className="font-semibold">Layers</h2>
      <Button
        onClick={() => moveSelectLayer('up')}
        disabled={!selectedLayer || layers[0].id === selectedLayer.id}>
        <ArrowBigUp />
      </Button>
      <Button
        onClick={() => moveSelectLayer('down')}
        disabled={!selectedLayer || layers[layers.length - 1].id === selectedLayer.id}>
        <ArrowBigDown />
      </Button>
      <Button onClick={() => hideSelectLayer()}>
        {selectedLayer?.opacity === 0 ? <Eye /> : <EyeOff />}
      </Button>
      <ul>
        {layers.map((layer) => (
          <li key={layer.id}>
            <Button
              variant={'solid'}
              className={clsx(
                'w-full',
                selectedLayer?.get('id') === layer.id && 'bg-gray-200 text-black',
              )}
              onClick={() => selectLayerOnCanvas(layer.id)}>
              {layer.type} {layer.zIndex}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
