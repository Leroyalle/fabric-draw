import { Canvas, FabricObject } from 'fabric';

export const updateFrames = (
  canvas: Canvas | null,
  setFrames: (frames: FabricObject[]) => void,
  setSelectedFrame: (frame: FabricObject) => void,
) => {
  if (canvas) {
    const framesFromCanvas = canvas
      .getObjects('rect')
      .filter((obj) => obj.get('name') && obj.get('name').startsWith('Frame-'));
    setFrames(framesFromCanvas);

    if (framesFromCanvas.length > 0) {
      setSelectedFrame(framesFromCanvas[0]);
    }
  }
};
