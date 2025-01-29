import { Canvas, FabricObject } from 'fabric';
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '@chakra-ui/react';

interface Props {
  canvas: Canvas | null;
  refreshKey: number;
  className?: string;
}

export const CanvasCroppingSettings: React.FC<Props> = ({ canvas, refreshKey, className }) => {
  const [frames, setFrames] = useState<FabricObject[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<FabricObject>();

  const updateFrames = () => {
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

  useEffect(() => {
    updateFrames();
  }, [canvas, refreshKey]);

  const handleFrameSelect = (name: string) => {
    if (canvas) {
      const selected = frames.find((obj) => obj.get('name') === name);
      setSelectedFrame(selected);
      if (selected) canvas.setActiveObject(selected);
      canvas.renderAll();
    }
  };

  const exportFrameAsPNG = () => {
    if (!selectedFrame) {
      return undefined;
    }

    if (canvas) {
      frames.forEach((frame) => {
        frame.set('visible', false);
      });

      selectedFrame.set({
        strokeWidth: 0,
        visible: true,
      });

      const dataUrl = canvas.toDataURL({
        left: selectedFrame.left,
        top: selectedFrame.top,
        width: selectedFrame.width * selectedFrame.scaleX,
        height: selectedFrame.height * selectedFrame.scaleY,
        format: 'png',
        multiplier: 1,
      });

      selectedFrame.set('visible', true);

      frames.forEach((frame) => {
        frame.set('visible', true);
      });

      canvas.renderAll();

      const a = document.createElement('a');
      a.download = `${selectedFrame.get('name')}.png`;
      a.href = dataUrl;
      a.click();
    }
  };

  return (
    <div className={className}>
      <Select value={selectedFrame?.get('name') || ''} onValueChange={handleFrameSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a frame" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {frames.map((frame) => (
              <SelectItem value={frame.get('name')}>{frame.get('name')}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button colorScheme="teal" onClick={exportFrameAsPNG}>
        Export frame
      </Button>
    </div>
  );
};
