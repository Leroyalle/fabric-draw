import { Button } from '@chakra-ui/react';
import clsx from 'clsx';
import { Canvas, Circle, Rect } from 'fabric';
import { CircleIcon, SquareIcon } from 'lucide-react';
import React, { RefObject } from 'react';
import { CanvasVideo } from './canvas-video';

interface Props {
  canvas: Canvas | null;
  canvasRef: RefObject<HTMLCanvasElement>;
  className?: string;
}

export const CanvasToolbar: React.FC<Props> = ({ canvas, canvasRef, className }) => {
  const addRectangle = () => {
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

  const addCircle = () => {
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

  return (
    <div className={clsx('fixed top-1/2 left-4 -translate-y-1/2 flex flex-col', className)}>
      <Button colorScheme="teal" variant="subtle" onClick={addRectangle}>
        <SquareIcon />
      </Button>
      <Button colorScheme="teal" variant="outline" onClick={addCircle}>
        <CircleIcon />
      </Button>
      <CanvasVideo canvas={canvas} canvasRef={canvasRef} />
    </div>
  );
};
