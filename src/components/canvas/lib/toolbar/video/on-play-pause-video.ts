import { Canvas, FabricImage } from 'fabric';
import { RefObject } from 'react';

export const onPlayPauseVideo = (
  canvas: Canvas | null,
  videoRef: RefObject<HTMLVideoElement>,
  fabricVideo: FabricImage | null,
  setIsPlaying: (isPlaying: boolean) => void,
) => {
  if (canvas && videoRef.current && fabricVideo) {
    if (videoRef.current.paused) {
      const renderFrame = () => {
        if (!videoRef.current?.paused) {
          if (videoRef.current) fabricVideo.setElement(videoRef.current);
          canvas.requestRenderAll();
          requestAnimationFrame(renderFrame);
        }
      };
      videoRef.current.play();
      requestAnimationFrame(renderFrame);
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }
};
