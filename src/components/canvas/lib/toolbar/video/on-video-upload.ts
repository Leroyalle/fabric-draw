import { Canvas, FabricImage } from 'fabric';
import { MutableRefObject } from 'react';

export const onVideoUpload = (
  canvas: Canvas | null,
  file: File | undefined,
  setLoadPercentage: (value: number) => void,
  setVideoSrc: (value: string | null) => void,
  setUploadMessage: (value: string) => void,
  setFabricVideo: (fabricVideo: FabricImage) => void,
  videoRef: MutableRefObject<HTMLVideoElement | null>,
) => {
  if (file) {
    setLoadPercentage(0);
    setVideoSrc(null);
    setUploadMessage('');
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    const createdVideo = document.createElement('video');
    createdVideo.src = url;
    createdVideo.crossOrigin = 'anonymous';
    createdVideo.addEventListener('loadeddata', () => {
      const videoWidth = createdVideo.videoWidth;
      const videoHeight = createdVideo.videoHeight;
      createdVideo.width = videoWidth;
      createdVideo.height = videoHeight;
      const scale = Math.min(createdVideo.width / videoWidth, createdVideo.height / videoHeight);
      if (canvas) {
        canvas.renderAll();
        const fabricImage = new FabricImage(createdVideo, {
          top: 0,
          left: 0,
          scaleX: scale,
          scaleY: scale,
        });
        setFabricVideo(fabricImage);
        canvas.add(fabricImage);
        canvas.renderAll();
        setUploadMessage('Video uploaded successfully');
        setTimeout(() => {
          setUploadMessage('');
        }, 2000);
      }
    });
    createdVideo.addEventListener('progress', () => {
      if (createdVideo.buffered.length > 0) {
        const bufferedEnd = createdVideo.buffered.end(createdVideo.buffered.length - 1);
        const duration = createdVideo.duration;
        if (duration > 0) {
          setLoadPercentage((bufferedEnd / duration) * 100);
        }
      }
    });
    createdVideo.addEventListener('error', (error) => {
      console.log('Error [createdVideo]', error);
      setUploadMessage('Error uploading video');
      setTimeout(() => {
        setUploadMessage('');
      }, 2000);
    });
    console.log(createdVideo);
    videoRef.current = createdVideo;
  }
};
