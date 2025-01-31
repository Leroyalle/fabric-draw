import { Canvas, FabricObject } from 'fabric';

export const hideSelectLayer = (canvas: Canvas, selectedLayer: FabricObject) => {
  const findObject = canvas.getObjects().find((obj) => obj.id === selectedLayer.id);
  if (!findObject) return undefined;
  if (findObject.get('opacity') === 0) {
    findObject.set({ opacity: 1 });
  } else {
    findObject.set({ opacity: 0 });
  }
  canvas.renderAll();
};
