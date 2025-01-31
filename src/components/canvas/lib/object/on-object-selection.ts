import { Circle, FabricObject, Rect } from 'fabric';

export const onObjectSelection = (
  object: FabricObject,
  setSelectedObject: (object: FabricObject) => void,
  setOpacity: (opacity: number) => void,
  setWidth: (width: number) => void,
  setHeight: (height: number) => void,
  setDiameter: (diameter: number) => void,
  setColor: (color: string) => void,
) => {
  if (!object) {
    return null;
  }
  setSelectedObject(object);
  setOpacity(object.opacity);

  if (object.type === 'rect') {
    const rect = object as Rect;
    setWidth(Math.round(rect.width * rect.scaleX));
    setHeight(Math.round(rect.height * rect.scaleY));
    setColor(rect.fill?.toString() || '');
  } else if (object.type === 'circle') {
    const circle = object as Circle;
    setDiameter(Math.round((circle.radius || 0) * 2 * circle.scaleX));
    setColor(circle.fill?.toString() || '');
    setWidth(0);
    setHeight(0);
  }
};
