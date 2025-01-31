import { Canvas, FabricObject } from 'fabric';

export const deleteLayer = (canvas: Canvas, selectedLayer: FabricObject) => {
  const findObject = canvas.getObjects().find((obj) => obj.id === selectedLayer.id);
  if (!findObject) return undefined;
  canvas.remove(findObject);
  canvas.renderAll();
};
