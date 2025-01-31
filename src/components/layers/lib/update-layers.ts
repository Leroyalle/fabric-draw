import { Canvas, FabricObject } from 'fabric';

export const updateLayers = (
  canvas: Canvas,
  setLayers: (layers: Pick<FabricObject, 'id' | 'zIndex' | 'type' | 'opacity'>[]) => void,
) => {
  canvas.updateZIndexes();
  const objects = canvas
    .getObjects()
    .filter(
      (obj) => !(obj.get('id').startsWith('horizontal-') || obj.get('id').startsWith('vertical-')),
    )
    .map((obj) => ({
      id: obj.id,
      zIndex: obj.zIndex,
      type: obj.type,
      opacity: obj.opacity,
    }));

  setLayers([...objects].reverse());
};
