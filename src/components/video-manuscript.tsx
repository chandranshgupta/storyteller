"use client";

import React, { useState, useEffect, useRef } from "react";
import type { Story } from "@/lib/stories";
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  PictureInPicture,
  RefreshCw,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { BookOpen, ArrowLeft } from "lucide-react";

interface VideoManuscriptProps {
  story: Story;
  onBegin: () => void;
  onBack: () => void;
}

export function VideoManuscript({ story, onBegin, onBack }: VideoManuscriptProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerWrapperRef = useRef<HTMLDivElement>(null);
  const videos = story.videos || [];
  const currentVideo = videos[currentVideoIndex];
  
  const startPlayback = () => {
    setShowOverlay(false);
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.play().catch(console.error);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.src = currentVideo.src;
        videoRef.current.load();
        if (!showOverlay) {
            videoRef.current.play().catch(console.error);
        }
    }
  }, [currentVideoIndex, showOverlay]);
  
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };
  
  const handleEnded = () => {
      const nextIndex = currentVideoIndex + 1;
      if (nextIndex < videos.length) {
          setCurrentVideoIndex(nextIndex);
      } else {
          // End of playlist
          setShowOverlay(true);
          setCurrentVideoIndex(0);
      }
  };

  const handleThumbnailClick = (index: number) => {
    if (showOverlay) setShowOverlay(false);
    setCurrentVideoIndex(index);
    if (videoRef.current) {
        videoRef.current.muted = false;
        setIsMuted(false);
    }
  }


  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updatePlayingState = () => setIsPlaying(!video.paused);
    const updateProgressState = () => {
        setProgress((video.currentTime / video.duration) * 100);
        setCurrentTime(video.currentTime);
        if (video.duration) {
            setDuration(video.duration);
        }
    };

    video.addEventListener('play', updatePlayingState);
    video.addEventListener('pause', updatePlayingState);
    video.addEventListener('timeupdate', updateProgressState);
    video.addEventListener('loadedmetadata', updateProgressState);
    video.addEventListener('ended', handleEnded);

    return () => {
        video.removeEventListener('play', updatePlayingState);
        video.removeEventListener('pause', updatePlayingState);
        video.removeEventListener('timeupdate', updateProgressState);
        video.removeEventListener('loadedmetadata', updateProgressState);
        video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const toggleFullscreen = () => {
    const player = playerWrapperRef.current;
    if (!player) return;

    if (!document.fullscreenElement) {
        player.requestFullscreen().catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
  };
  
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds === 0) return '00:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }


  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 bg-black text-white">
        <div ref={playerWrapperRef} className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center relative group/player">
            <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-20 text-white hover:bg-white/10" onClick={onBack}>
                <ArrowLeft />
                <span className="sr-only">Back to Celestial Map</span>
            </Button>

            <video ref={videoRef} className="w-full aspect-video" poster={currentVideo?.thumbnail} muted={isMuted} playsInline />
            
            {showOverlay && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 animate-fade-in">
                    <h1 className="text-4xl font-headline text-white mb-4">{story.title}</h1>
                    <p className="text-white/80 max-w-xl text-center mb-8">{story.summary}</p>
                    <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-black" onClick={startPlayback}>
                        <Play className="mr-2" />
                        Begin the Epic
                    </Button>
                </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover/player:opacity-100 transition-opacity duration-300">
                <div 
                    className="h-1 bg-white/20 cursor-pointer group/progress"
                    onClick={(e) => {
                        if (videoRef.current) {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const clickX = e.clientX - rect.left;
                            const width = rect.width;
                            videoRef.current.currentTime = (clickX / width) * duration;
                        }
                    }}
                >
                    <div className="h-full bg-primary group-hover/progress:h-2 transition-all" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-4">
                        <button onClick={handlePlayPause}>
                            {isPlaying ? <Pause /> : <Play />}
                        </button>
                        <div className="text-sm">
                            <span>{formatTime(currentTime)}</span> / <span>{formatTime(duration)}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleFullscreen}>
                            {document.fullscreenElement ? <Minimize /> : <Maximize />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="w-full max-w-4xl mt-4">
            <h3 className="text-lg font-headline text-white mb-2">{currentVideo?.title}</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
                {videos.map((video, index) => (
                    <div 
                        key={video.src} 
                        className={`flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 ${currentVideoIndex === index ? 'border-primary' : 'border-transparent'} transition-all`}
                        onClick={() => handleThumbnailClick(index)}
                    >
                        <img src={video.thumbnail} alt={video.title} className="w-32 h-20 object-cover" />
                    </div>
                ))}
            </div>
        </div>

        <Button onClick={onBegin} size="lg" variant="link" className="mt-4 text-white/70 hover:text-white">
            Read Full Story
            <BookOpen className="ml-2" />
        </Button>
        <style jsx>{`
            @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .animate-fade-in {
              animation: fade-in 0.5s ease-out forwards;
            }
        `}</style>
    </div>
  );
}
