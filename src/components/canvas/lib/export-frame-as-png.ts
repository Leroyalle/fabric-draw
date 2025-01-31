import { Canvas, FabricObject } from 'fabric';

export const exportFrameAsPNG = (
  canvas: Canvas | null,
  selectedFrame: FabricObject | undefined,
  frames: FabricObject[],
) => {
  if (!selectedFrame) {
    return undefined;
  }

  if (canvas) {
    frames.forEach((frame) => {
      frame.set('visible', false);
    });

    selectedFrame.set({
      strokeWidth: 0,
      visible: true,
    });

    const dataUrl = canvas.toDataURL({
      left: selectedFrame.left,
      top: selectedFrame.top,
      width: selectedFrame.width * selectedFrame.scaleX,
      height: selectedFrame.height * selectedFrame.scaleY,
      format: 'png',
      multiplier: 1,
    });

    selectedFrame.set('visible', true);

    frames.forEach((frame) => {
      frame.set('visible', true);
    });

    canvas.renderAll();

    const a = document.createElement('a');
    a.download = `${selectedFrame.get('name')}.png`;
    a.href = dataUrl;
    a.click();
  }
};
