
"use client";

import * as React from "react";
import type { Story } from "@/lib/stories";
import { Button } from "./ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

// Inline SVG Icons for the player controls, inspired by the provided skeleton
const PlayIcon = () => <svg viewBox="0 0 24 24"><path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" /></svg>;
const PauseIcon = () => <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" /></svg>;
const VolumeHighIcon = () => <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" /></svg>;
const VolumeMutedIcon = () => <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,4L7,9H3V15H7L12,20V4M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12Z" /></svg>;
const FullscreenIcon = () => <svg viewBox="0 0 24 24"><path fill="currentColor" d="M7,14H5V19H10V17H7V14M5,10H7V7H10V5H5V10M17,17H14V19H19V14H17V17M14,5V7H17V10H19V5H14Z" /></svg>;


export function VideoManuscript({ story, onBegin, onBack }: VideoManuscriptProps) {
    const [currentVideoIndex, setCurrentVideoIndex] = React.useState(0);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isMuted, setIsMuted] = React.useState(false);
    const [volume, setVolume] = React.useState(1);
    const [progress, setProgress] = React.useState(0);
    const [duration, setDuration] = React.useState(0);
    const [currentTime, setCurrentTime] = React.useState(0);
    
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const playerRef = React.useRef<HTMLDivElement>(null);
    const videos = story.videos || [];

    // --- Core Player Functions ---
    
    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused || videoRef.current.ended) {
                videoRef.current.play().catch(e => console.error("Play failed", e));
            } else {
                videoRef.current.pause();
            }
        }
    };
    
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            videoRef.current.muted = newVolume === 0;
        }
    };
    
    const toggleMute = () => {
        if (videoRef.current) {
            const currentMuted = !videoRef.current.muted;
            videoRef.current.muted = currentMuted;
            setIsMuted(currentMuted);
            if (currentMuted) {
              setVolume(0);
            } else {
              // Restore to last non-zero volume or default to 1
              setVolume(videoRef.current.volume > 0 ? videoRef.current.volume : 1);
            }
        }
    };

    const handleProgressScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = (parseFloat(e.target.value) / 100) * duration;
        if (videoRef.current) {
            videoRef.current.currentTime = newTime;
        }
    };

    const toggleFullscreen = () => {
      if (!playerRef.current) return;
      if (!document.fullscreenElement) {
        playerRef.current.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
      } else {
        document.exitFullscreen();
      }
    };

    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // --- Event Handlers for the <video> element ---

    const handleVideoEnded = () => {
        if (currentVideoIndex < videos.length - 1) {
            setCurrentVideoIndex(currentVideoIndex + 1);
        } else {
            console.log("The epic has concluded.");
            setIsPlaying(false);
        }
    };
    
    // Update state when video plays/pauses
    const handlePlayPause = () => {
        if (videoRef.current) {
            setIsPlaying(!videoRef.current.paused);
        }
    };

    // Update progress bar and time display
    const handleTimeUpdate = () => {
      if (videoRef.current) {
        setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
        setCurrentTime(videoRef.current.currentTime);
      }
    };
    
    // Set video duration once metadata is loaded
    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration);
      }
    };
    
    // Effect to auto-play next video in the playlist
    React.useEffect(() => {
        if (isPlaying && videoRef.current) {
            videoRef.current.play().catch(e => console.error("Autoplay of next video failed", e));
        }
    }, [currentVideoIndex, isPlaying]);


    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 relative bg-[#f5f5dc] animate-fade-in">
             <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-20 text-foreground" onClick={onBack}>
                <ArrowLeft />
                <span className="sr-only">Back to Celestial Map</span>
            </Button>
            
            <div ref={playerRef} className="player-container">
                <div className="flame"></div>

                <div className="video-wrapper">
                    <video
                        ref={videoRef}
                        src={videos[currentVideoIndex]?.src}
                        poster={videos[currentVideoIndex]?.thumbnail}
                        onEnded={handleVideoEnded}
                        onPlay={handlePlayPause}
                        onPause={handlePlayPause}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onClick={togglePlay}
                        playsInline
                        className="content-video"
                    ></video>
                    
                    <div className="player-controls">
                        <button onClick={togglePlay} title={isPlaying ? "Pause" : "Play"}>
                            {isPlaying ? <PauseIcon /> : <PlayIcon />}
                        </button>
                        
                        <input 
                          type="range" 
                          className="progress-bar" 
                          min="0"
                          max="100"
                          value={progress || 0}
                          onChange={handleProgressScrub}
                        />
                        
                        <div className="time-display">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </div>

                        <div className="volume-controls">
                            <button onClick={toggleMute} title={isMuted ? "Unmute" : "Mute"}>
                                {isMuted ? <VolumeMutedIcon /> : <VolumeHighIcon />}
                            </button>
                            <input 
                              type="range" 
                              min="0" max="1" 
                              step="0.01"
                              value={volume}
                              onChange={handleVolumeChange}
                            />
                        </div>

                        <button onClick={toggleFullscreen} title="Fullscreen">
                           <FullscreenIcon />
                        </button>
                    </div>

                    <div className="light-overlay"></div>
                </div>
            </div>

            <div className="w-full max-w-5xl mt-8 p-4 rounded-lg bg-background/50">
                <h3 className="font-headline text-xl border-b pb-2 mb-4 text-center text-foreground">{videos[currentVideoIndex]?.title || "Select a Scene"}</h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                    {videos.map((video, index) => (
                        <button 
                            key={index} 
                            onClick={() => setCurrentVideoIndex(index)}
                            className={cn(
                                "flex flex-col items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer border-2 flex-shrink-0 w-32",
                                currentVideoIndex === index ? "border-primary" : "border-transparent"
                            )}
                        >
                            <div className="w-28 h-16 bg-black rounded overflow-hidden relative">
                                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                                {currentVideoIndex === index && isPlaying && <div className="absolute inset-0 bg-primary/50 flex items-center justify-center text-white"><PlayIcon /></div>}
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
                /* General Styles */
                .animate-fade-in {
                    animation: fade-in 0.8s ease-in-out forwards;
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .player-container {
                    position: relative;
                    width: 100%;
                    max-width: 900px;
                    background-color: black;
                    overflow: hidden;
                    border-radius: 10px;
                }

                .player-container:hover .player-controls {
                    transform: translateY(0);
                }

                .video-wrapper {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 16 / 9;
                    border: 10px solid #3a2a1a;
                    border-radius: 5px;
                    box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
                    z-index: 2;
                    overflow: hidden;
                }

                .content-video {
                    width: 100%;
                    height: 100%;
                    display: block;
                    object-fit: cover;
                }
                .content-video::-webkit-media-controls {
                    display: none !important;
                }

                /* Controls */
                .player-controls {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 10px 15px;
                    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
                    transform: translateY(100%);
                    transition: transform 0.2s ease-in-out;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    color: white;
                }

                .player-controls button {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 0;
                    display: flex;
                    align-items: center;
                }
                .player-controls button svg {
                    width: 24px;
                    height: 24px;
                }

                .progress-bar {
                    flex-grow: 1;
                }

                .time-display {
                    font-size: 14px;
                    user-select: none;
                }

                .volume-controls {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                input[type="range"] {
                    -webkit-appearance: none;
                    appearance: none;
                    background: transparent;
                    cursor: pointer;
                    width: 100%;
                }
                input[type="range"]:focus { outline: none; }

                /* Track */
                input[type="range"]::-webkit-slider-runnable-track {
                    background-color: rgba(255, 255, 255, 0.3);
                    border-radius: 0.5rem;
                    height: 0.5rem;
                }
                input[type="range"]::-moz-range-track {
                    background-color: rgba(255, 255, 255, 0.3);
                    border-radius: 0.5rem;
                    height: 0.5rem;
                }

                /* Thumb */
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    margin-top: -4px;
                    background-color: #ffc107;
                    border-radius: 1rem;
                    height: 1rem;
                    width: 1rem;
                }
                input[type="range"]::-moz-range-thumb {
                    border: none;
                    border-radius: 1rem;
                    background-color: #ffc107;
                    height: 1rem;
                    width: 1rem;
                }

                /* Light & Flame Effects */
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
                    z-index: -1;
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

interface VideoManuscriptProps {
    story: Story;
    onBegin: () => void;
    onBack: () => void;
}
