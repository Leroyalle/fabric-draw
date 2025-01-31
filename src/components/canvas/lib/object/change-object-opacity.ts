import { Canvas, FabricObject } from 'fabric';

export const changeObjectOpacity = (
  event: React.ChangeEvent<HTMLInputElement>,
  canvas: Canvas,
  selectedObject: FabricObject,
  setOpacity: (opacity: number) => void,
) => {
  const value = event.target.value;
  const intValue = Number(value) > 100 ? 100 : Number(value);
  setOpacity(intValue);
  selectedObject.set({ opacity: intValue * 0.01 });
  canvas.requestRenderAll();
};
