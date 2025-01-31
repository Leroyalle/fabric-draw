import { Canvas } from 'fabric';
import { RefObject } from 'react';

export const onClickPauseVideo = (
  canvas: Canvas | null,
  videoRef: RefObject<HTMLVideoElement>,
  setIsPlaying: (isPlaying: boolean) => void,
) => {
  if (videoRef.current) {
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setIsPlaying(false);
    canvas?.renderAll();
  }
};
