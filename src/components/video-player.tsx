
"use client";

import { useState, useRef, useEffect } from "react";
import type { Story, VideoChapter } from "@/lib/stories";
import { Button } from "./ui/button";
import { ArrowLeft, BookOpen, Fullscreen, Play, Pause } from "lucide-react";
import { Slider } from "./ui/slider";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  story: Story;
  onBeginStory: () => void;
  onBack: () => void;
}

export function VideoPlayer({ story, onBeginStory, onBack }: VideoPlayerProps) {
  const [currentVideo, setCurrentVideo] = useState(story.videos?.[0] ?? null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSelectVideo = (video: VideoChapter) => {
    setCurrentVideo(video);
    setIsPlaying(true); // Auto-play new video
  };

  const formatTime = (seconds: number) => {
    const date = new Date(0);
    date.setSeconds(seconds || 0);
    return date.toISOString().substr(14, 5);
  };
  
  if (!isClient) {
      return null;
  }

  return (
    <div className="w-full h-full flex flex-col bg-black text-white animate-fade-in relative">
        <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-20 hover:bg-white/10" onClick={onBack}>
            <ArrowLeft />
            <span className="sr-only">Back to Celestial Map</span>
        </Button>

        <div className="flex-1 flex items-center justify-center bg-black relative">
            {currentVideo ? (
                <iframe
                    ref={iframeRef}
                    key={currentVideo.url}
                    width="100%"
                    height="100%"
                    src={`${currentVideo.url}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0`}
                    title={currentVideo.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0"
                ></iframe>
            ) : (
                <div className="text-center">Select a video to play.</div>
            )}
        </div>

        <div className="relative z-10 p-4 sm:p-6 space-y-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
            {/* Player Controls - Simplified as youtube controls are used from iframe */}
            <div className="flex items-center gap-4 text-sm">
                <p>{formatTime(progress)} / {formatTime(duration)}</p>
            </div>

            <h2 className="text-2xl font-headline text-center">{currentVideo?.title}</h2>
            
            <div className="w-full overflow-x-auto pb-4">
                <div className="flex space-x-4">
                {story.videos?.map((video) => (
                    <button
                        key={video.url}
                        onClick={() => handleSelectVideo(video)}
                        className={cn(
                            "text-left p-2 rounded-lg transition-colors duration-200 w-40 flex-shrink-0",
                            currentVideo?.url === video.url
                            ? "bg-primary/80 border border-primary-foreground/50"
                            : "bg-white/10 hover:bg-white/20"
                        )}
                    >
                        <p className="font-semibold truncate">{video.title}</p>
                    </button>
                ))}
                </div>
            </div>
            
            <div className="border-t border-white/20 my-2"></div>

            <div className="text-center">
                <Button variant="link" onClick={onBeginStory} className="text-white/80 hover:text-white">
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
