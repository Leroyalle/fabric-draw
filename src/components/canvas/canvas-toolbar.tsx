import { Button } from '@chakra-ui/react';
import clsx from 'clsx';
import { Canvas } from 'fabric';
import { CircleIcon, SquareIcon } from 'lucide-react';
import React, { RefObject } from 'react';
import { CanvasVideo } from './canvas-video';
import { CanvasCropping } from './canvas-cropping';
import { addCircle, addRectangle } from './lib';

interface Props {
  canvas: Canvas | null;
  canvasRef: RefObject<HTMLCanvasElement>;
  onFramesUpdate: () => void;
  className?: string;
}

export const CanvasToolbar: React.FC<Props> = ({
  canvas,
  canvasRef,
  onFramesUpdate,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center bg-gray-800 text-white rounded-xl p-[1vh] h-full w-full',
        className,
      )}>
      <CanvasCropping canvas={canvas} onFramesUpdate={onFramesUpdate} />
      <Button colorScheme="teal" variant="subtle" onClick={() => addRectangle(canvas)}>
        <SquareIcon />
      </Button>
      <Button colorScheme="teal" variant="outline" onClick={() => addCircle(canvas)}>
        <CircleIcon />
      </Button>
      <CanvasVideo canvas={canvas} canvasRef={canvasRef} />
    </div>
  );
};
