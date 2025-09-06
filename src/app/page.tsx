
"use client";

import * as React from "react";
import type { Story } from "@/lib/stories";
import { stories } from "@/lib/stories";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";
import { FallingStar } from "@/components/falling-star";

const CelestialMap = dynamic(() => import('@/components/celestial-map').then(mod => mod.CelestialMap), { 
  ssr: false,
  loading: () => <Skeleton className="w-full h-full bg-black" />
});
const Manuscript = dynamic(() => import('@/components/manuscript').then(mod => mod.Manuscript), {
  loading: () => <Skeleton className="w-full h-full" />
});
const StoryView = dynamic(() => import('@/components/story-view').then(mod => mod.StoryView), {
  loading: () => <Skeleton className="w-full h-full" />
});
const VideoPlayer = dynamic(() => import('@/components/video-player').then(mod => mod.VideoPlayer), {
  loading: () => <Skeleton className="w-full h-full" />
});


type View = "celestial" | "manuscript" | "story";

export default function Home() {
  const [view, setView] = React.useState<View>("celestial");
  const [selectedStory, setSelectedStory] = React.useState<Story | null>(null);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  React.useEffect(() => {
    // Keep dark mode for video player as well
    if (view === "celestial" || (view === "manuscript" && selectedStory?.id === 'ramayana')) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [view, selectedStory]);

  const handleSelectStory = (story: Story) => {
    setSelectedStory(story);
    setIsTransitioning(true);
  };
  
  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    setView("manuscript");
  };

  const handleBeginStory = () => {
    setView("story");
  };

  const handleBackToManuscript = () => {
    setView("manuscript");
  };
  
  const handleBackToCelestial = () => {
    setSelectedStory(null);
    setView("celestial");
  }

  const renderManuscript = () => {
    if (!selectedStory) return null;

    if (selectedStory.id === 'ramayana') {
        return (
            <VideoPlayer
                story={selectedStory}
                onBeginStory={handleBeginStory}
                onBack={handleBackToCelestial}
            />
        )
    }

    return (
      <Manuscript 
        story={selectedStory} 
        onBegin={handleBeginStory}
        onBack={handleBackToCelestial} 
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 flex flex-col items-center justify-center overflow-hidden relative">
        <div className={`w-full h-full transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          {view === "celestial" && (
            <>
              <div className="absolute top-1/3 text-center text-white z-10 pointer-events-none">
                <h1 className="text-5xl font-bold font-headline">Nakshatra Narratives</h1>
                <p className="mt-4 text-lg text-white/80">An interactive storytelling experience through the constellations.</p>
              </div>
              <CelestialMap stories={stories} onSelectStory={handleSelectStory} />
            </>
          )}
          
          <React.Suspense fallback={<Skeleton className="w-full h-full" />}>
            {view === 'manuscript' && renderManuscript()}
            {view === 'story' && selectedStory && (
              <StoryView story={selectedStory} onBack={handleBackToManuscript} />
            )}
          </React.Suspense>
        </div>
        {isTransitioning && <FallingStar onAnimationComplete={handleTransitionComplete} />}
      </main>
    </div>
  );
}
