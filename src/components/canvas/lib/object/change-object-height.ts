import { Canvas, FabricObject } from 'fabric';

export const changeObjectHeight = (
  event: React.ChangeEvent<HTMLInputElement>,
  canvas: Canvas,
  selectedObject: FabricObject,
  setHeight: (height: number) => void,
) => {
  const value = event.target.value.replace(/,/g, '');
  const intValue = parseInt(value, 10);
  setHeight(intValue);

  if (selectedObject?.type === 'rect' && intValue >= 0) {
    selectedObject.set({ height: intValue / selectedObject.scaleY });
    canvas?.requestRenderAll();
  }
};
