"use client";

import React, { useState, useRef } from "react";
import type { Story } from "@/lib/stories";
import YouTube, { YouTubeProps } from 'react-youtube';
import { Button } from "./ui/button";
import { BookOpen, ArrowLeft } from "lucide-react";
import Image from "next/image";

interface VideoManuscriptProps {
  story: Story;
  onBegin: () => void;
  onBack: () => void;
}

export function VideoManuscript({ story, onBegin, onBack }: VideoManuscriptProps) {
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(story.videos?.[0].youtubeId || null);
  const [player, setPlayer] = useState<any | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  
  const videos = story.videos || [];
  const currentVideoIndex = videos.findIndex(v => v.youtubeId === currentVideoId);
  const currentVideo = videos[currentVideoIndex];

  const handleThumbnailClick = (youtubeId: string) => {
    setCurrentVideoId(youtubeId);
    if (showOverlay) {
      setShowOverlay(false);
    }
  };

  const handlePlayerReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target);
    // Don't play until user interaction
  };

  const handlePlayerStateChange: YouTubeProps['onStateChange'] = (event) => {
    if (event.data === 0) { // 0 = ended
      const nextIndex = currentVideoIndex + 1;
      if (nextIndex < videos.length) {
        setCurrentVideoId(videos[nextIndex].youtubeId);
      } else {
        // Loop back to the first video or show overlay
        setCurrentVideoId(videos[0].youtubeId);
        setShowOverlay(true);
      }
    }
  };
  
  const startPlayback = () => {
    setShowOverlay(false);
    if(player) {
      player.playVideo();
    }
  };
  
  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      rel: 0, // Don't show related videos
      showinfo: 0,
      modestbranding: 1
    },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 bg-black text-white">
        <div className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center relative group/player">
            <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-20 text-white hover:bg-white/10" onClick={onBack}>
                <ArrowLeft />
                <span className="sr-only">Back to Celestial Map</span>
            </Button>

            <div className="w-full aspect-video relative shadow-halo">
              {showOverlay && currentVideo?.thumbnail && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 animate-fade-in">
                      <Image src={currentVideo.thumbnail} alt={story.title} layout="fill" objectFit="cover" className="opacity-30" />
                      <div className="relative z-20 text-center px-4">
                        <h1 className="text-4xl font-headline text-white mb-4 drop-shadow-md">{story.title}</h1>
                        <p className="text-white/80 max-w-xl text-center mb-8 drop-shadow-sm">{story.summary}</p>
                        <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-black" onClick={startPlayback}>
                            <BookOpen className="mr-2" />
                            Begin the Epic
                        </Button>
                      </div>
                  </div>
              )}
              
              {!showOverlay && currentVideoId && (
                <YouTube 
                  videoId={currentVideoId} 
                  opts={opts} 
                  onReady={handlePlayerReady} 
                  onStateChange={handlePlayerStateChange}
                  className="w-full h-full"
                />
              )}
            </div>
        </div>
        
        <div className="w-full max-w-4xl mt-6">
            <h3 className="text-lg font-headline text-white mb-2">{currentVideo?.title}</h3>
            <div className="relative">
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {videos.map((video, index) => (
                        <div 
                            key={video.youtubeId} 
                            className={`flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 ${currentVideoIndex === index ? 'border-primary' : 'border-transparent'} transition-all`}
                            onClick={() => handleThumbnailClick(video.youtubeId)}
                        >
                            <img src={video.thumbnail} alt={video.title} className="w-40 h-24 object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <Button onClick={onBegin} size="lg" variant="link" className="mt-4 text-white/70 hover:text-white">
            Read Full Text of the Story
            <BookOpen className="ml-2" />
        </Button>

        <style jsx>{`
            .shadow-halo {
              box-shadow: 0 0 15px 5px rgba(255, 193, 7, 0.15), 0 0 30px 10px rgba(255, 193, 7, 0.1), 0 0 50px 20px rgba(255, 193, 7, 0.05);
            }
            .custom-scrollbar::-webkit-scrollbar {
              height: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #222;
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #444;
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #555;
            }
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
