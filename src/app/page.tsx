"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CelestialMap } from "@/components/celestial-map";
import { Manuscript } from "@/components/manuscript";
import { StoryView } from "@/components/story-view";
import type { Story } from "@/lib/stories";
import { stories } from "@/lib/stories";

type View = "celestial" | "manuscript" | "story";

export default function Home() {
  const [view, setView] = React.useState<View>("celestial");
  const [selectedStory, setSelectedStory] = React.useState<Story | null>(null);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  React.useEffect(() => {
    if (view === "celestial") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [view]);

  const handleSelectStory = (story: Story) => {
    setSelectedStory(story);
    setIsTransitioning(true);
    // Simulate falling star animation time
    setTimeout(() => {
      setView("manuscript");
      setIsTransitioning(false);
    }, 1500);
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

  return (
    <div className="flex flex-col h-screen bg-background">
      <main className="flex-1 flex flex-col items-center justify-center overflow-hidden relative">
        {isTransitioning && <FallingStar />}

        {view === "celestial" && (
          <>
            <div className="absolute top-1/3 text-center text-white z-10 pointer-events-none">
              <h1 className="text-5xl font-bold font-headline">Nakshatra Narratives</h1>
              <p className="mt-4 text-lg text-white/80">An interactive storytelling experience through the constellations.</p>
            </div>
            <CelestialMap stories={stories} onSelectStory={handleSelectStory} />
          </>
        )}
        
        {view === 'manuscript' && selectedStory && (
          <Manuscript 
            story={selectedStory} 
            onBegin={handleBeginStory}
            onBack={handleBackToCelestial} 
          />
        )}

        {view === 'story' && selectedStory && (
          <StoryView story={selectedStory} onBack={handleBackToManuscript} />
        )}
      </main>
    </div>
  );
}

const FallingStar = () => (
  <div className="absolute inset-0 z-[100] flex items-center justify-center pointer-events-none">
    <div
      className="bg-white rounded-full animate-falling-star"
      style={{
        width: "10px",
        height: "10px",
        boxShadow: "0 0 20px 10px white",
      }}
    />
    <style jsx>{`
      @keyframes falling-star {
        0% {
          transform: translateY(-100vh) scale(0.1);
          opacity: 1;
        }
        70% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
        100% {
          transform: translateY(0) scale(100);
          opacity: 0;
        }
      }
      .animate-falling-star {
        animation: falling-star 1.5s ease-in forwards;
      }
    `}</style>
  </div>
);
