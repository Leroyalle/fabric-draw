import { Canvas } from 'fabric';
import { MutableRefObject, RefObject, SetStateAction } from 'react';

export const onStartRecording = (
  canvas: Canvas | null,
  canvasRef: RefObject<HTMLCanvasElement>,
  mediaRecorderRef: MutableRefObject<MediaRecorder | null>,
  setIsRecording: (isRecording: boolean) => void,
  setRecordingTime: (value: SetStateAction<number>) => void,
  recordingIntervalRef: MutableRefObject<NodeJS.Timeout | null>,
  setRecordingChunks: (value: SetStateAction<Blob[]>) => void,
) => {
  if (canvas && canvasRef.current) {
    const stream = canvasRef.current.captureStream();
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: 'video/webm; codecs=vp9',
    });
    mediaRecorderRef.current.ondataavailable = (e: BlobEvent) => {
      if (e.data.size > 0) {
        setRecordingChunks((prevChunks) => [...prevChunks, e.data]);
      }
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);

    canvas.getObjects().forEach((object) => {
      object.hasControls = false;
      object.selectable = true;
    });
    canvas.renderAll();
    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime((prevTime) => prevTime + 1);
    }, 1000);
  }
};
