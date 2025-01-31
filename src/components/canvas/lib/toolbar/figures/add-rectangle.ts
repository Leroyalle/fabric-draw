import { Canvas, Rect } from 'fabric';

export const addRectangle = (canvas: Canvas | null) => {
  if (canvas) {
    const rect = new Rect({
      left: 200,
      top: 200,
      fill: '#2ECC71',
      width: 150,
      height: 80,
    });
    canvas.add(rect);
  }
};
