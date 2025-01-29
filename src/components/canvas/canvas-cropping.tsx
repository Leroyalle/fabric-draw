import { Button } from '@chakra-ui/react';
import { Canvas, FabricObject, Rect } from 'fabric';
import { CameraIcon } from 'lucide-react';
import React from 'react';

interface Props {
  canvas: Canvas | null;
  onFramesUpdate: () => void;
}

export const CanvasCropping: React.FC<Props> = ({ canvas, onFramesUpdate }) => {
  const addFrameToCanvas = () => {
    if (canvas) {
      const frameName = `Frame-${canvas.getObjects('rect').length + 1}`;

      const frame = new Rect({
        left: 100,
        top: 100,
        width: 200,
        height: 200,
        fill: 'transparent',
        stroke: '#07FE3D',
        strokeWidth: 1,
        selectable: true,
        evented: true,
        name: frameName,
      });

      canvas.add(frame);
      canvas.renderAll();

      const maintainStrokeWidth = (object: FabricObject) => {
        const scaleX = object.scaleX || 1;
        const scaleY = object.scaleY || 1;

        object.set({
          width: object.width * scaleX,
          height: object.height * scaleY,
          scaleX: 1,
          scaleY: 1,
          strokeWidth: 1,
        });

        object.setCoords();
      };

      frame.on('scaling', () => {
        maintainStrokeWidth(frame);
        canvas.renderAll();
      });
      frame.on('modified', () => {
        maintainStrokeWidth(frame);
        canvas.renderAll();
      });

      onFramesUpdate();
    }
  };
  return (
    <div>
      <Button colorScheme="teal" variant="subtle" onClick={addFrameToCanvas}>
        <CameraIcon />
      </Button>
    </div>
  );
};
