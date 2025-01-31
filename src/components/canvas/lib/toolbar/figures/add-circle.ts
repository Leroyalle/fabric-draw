import { Canvas, Circle } from 'fabric';

export const addCircle = (canvas: Canvas | null) => {
  if (canvas) {
    const circle = new Circle({
      left: 200,
      top: 200,
      fill: '#7A00E6',
      radius: 50,
    });
    canvas.add(circle);
  }
};
