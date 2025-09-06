
"use client";

import * as React from "react";
import type { Story } from "@/lib/stories";
import { Button } from "./ui/button";
import { ArrowLeft, BookOpen, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoManuscriptProps {
    story: Story;
    onBegin: () => void;
    onBack: () => void;
}

export function VideoManuscript({ story, onBegin, onBack }: VideoManuscriptProps) {
    const [currentVideoIndex, setCurrentVideoIndex] = React.useState(0);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const videos = story.videos || [];

    const handleVideoEnded = () => {
        if (currentVideoIndex < videos.length - 1) {
            setCurrentVideoIndex(currentVideoIndex + 1);
        } else {
            console.log("The epic has concluded.");
            setIsPlaying(false); // End playback
        }
    };
    
    React.useEffect(() => {
        if(isPlaying && videoRef.current) {
            videoRef.current.play().catch(error => {
                console.error("Video play failed:", error);
                setIsPlaying(false); // Stop if there's an error
            });
        }
    }, [currentVideoIndex, isPlaying]);

    const startPlayback = () => {
        setIsPlaying(true);
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 relative bg-[#f5f5dc] animate-fade-in">
             <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-20 text-foreground" onClick={onBack}>
                <ArrowLeft />
                <span className="sr-only">Back to Celestial Map</span>
            </Button>
            
            <div className="player-container">
                <div className="flame"></div>

                <div className="video-wrapper">
                    <video
                        ref={videoRef}
                        key={currentVideoIndex}
                        src={isPlaying ? videos[currentVideoIndex]?.src : ""}
                        onEnded={handleVideoEnded}
                        playsInline
                        className="content-video"
                    ></video>
                    {!isPlaying && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
                            <h2 className="font-headline text-5xl text-white mb-4">{story.title}</h2>
                           <Button size="lg" variant="outline" className="bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={startPlayback}>
                               <PlayCircle className="mr-2" />
                               Begin the Epic
                           </Button>
                        </div>
                    )}
                    <div className="light-overlay"></div>
                </div>
            </div>

            <div className="w-full max-w-5xl mt-4 p-4 rounded-lg bg-background/50">
                <h3 className="font-headline text-xl border-b pb-2 mb-2 text-center text-foreground">{story.title}: Scenes</h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {videos.map((video, index) => (
                        <button 
                            key={index} 
                            onClick={() => {
                                setCurrentVideoIndex(index)
                                if (!isPlaying) setIsPlaying(true);
                            }}
                            className={cn(
                                "flex flex-col items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer border-2 flex-shrink-0 w-32",
                                isPlaying && currentVideoIndex === index ? "border-primary" : "border-transparent"
                            )}
                        >
                            <div className="w-28 h-16 bg-black rounded overflow-hidden">
                                <video className="w-full h-full object-cover" src={video.src} preload="metadata" muted playsInline />
                            </div>
                            <span className="text-xs font-body text-center text-foreground">{video.title}</span>
                        </button>
                    ))}
                </div>
            </div>
             <div className="mt-4">
                <Button onClick={onBegin} size="lg">
                    <BookOpen className="mr-2" />
                    Read Full Story
                </Button>
            </div>


            <style jsx>{`
                .animate-fade-in {
                    animation: fade-in 0.8s ease-in-out forwards;
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .player-container {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    max-width: 900px;
                    height: 60vh;
                }

                .video-wrapper {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    border: 10px solid #3a2a1a;
                    border-radius: 5px;
                    box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
                    z-index: 2;
                    overflow: hidden;
                    background: black;
                }

                .content-video {
                    width: 100%;
                    height: 100%;
                    display: block;
                    object-fit: cover;
                }

                .light-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(
                        circle at 20% 110%,
                        rgba(255, 204, 102, 0.4) 0%,
                        rgba(255, 102, 0, 0.2) 50%,
                        rgba(0, 0, 0, 0.5) 120%
                    );
                    pointer-events: none;
                    animation: light-flicker 4s ease-in-out infinite alternate;
                }

                @keyframes light-flicker {
                    0% { opacity: 0.6; }
                    50% {
                        opacity: 0.8;
                        background: radial-gradient(
                        circle at 25% 105%,
                        rgba(255, 204, 102, 0.5) 0%,
                        rgba(255, 102, 0, 0.25) 50%,
                        rgba(0, 0, 0, 0.5) 120%
                        );
                    }
                    100% { opacity: 0.65; }
                }

                .flame {
                    position: absolute;
                    bottom: -80px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 250px;
                    height: 250px;
                    background: radial-gradient(circle, #ffcc66 10%, #ff6600 40%, rgba(255, 102, 0, 0) 70%);
                    filter: blur(40px);
                    z-index: 1;
                    animation: flicker 3s ease-in-out infinite alternate;
                }

                @keyframes flicker {
                    0% { transform: translateX(-50%) scale(1, 1); opacity: 0.8; }
                    50% { transform: translateX(-45%) scale(1.1, 0.9); opacity: 1; }
                    100% { transform: translateX(-55%) scale(0.95, 1.05); opacity: 0.7; }
                }
            `}</style>
        </div>
    );
}
