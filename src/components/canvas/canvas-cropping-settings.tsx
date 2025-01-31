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
import { exportFrameAsPNG, updateFrames } from './lib';

interface Props {
  canvas: Canvas | null;
  refreshKey: number;
}

export const CanvasCroppingSettings: React.FC<Props> = ({ canvas, refreshKey }) => {
  const [frames, setFrames] = useState<FabricObject[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<FabricObject>();

  useEffect(() => {
    updateFrames(canvas, setFrames, setSelectedFrame);
  }, [canvas, refreshKey]);

  const handleFrameSelect = (name: string) => {
    if (canvas) {
      const selected = frames.find((obj) => obj.get('name') === name);
      setSelectedFrame(selected);
      if (selected) canvas.setActiveObject(selected);
      canvas.renderAll();
    }
  };

  return (
    <div className="p-2 rounded-xl bg-gray-800 text-white">
      <Select value={selectedFrame?.get('name') || ''} onValueChange={handleFrameSelect}>
        <SelectTrigger className="w-[180px] text-black">
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
      <Button
        disabled={!selectedFrame}
        colorScheme="teal"
        onClick={() => exportFrameAsPNG(canvas, selectedFrame, frames)}>
        Export frame
      </Button>
    </div>
  );
};
