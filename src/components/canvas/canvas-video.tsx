import { Canvas } from 'fabric';
import React, { ChangeEvent, useRef, useState } from 'react';
import { Image as FabricImage } from 'fabric';
import { Button, Input } from '@chakra-ui/react';
import { PauseIcon, PlayIcon, StopCircle, VideoIcon } from 'lucide-react';

interface Props {
  canvas: Canvas | null;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  className?: string;
}

export const CanvasVideo: React.FC<Props> = ({ canvas, canvasRef, className }) => {
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [fabricVideo, setFabricVideo] = useState<FabricImage | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadMessage, setUploadMessage] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadPercentage, setLoadPercentage] = useState(0);
  const [recordingChunks, setRecordingChunks] = useState([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        videoRef.current.addEventListener('pause', () => {
          if (videoRef.current) {
            fabricVideo?.setElement(videoRef.current);
            canvas?.renderAll();
          }
        });
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
          <Button onClick={handlePlayPauseVideo}>{isPlaying ? <PauseIcon /> : <PlayIcon />}</Button>
          <Button onClick={handlePauseVideo}>
            <StopCircle />
          </Button>
        </div>
      )}
    </>
  );
};
