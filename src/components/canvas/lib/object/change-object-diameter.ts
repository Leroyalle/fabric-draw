import { Canvas, FabricObject } from 'fabric';

export const changeObjectDiameter = (
  event: React.ChangeEvent<HTMLInputElement>,
  canvas: Canvas,
  selectedObject: FabricObject,
  setDiameter: (diameter: number) => void,
) => {
  const value = event.target.value.replace(/,/g, '');
  const intValue = parseInt(value, 10);
  setDiameter(intValue);

  if (selectedObject?.type === 'circle' && intValue >= 0) {
    selectedObject.set({ radius: intValue / 2 / selectedObject.scaleY });
    canvas?.requestRenderAll();
  }
};
