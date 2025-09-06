"use client";

import type { Story } from "@/lib/stories";
import { Button } from "./ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";

interface VideoManuscriptProps {
    story: Story;
    onBegin: () => void;
    onBack: () => void;
}

// A simple placeholder for video URLs if they are not in the story data
const placeholderVideos = [
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
];

export function VideoManuscript({ story, onBegin, onBack }: VideoManuscriptProps) {

    const videos = story.videos?.length ? story.videos : placeholderVideos;

    return (
        <div className="w-full h-full flex items-center justify-center p-4 sm:p-8 relative animate-fade-in bg-background">
            <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-10" onClick={onBack}>
                <ArrowLeft />
                <span className="sr-only">Back to Celestial Map</span>
            </Button>
            <Card className="w-full max-w-5xl max-h-[90vh] flex flex-col">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-4xl">{story.title}</CardTitle>
                    <CardDescription className="font-body text-base pt-2">{story.summary}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
                    <div className="md:w-3/4 h-[300px] md:h-auto bg-black rounded-lg overflow-hidden">
                       {videos.length > 0 && (
                         <video
                            key={videos[0]}
                            className="w-full h-full object-cover"
                            controls
                            autoPlay
                            muted
                            loop
                         >
                            <source src={videos[0]} type="video/mp4" />
                            Your browser does not support the video tag.
                         </video>
                       )}
                    </div>
                    <div className="md:w-1/4 flex flex-col gap-2 overflow-y-auto">
                        <h3 className="font-headline text-lg border-b pb-2">Scenes</h3>
                        {videos.map((video, index) => (
                           <div key={index} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer">
                                <div className="w-16 h-10 bg-black rounded overflow-hidden flex-shrink-0">
                                   <video className="w-full h-full object-cover" src={video} preload="metadata" />
                                </div>
                                <span className="text-sm font-body">Scene {index + 1}</span>
                           </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex-col sm:flex-row justify-center gap-4 p-6">
                    <Button onClick={onBegin} size="lg">
                        <BookOpen className="mr-2" />
                        Read Full Story
                    </Button>
                </CardFooter>
            </Card>
            <style jsx>{`
                @keyframes fade-in {
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
