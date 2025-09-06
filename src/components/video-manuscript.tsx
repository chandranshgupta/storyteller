
"use client";

import * as React from "react";
import type { Story } from "@/lib/stories";
import { Button } from "./ui/button";
import { ArrowLeft, BookOpen, Play } from "lucide-react";
import { VideoJsPlayer } from "./video-js-player";
import type { VideoJsPlayerOptions } from "video.js";

interface VideoManuscriptProps {
    story: Story;
    onBegin: () => void;
    onBack: () => void;
}

export function VideoManuscript({ story, onBegin, onBack }: VideoManuscriptProps) {
    const [player, setPlayer] = React.useState<any>(null);
    const [currentVideoIndex, setCurrentVideoIndex] = React.useState(0);
    const [isPlayerReady, setIsPlayerReady] = React.useState(false);
    const [showOverlay, setShowOverlay] = React.useState(true);

    const videos = story.videos || [];
    const currentVideo = videos[currentVideoIndex];
    
    const videoJsOptions: VideoJsPlayerOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
            src: currentVideo?.src,
            type: 'video/mp4'
        }],
        poster: currentVideo?.thumbnail,
    };

    const handlePlayerReady = (playerInstance: any) => {
        setPlayer(playerInstance);
        setIsPlayerReady(true);
        
        playerInstance.on('ended', () => {
            setCurrentVideoIndex(prevIndex => {
                const nextIndex = prevIndex + 1;
                if (nextIndex < videos.length) {
                    playerInstance.src({ src: videos[nextIndex].src, type: 'video/mp4' });
                    playerInstance.poster(videos[nextIndex].thumbnail);
                    return nextIndex;
                } else {
                    // Reached end of playlist
                    setShowOverlay(true); 
                    playerInstance.poster(videos[0].thumbnail);
                    playerInstance.reset();
                    return 0;
                }
            });
        });
    };
    
    const startPlayback = () => {
        setShowOverlay(false);
        if (player) {
            player.play();
        }
    }
    
    const handleThumbnailClick = (index: number) => {
        setCurrentVideoIndex(index);
        if (player) {
           player.src({ src: videos[index].src, type: 'video/mp4' });
           player.poster(videos[index].thumbnail);
           setShowOverlay(false);
        }
    }


    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 bg-black">
            <div className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center relative">
                <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-20 text-white hover:bg-white/10" onClick={onBack}>
                    <ArrowLeft />
                    <span className="sr-only">Back to Celestial Map</span>
                </Button>
                
                <div className="w-full aspect-video relative">
                    <VideoJsPlayer options={videoJsOptions} onReady={handlePlayerReady} />
                    
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
                </div>

                <div className="w-full mt-4">
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
