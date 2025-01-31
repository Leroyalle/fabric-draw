import { Canvas, FabricObject } from 'fabric';

export const changeObjectColor = (
  event: React.ChangeEvent<HTMLInputElement>,
  canvas: Canvas,
  selectedObject: FabricObject,
  setColor: (color: string) => void,
) => {
  const value = event.target.value;
  setColor(value);

  if (selectedObject) {
    selectedObject.set({ fill: value });
    canvas?.requestRenderAll();
  }
};
