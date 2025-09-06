
"use client";

import { useState, useRef, useEffect } from "react";
import type { Story, VideoChapter } from "@/lib/stories";
import { Button } from "./ui/button";
import { ArrowLeft, BookOpen, Fullscreen, Play, Pause, Volume2, VolumeX, Settings } from "lucide-react";
import { Slider } from "./ui/slider";
import { cn } from "@/lib/utils";
import YouTube from 'react-youtube';
import type { YouTubePlayer } from 'react-youtube';
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface VideoPlayerProps {
  story: Story;
  onBeginStory: () => void;
  onBack: () => void;
}

export function VideoPlayer({ story, onBeginStory, onBack }: VideoPlayerProps) {
  const [currentVideo, setCurrentVideo] = useState(story.videos?.[0] ?? null);
  const [isPlaying, setIsPlaying] = useState(true); // Autoplay on load
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  
  const playerRef = useRef<YouTubePlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout>();
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const getYouTubeVideoId = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1);
      }
      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v');
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  const videoId = currentVideo ? getYouTubeVideoId(currentVideo.url) : null;

  const updateProgress = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      const videoDuration = playerRef.current.getDuration();
      setProgress(currentTime);
      setDuration(videoDuration);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(updateProgress, 1000);
    } else {
      clearInterval(progressIntervalRef.current);
    }
    return () => clearInterval(progressIntervalRef.current);
  }, [isPlaying]);

  const handleSelectVideo = (video: VideoChapter) => {
    setCurrentVideo(video);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (playerRef.current) {
      isPlaying ? playerRef.current.pauseVideo() : playerRef.current.playVideo();
    }
  };

  const handlePlayerStateChange = (event: { data: number }) => {
    // -1: unstarted, 0: ended, 1: playing, 2: paused, 3: buffering, 5: cued
    if (event.data === 1) { // Playing
      setIsPlaying(true);
    } else { // Paused, ended, etc.
      setIsPlaying(false);
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    setProgress(newTime);
    playerRef.current?.seekTo(newTime, true);
  };
  
  const toggleMute = () => {
    if (playerRef.current) {
      isMuted ? playerRef.current.unMute() : playerRef.current.mute();
      setIsMuted(!isMuted);
    }
  };
  
  const handlePlaybackRateChange = (rate: number) => {
    playerRef.current?.setPlaybackRate(rate);
    setPlaybackRate(rate);
  };

  const toggleFullScreen = () => {
    containerRef.current?.requestFullscreen();
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds || 0);
    return date.toISOString().substr(14, 5);
  };
  
  const onPlayerReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target;
    playerRef.current.setPlaybackRate(playbackRate);
    if(isMuted) playerRef.current.mute();
    updateProgress();
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex flex-col bg-black text-white animate-fade-in relative group/player"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
        <div className="absolute top-4 left-4 z-20">
          <Button variant="ghost" size="icon" className={cn("hover:bg-white/10 transition-opacity duration-300", showControls ? 'opacity-100' : 'opacity-0')} onClick={onBack}>
              <ArrowLeft />
              <span className="sr-only">Back to Celestial Map</span>
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center bg-black relative" onClick={togglePlay}>
            {videoId ? (
              <YouTube
                videoId={videoId}
                opts={{
                  height: '100%',
                  width: '100%',
                  playerVars: {
                    autoplay: 1,
                    controls: 0,
                    rel: 0,
                    showinfo: 0,
                    modestbranding: 1,
                    iv_load_policy: 3,
                    fs: 0,
                  },
                }}
                className="absolute inset-0 w-full h-full"
                onReady={onPlayerReady}
                onStateChange={handlePlayerStateChange}
                onEnd={() => setIsPlaying(false)}
              />
            ) : (
                <div className="text-center">Select a video to play.</div>
            )}
        </div>

        <div className={cn("absolute bottom-0 left-0 right-0 z-10 p-2 sm:p-4 space-y-2 bg-gradient-to-t from-black/80 via-black/60 to-transparent transition-opacity duration-300", showControls ? "opacity-100" : "opacity-0 group-hover/player:opacity-100")}>
            <Slider
                value={[progress]}
                max={duration}
                step={1}
                onValueChange={handleSeek}
                className="w-full h-2 cursor-pointer"
            />
            <div className="flex items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="hover:bg-white/10" onClick={togglePlay}>
                        {isPlaying ? <Pause /> : <Play />}
                    </Button>
                     <Button variant="ghost" size="icon" className="hover:bg-white/10" onClick={toggleMute}>
                        {isMuted ? <VolumeX /> : <Volume2 />}
                    </Button>
                    <p className="w-20">{formatTime(progress)} / {formatTime(duration)}</p>
                </div>
                <h2 className="text-sm sm:text-lg font-headline text-center flex-1 truncate px-4">{currentVideo?.title}</h2>
                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-white/10">
                                <Settings />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-32 bg-black/80 border-white/20 text-white">
                            <h4 className="text-sm font-bold mb-2">Speed</h4>
                            {[0.5, 1, 1.5, 2].map(rate => (
                                <button key={rate} onClick={() => handlePlaybackRateChange(rate)} className={cn("block w-full text-left p-1 rounded hover:bg-white/20", playbackRate === rate && 'font-bold text-primary-foreground')}>
                                    {rate}x
                                </button>
                            ))}
                        </PopoverContent>
                    </Popover>
                    <Button variant="ghost" size="icon" className="hover:bg-white/10" onClick={toggleFullScreen}>
                        <Fullscreen />
                    </Button>
                </div>
            </div>

            <div className="w-full overflow-x-auto pb-2">
                <div className="flex space-x-2">
                {story.videos?.map((video) => (
                    <button
                        key={video.url}
                        onClick={() => handleSelectVideo(video)}
                        className={cn(
                            "text-left p-2 rounded-lg transition-colors duration-200 w-32 flex-shrink-0",
                            currentVideo?.url === video.url
                            ? "bg-primary/80 border border-primary-foreground/50"
                            : "bg-white/10 hover:bg-white/20"
                        )}
                    >
                        <p className="font-semibold truncate text-xs">{video.title}</p>
                    </button>
                ))}
                </div>
            </div>
            
            <div className="border-t border-white/20 my-1"></div>

            <div className="text-center">
                <Button variant="link" onClick={onBeginStory} className="text-white/80 hover:text-white text-sm">
                    Read Full Story
                    <BookOpen className="ml-2 w-4 h-4" />
                </Button>
            </div>
        </div>
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
