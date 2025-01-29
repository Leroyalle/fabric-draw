import { Button } from '@chakra-ui/react';
import clsx from 'clsx';
import { Canvas, FabricObject, TEvent, TPointerEvent } from 'fabric';
import React, { useEffect, useState } from 'react';

interface Props {
  canvas: Canvas | null;
}

export const LayersList: React.FC<Props> = ({ canvas }) => {
  const [layers, setLayers] = useState<Pick<FabricObject, 'id' | 'zIndex' | 'type'>[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<FabricObject | null>(null);

  const addIdToObject = (object: FabricObject) => {
    if (!object.id) {
      const timestamp = new Date().getTime();
      object.id = `${object.type}-${timestamp}`;
    }
  };

  Canvas.prototype.updateZIndexes = function () {
    const objects = this.getObjects();
    objects.forEach((o, i) => {
      addIdToObject(o);
      o.zIndex = i;
    });
  };

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
        }));

      setLayers([...objects].reverse());
    }
  };

  const handleObjectSelect = (e: Partial<TEvent<TPointerEvent>> & { selected: FabricObject[] }) => {
    const targetObject = e.selected ? e.selected[0] : null;
    if (targetObject) {
      setSelectedLayer(targetObject);
    } else {
      setSelectedLayer(null);
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

  if (layers.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 text-white p-2 rounded-xl">
      <h2 className="font-semibold">Layers</h2>
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
