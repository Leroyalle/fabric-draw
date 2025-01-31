import { Button } from '@chakra-ui/react';
import { Canvas } from 'fabric';
import { CameraIcon } from 'lucide-react';
import React from 'react';
import { addFrameToCanvas } from './lib';

interface Props {
  canvas: Canvas | null;
  onFramesUpdate: () => void;
}

export const CanvasCropping: React.FC<Props> = ({ canvas, onFramesUpdate }) => {
  const handleAddFrameToCanvas = () => {
    if (canvas) {
      addFrameToCanvas(canvas);
      onFramesUpdate();
    }
  };
  return (
    <div>
      <Button colorScheme="teal" variant="subtle" onClick={handleAddFrameToCanvas}>
        <CameraIcon />
      </Button>
    </div>
  );
};
