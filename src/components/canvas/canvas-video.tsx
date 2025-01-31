import { Canvas } from 'fabric';
import React, { ChangeEvent, useRef, useState } from 'react';
import { Image as FabricImage } from 'fabric';
import { Button } from '@chakra-ui/react';
import { Input } from '../ui/input';
import { StopCircle, VideoIcon } from 'lucide-react';
import {
  onClickPauseVideo,
  onExportVideo,
  onPlayPauseVideo,
  onStartRecording,
  onStopRecording,
  onVideoUpload,
} from './lib';

interface Props {
  canvas: Canvas | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const CanvasVideo: React.FC<Props> = ({ canvas, canvasRef }) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [fabricVideo, setFabricVideo] = useState<FabricImage | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadPercentage, setLoadPercentage] = useState(0);
  const [recordingChunks, setRecordingChunks] = useState<Blob[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onVideoUpload(
      canvas,
      file,
      setLoadPercentage,
      setVideoSrc,
      setUploadMessage,
      setFabricVideo,
      videoRef,
    );
  };

  const handlePlayPauseVideo = () => {
    onPlayPauseVideo(canvas, videoRef, fabricVideo, setIsPlaying);
  };

  const handlePauseVideo = () => {
    onClickPauseVideo(canvas, videoRef, setIsPlaying);
  };

  const handleVideoUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleStartRecording = () => {
    onStartRecording(
      canvas,
      canvasRef,
      mediaRecorderRef,
      setIsRecording,
      setRecordingTime,
      recordingIntervalRef,
      setRecordingChunks,
    );
  };

  const handleStopRecording = () => {
    onStopRecording(canvas, mediaRecorderRef, setIsRecording, recordingIntervalRef);
  };

  const handleExportVideo = () => {
    onExportVideo(recordingChunks, setRecordingChunks);
  };

  return (
    <>
      <Input
        ref={fileInputRef}
        className="hidden"
        accept="video/mp4"
        type="file"
        onChange={handleVideoUpload}
      />
      <Button onClick={handleVideoUploadClick}>
        <VideoIcon />
      </Button>
      {videoSrc && (
        <div className="flex flex-col">
          <Button onClick={handlePlayPauseVideo}>{isPlaying ? 'Пауза' : 'Воспроизвести'}</Button>
          <Button onClick={handlePauseVideo}>
            <StopCircle />
          </Button>
          <div className="bg-red-500 w-4 h-4" style={{ width: `${loadPercentage}` }} />
          {uploadMessage && <p>{uploadMessage}</p>}
          <Button onClick={isRecording ? handleStopRecording : handleStartRecording}>
            {isRecording ? <StopCircle /> : <VideoIcon />} {isRecording ? 'Остановить' : 'Запись'}{' '}
            {recordingTime} сек
          </Button>
          <Button onClick={handleExportVideo} disabled={!recordingChunks.length}>
            Export Video
          </Button>
        </div>
      )}
    </>
  );
};
