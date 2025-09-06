
"use client";

import * as React from "react";
import type { Story, VideoAsset } from "@/lib/stories";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";

interface VideoManuscriptProps {
    story: Story;
    onBegin: () => void;
    onBack: () => void;
}

export function VideoManuscript({ story, onBegin, onBack }: VideoManuscriptProps) {
    const videos = story.videos || [];
    const [currentVideoIndex, setCurrentVideoIndex] = React.useState(0);
    
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isMuted, setIsMuted] = React.useState(true); // Start muted for autoplay
    const [progress, setProgress] = React.useState(0);
    const [volume, setVolume] = React.useState(1);
    const [duration, setDuration] = React.useState(0);
    const [currentTime, setCurrentTime] = React.useState(0);

    const videoRef = React.useRef<HTMLVideoElement>(null);
    const playerRef = React.useRef<HTMLDivElement>(null);
    
    const currentVideo = videos[currentVideoIndex];

    // --- Core Player Functions ---
    const togglePlay = () => {
        if (videoRef.current) {
            if (videoRef.current.paused || videoRef.current.ended) {
                // First interaction by user unmutes
                if (isMuted) setIsMuted(false); 
                videoRef.current.play();
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
            if(newVolume > 0 && isMuted) setIsMuted(false);
        }
    };

    const toggleMute = () => {
        setIsMuted(prevMuted => {
            const newMuted = !prevMuted;
            if (videoRef.current) {
                videoRef.current.muted = newMuted;
                // If unmuting and volume is 0, set volume to 1
                if (!newMuted && videoRef.current.volume === 0) {
                    videoRef.current.volume = 1;
                    setVolume(1);
                }
            }
            return newMuted;
        });
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current) {
            const scrubTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
            videoRef.current.currentTime = scrubTime;
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            playerRef.current?.requestFullscreen().catch(err => {
                console.error(`Fullscreen Error: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };
    
    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds) || timeInSeconds === 0) return "00:00";
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // --- Event Handlers for the <video> element ---
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
        if(videoRef.current?.duration) {
            setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
            setCurrentTime(videoRef.current.currentTime);
        }
    };
    const onLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };
    const onEnded = () => {
        if (currentVideoIndex < videos.length - 1) {
            setCurrentVideoIndex(prev => prev + 1);
        } else {
            // End of playlist
            setIsPlaying(false);
        }
    };
    
    // --- Effects ---
    // Effect to play new video when index changes
    React.useEffect(() => {
        if(videoRef.current) {
           videoRef.current.play().catch(e => {
            // Autoplay was blocked, this is expected until user interaction
            setIsPlaying(false);
           });
        }
    }, [currentVideoIndex]);

    // Effect to handle muting
    React.useEffect(() => {
        if(videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted]);


    const handleThumbnailClick = (index: number) => {
        // User interaction, we can now unmute safely
        if(isMuted) setIsMuted(false);
        setCurrentVideoIndex(index);
    }

    return (
        <div className="manuscript-container">
            <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-20 text-foreground" onClick={onBack}>
                <ArrowLeft />
                <span className="sr-only">Back to Celestial Map</span>
            </Button>

            <div ref={playerRef} className="video-player">
                <video
                    ref={videoRef}
                    key={currentVideo?.src} // Key helps React re-render the element
                    src={currentVideo?.src}
                    poster={currentVideo?.thumbnail}
                    autoPlay
                    muted={isMuted}
                    playsInline
                    onPlay={onPlay}
                    onPause={onPause}
                    onEnded={onEnded}
                    onTimeUpdate={onTimeUpdate}
                    onLoadedMetadata={onLoadedMetadata}
                    onClick={togglePlay}
                ></video>

                <div className="player-controls">
                    <button title={isPlaying ? "Pause" : "Play"} onClick={togglePlay}>
                        <svg viewBox="0 0 24 24" style={{ display: !isPlaying ? 'block' : 'none' }}><path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" /></svg>
                        <svg viewBox="0 0 24 24" style={{ display: isPlaying ? 'block' : 'none' }}><path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" /></svg>
                    </button>
                    
                    <input type="range" className="progress-bar" min="0" max="100" value={progress || 0} step="0.1" onChange={handleProgressChange} />
                    
                    <div className="time-display">{formatTime(currentTime)} / {formatTime(duration)}</div>

                    <div className="volume-controls">
                        <button title={isMuted ? "Unmute" : "Mute"} onClick={toggleMute}>
                           <svg viewBox="0 0 24 24" style={{ display: !isMuted ? 'block' : 'none' }}><path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M3,9V15H7L12,20V4L7,9H3Z" /></svg>
                           <svg viewBox="0 0 24 24" style={{ display: isMuted ? 'block' : 'none' }}><path fill="currentColor" d="M12,4L7,9H3V15H7L12,20V4M21,12C21,16.28 18,19.86 14,20.77V18.7C16.89,17.84 19,15.17 19,12C19,8.83 16.89,6.15 14,5.29V3.23C18,4.14 21,7.72 21,12Z" /></svg>
                        </button>
                        <input type="range" min="0" max="1" value={isMuted ? 0 : volume} step="0.01" onChange={handleVolumeChange} />
                    </div>

                    <button title="Fullscreen" onClick={toggleFullscreen}>
                        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M7,14H5V19H10V17H7V14M5,10H7V7H10V5H5V10M17,17H14V19H19V14H17V17M14,5V7H17V10H19V5H14Z" /></svg>
                    </button>
                </div>
            </div>

            <h2 id="video-title-display">{currentVideo?.title}</h2>
            
            <div className="playlist-gallery">
                 {videos.map((video, index) => (
                    <div 
                        key={video.src} 
                        className={cn("thumbnail", currentVideoIndex === index && "active")}
                        onClick={() => handleThumbnailClick(index)}
                    >
                        <img src={video.thumbnail} alt={video.title} />
                        <span>{video.title}</span>
                    </div>
                ))}
            </div>

            <Button onClick={onBegin} size="lg" className="mt-6">
                <BookOpen className="mr-2" />
                Read Full Story
            </Button>

            <style jsx>{`
                :root {
                    --theme-color: #D2B48C; /* Tan color for accents */
                    --track-bg: rgba(255, 255, 255, 0.3);
                    --text-color: #ffffff;
                }
                .manuscript-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100vh;
                    background-color: #f5f5dc; /* Papyrus background */
                    padding: 1rem;
                    box-sizing: border-box;
                    animation: fade-in 0.8s ease-in-out forwards;
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .video-player {
                    position: relative;
                    width: 100%;
                    max-width: 900px;
                    background-color: black;
                    overflow: hidden; 
                    border-radius: 10px;
                    box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
                    border: 10px solid #3a2a1a;
                }
                .video-player:hover .player-controls {
                    transform: translateY(0);
                }
                .video-player video {
                    width: 100%;
                    display: block;
                    aspect-ratio: 16 / 9;
                }
                video::-webkit-media-controls {
                    display: none !important;
                }

                .player-controls {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    padding: 10px;
                    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
                    transform: translateY(100%);
                    transition: transform 0.2s ease-in-out;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .player-controls button {
                    background: none;
                    border: none;
                    color: var(--text-color);
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
                    color: var(--text-color);
                    font-size: 14px;
                    font-family: 'PT Sans', sans-serif;
                }
                .volume-controls {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
                input[type="range"] {
                    -webkit-appearance: none;
                    appearance: none;
                    background: transparent;
                    cursor: pointer;
                    width: 100%;
                }
                input[type="range"]:focus {
                    outline: none;
                }
                input[type="range"]::-webkit-slider-runnable-track {
                    background-color: var(--track-bg);
                    border-radius: 0.5rem;
                    height: 0.5rem;
                }
                input[type="range"]::-moz-range-track {
                    background-color: var(--track-bg);
                    border-radius: 0.5rem;
                    height: 0.5rem;
                }
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    margin-top: -4px;
                    background-color: var(--theme-color);
                    border-radius: 1rem;
                    height: 1rem;
                    width: 1rem;
                }
                input[type="range"]::-moz-range-thumb {
                    border: none;
                    border-radius: 1rem;
                    background-color: var(--theme-color);
                    height: 1rem;
                    width: 1rem;
                }

                #video-title-display {
                    color: #3a2a1a;
                    font-family: 'Playfair Display', serif;
                    margin-top: 1.5rem;
                    margin-bottom: 1rem;
                    font-size: 1.5rem;
                }
                .playlist-gallery {
                    display: flex;
                    gap: 10px;
                    overflow-x: auto;
                    padding: 10px;
                    width: 100%;
                    max-width: 900px;
                    justify-content: center;
                }
                .thumbnail {
                    cursor: pointer;
                    border: 3px solid transparent;
                    border-radius: 5px;
                    overflow: hidden;
                    transition: transform 0.2s ease, border-color 0.2s ease;
                    flex-shrink: 0;
                    background: #000;
                }
                .thumbnail:hover {
                    transform: scale(1.05);
                }
                .thumbnail.active {
                    border-color: #8B4513; /* A rustic brown to show active state */
                }
                .thumbnail img {
                    width: 150px;
                    height: 84px;
                    object-fit: cover;
                    display: block;
                }
                .thumbnail span {
                    display: none;
                }
            `}</style>
        </div>
    );
}
