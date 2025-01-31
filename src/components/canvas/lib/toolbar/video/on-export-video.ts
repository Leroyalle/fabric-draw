import { SetStateAction } from 'react';

export const onExportVideo = (
  recordingChunks: Blob[],
  setRecordingChunks: (value: SetStateAction<Blob[]>) => void,
) => {
  const blob = new Blob(recordingChunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'video.webm';
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  setRecordingChunks([]);
};
