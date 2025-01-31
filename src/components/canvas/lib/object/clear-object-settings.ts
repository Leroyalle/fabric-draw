export const clearObjectSettings = (
  setWidth: (width: number) => void,
  setHeight: (height: number) => void,
  setDiameter: (diameter: number) => void,
  setColor: (color: string) => void,
  setOpacity: (opacity: number) => void,
) => {
  setWidth(0);
  setHeight(0);
  setDiameter(0);
  setColor('');
  setOpacity(1);
};
