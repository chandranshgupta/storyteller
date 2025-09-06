
"use client";

import * as React from "react";
import type { Story, VideoAsset } from "@/lib/stories";
import { Button } from "./ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function VideoManuscript({ story, onBegin, onBack }: VideoManuscriptProps) {
    const [currentVideo, setCurrentVideo] = React.useState<VideoAsset | null>(story.videos ? story.videos[0] : null);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const videos = story.videos || [];

    const handleThumbnailClick = (video: VideoAsset) => {
        if (videoRef.current) {
            videoRef.current.muted = false; // Unmute on user interaction
        }
        setCurrentVideo(video);
    };

    React.useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement || !currentVideo) return;

        videoElement.src = currentVideo.src;
        videoElement.load();
        videoElement.play().catch(error => {
            console.error("Video play failed:", error);
            // This error is expected on initial load before user interaction.
            // The video is muted, so it should autoplay where allowed.
        });

    }, [currentVideo]);

    const handleVideoEnded = () => {
        const currentIndex = videos.findIndex(v => v.src === currentVideo?.src);
        if (currentIndex !== -1 && currentIndex < videos.length - 1) {
            setCurrentVideo(videos[currentIndex + 1]);
        } else {
            console.log("The epic has concluded.");
            // Optional: Loop back or show an end screen
        }
    };
    
    return (
        <div className="manuscript-container">
            <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-20 text-foreground" onClick={onBack}>
                <ArrowLeft />
                <span className="sr-only">Back to Celestial Map</span>
            </Button>
            
            <div className="video-player-wrapper">
                <video 
                    ref={videoRef} 
                    playsInline 
                    muted  // Start muted to allow autoplay
                    onEnded={handleVideoEnded}
                    className="content-video"
                />
            </div>

            <h2 id="video-title-display">{currentVideo?.title || "Select a Scene"}</h2>

            <div className="playlist-gallery">
                {videos.map((video, index) => (
                    <div 
                        key={index} 
                        className={cn(
                            "thumbnail",
                            currentVideo?.src === video.src && "active"
                        )}
                        onClick={() => handleThumbnailClick(video)}
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
                .manuscript-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100vh;
                    background-color: #f5f5dc; /* Papyrus background */
                    padding: 2rem;
                    box-sizing: border-box;
                    animation: fade-in 0.8s ease-in-out forwards;
                }

                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .video-player-wrapper {
                    width: 100%;
                    max-width: 900px;
                    border: 10px solid #3a2a1a;
                    border-radius: 5px;
                    box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
                    background-color: #000;
                    overflow: hidden;
                }

                .content-video {
                    width: 100%;
                    display: block;
                    aspect-ratio: 16 / 9;
                    object-fit: cover;
                }

                #video-title-display {
                    color: #3a2a1a;
                    font-family: 'Playfair Display', serif;
                    margin-top: 1.5rem;
                    margin-bottom: 1rem;
                    font-size: 1.75rem;
                    text-align: center;
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

interface VideoManuscriptProps {
    story: Story;
    onBegin: () => void;
    onBack: () => void;
}
