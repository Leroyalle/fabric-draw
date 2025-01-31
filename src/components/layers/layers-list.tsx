import { Button } from '@chakra-ui/react';
import clsx from 'clsx';
import { Canvas, FabricObject, TEvent, TPointerEvent } from 'fabric';
import { ArrowBigDown, ArrowBigUp, Eye, EyeOff, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { addIdToObject, deleteLayer, hideSelectLayer, moveSelectLayer, updateLayers } from './lib';

interface Props {
  canvas: Canvas | null;
}

export const LayersList: React.FC<Props> = ({ canvas }) => {
  const [layers, setLayers] = useState<Pick<FabricObject, 'id' | 'zIndex' | 'type'>[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<FabricObject | null>(null);

  const handleDeleteLayer = () => {
    if (!selectedLayer) return undefined;
    if (canvas) {
      deleteLayer(canvas, selectedLayer);
      handleUpdateLayers();
    }
  };

  const handleHideSelectLayer = () => {
    if (!selectedLayer) return undefined;
    if (canvas) {
      hideSelectLayer(canvas, selectedLayer);
      handleUpdateLayers();
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
      canvas.on('object:added', handleUpdateLayers);
      canvas.on('object:removed', handleUpdateLayers);
      canvas.on('object:modified', handleUpdateLayers);

      canvas.on('selection:created', handleObjectSelect);
      canvas.on('selection:updated', handleObjectSelect);
      canvas.on('selection:cleared', () => setSelectedLayer(null));

      handleUpdateLayers();
      return () => {
        canvas.off('object:added', handleUpdateLayers);
        canvas.off('object:removed', handleUpdateLayers);
        canvas.off('object:modified', handleUpdateLayers);
        canvas.off('selection:created', handleObjectSelect);
        canvas.off('selection:updated', handleObjectSelect);
        canvas.off('selection:cleared', () => setSelectedLayer(null));
      };
    }
  }, [canvas]);

  const handleUpdateLayers = () => {
    if (canvas) {
      updateLayers(canvas, setLayers);
    }
  };

  const handleMoveSelectLayer = (direction: 'up' | 'down') => {
    if (!selectedLayer) return undefined;
    if (canvas) {
      const objects = canvas.getObjects();
      const object = objects.find((obj) => obj.id === selectedLayer.id);
      if (object) {
        moveSelectLayer(canvas, selectedLayer, setSelectedLayer, objects, object, direction);
        handleUpdateLayers();
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
    <div className="flex flex-col gap-y-3 bg-gray-800 text-white p-2 rounded-xl">
      <h2 className="font-semibold">Layers</h2>
      <div>
        {' '}
        <Button
          onClick={() => handleMoveSelectLayer('up')}
          disabled={!selectedLayer || layers[0].id === selectedLayer.id}>
          <ArrowBigUp />
        </Button>
        <Button
          onClick={() => handleMoveSelectLayer('down')}
          disabled={!selectedLayer || layers[layers.length - 1].id === selectedLayer.id}>
          <ArrowBigDown />
        </Button>
        <Button disabled={!selectedLayer} onClick={() => handleHideSelectLayer()}>
          {selectedLayer?.opacity === 0 ? <Eye /> : <EyeOff />}
        </Button>
        <Button disabled={!selectedLayer} onClick={() => handleDeleteLayer()}>
          <Trash />
        </Button>
      </div>
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
