import { Canvas, FabricObject } from 'fabric';

export const changeObjectWidth = (
  event: React.ChangeEvent<HTMLInputElement>,
  canvas: Canvas,
  selectedObject: FabricObject,
  setWidth: (width: number) => void,
) => {
  const value = event.target.value.replace(/,/g, '');
  const intValue = parseInt(value, 10);
  setWidth(intValue);

  if (selectedObject.type === 'rect' && intValue >= 0) {
    selectedObject.set({ width: intValue / selectedObject.scaleX });
    canvas.requestRenderAll();
  }
};
