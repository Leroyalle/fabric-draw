import { Canvas, FabricObject } from 'fabric';

export const moveSelectLayer = (
  canvas: Canvas,
  selectedLayer: FabricObject,
  setSelectedLayer: (layer: FabricObject) => void,
  objects: FabricObject[],
  object: FabricObject,
  direction: 'up' | 'down',
) => {
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
};
