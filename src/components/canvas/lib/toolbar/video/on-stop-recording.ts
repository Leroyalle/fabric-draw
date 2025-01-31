import { Canvas } from 'fabric';
import { MutableRefObject } from 'react';

export const onStopRecording = (
  canvas: Canvas | null,
  mediaRecorderRef: MutableRefObject<MediaRecorder | null>,
  setIsRecording: (isRecording: boolean) => void,
  recordingIntervalRef: MutableRefObject<NodeJS.Timeout | null>,
) => {
  if (canvas && mediaRecorderRef.current) {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    canvas.getObjects().forEach((object) => {
      object.hasControls = true;
    });
    canvas?.renderAll();
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  }
};
