import { Canvas, FabricObject } from 'fabric';

export const changeObjectOpacity = (
  event: React.ChangeEvent<HTMLInputElement>,
  canvas: Canvas,
  selectedObject: FabricObject,
  setOpacity: (opacity: number) => void,
) => {
  const value = event.target.value;
  const intValue = Number(value);
  setOpacity(intValue);

  if (selectedObject) {
    selectedObject.set({ opacity: value });
    canvas?.requestRenderAll();
  }
};
