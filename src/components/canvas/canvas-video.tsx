import { Canvas } from 'fabric';
import React, { ChangeEvent, useRef, useState } from 'react';
import { Image as FabricImage } from 'fabric';
import { Button } from '@chakra-ui/react';
import { Input } from '../ui/input';
import { StopCircle, VideoIcon } from 'lucide-react';

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
          console.log(uploadMessage);
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

  const handlePlayPauseVideo = () => {
    if (videoRef.current && fabricVideo) {
      if (videoRef.current.paused) {
        const renderFrame = () => {
          if (!videoRef.current?.paused) {
            if (videoRef.current) fabricVideo.setElement(videoRef.current);
            canvas?.requestRenderAll();
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

  const handlePauseVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
      canvas?.renderAll();
    }
  };
  const handleVideoUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleStartRecording = () => {
    if (canvasRef.current) {
      const stream = canvasRef.current.captureStream();
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp9',
      });
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.start();
      setIsRecording(true);

      canvas?.getObjects().forEach((object) => {
        object.hasControls = false;
        object.selectable = true;
      });
      canvas?.renderAll();
      setRecordingTime(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      canvas?.getObjects().forEach((object) => {
        object.hasControls = true;
      });
      canvas?.renderAll();
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const handleDataAvailable = (e: BlobEvent) => {
    if (e.data.size > 0) {
      setRecordingChunks((prevChunks) => [...prevChunks, e.data]);
    }
  };

  const handleExportVideo = () => {
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
