
"use client";
import { useState, useRef, useEffect } from "react";
import type { Story } from "@/lib/stories";
import { Button } from "./ui/button";
import { LoaderCircle, ArrowLeft } from "lucide-react";
import { narrateFromHeroPOV } from "@/ai/flows/heros-pov";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

interface StoryViewProps {
  story: Story;
  onBack: () => void;
}

interface PreprocessedChapter {
    chapter: number;
    title: string;
    text_original: string;
    perspectives: {
        [character: string]: string;
    }
}

export function StoryView({ story, onBack }: StoryViewProps) {
  const [preprocessedData, setPreprocessedData] = useState<PreprocessedChapter[]>([]);
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const storyContentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchStoryData() {
      setIsLoading(true);
      try {
        const [htmlRes, jsonRes] = await Promise.all([
          fetch('/ramayanakatha.html'),
          fetch('/ramayana_preprocessed.json')
        ]);
        
        if (!htmlRes.ok) {
            throw new Error(`HTTP error! status: ${htmlRes.status} for HTML file`);
        }
        if (!jsonRes.ok) {
            throw new Error(`HTTP error! status: ${jsonRes.status} for JSON file`);
        }

        const html = await htmlRes.text();
        const data: PreprocessedChapter[] = await jsonRes.json();
        
        setHtmlContent(html);
        setPreprocessedData(data);

      } catch (error) {
        console.error("Failed to load story data:", error);
        toast({
            title: "Error",
            description: "Could not load the story.",
            variant: "destructive",
        })
        setHtmlContent("<p>Error: Could not load story content.</p>");
      } finally {
        setIsLoading(false);
      }
    }
    fetchStoryData();
  }, [toast]);

  const handleListen = () => {
    console.log("Listen button clicked. Full page narration to be implemented.");
  };

  const handlePovClick = async (character: string) => {
    // For now, we are assuming we are always on Chapter 1 as per the Hybrid RAG plan
    const chapterId = 1;
    const chapterData = preprocessedData.find(c => c.chapter === chapterId);

    if (!chapterData) {
      toast({
        title: "Error",
        description: "Could not find chapter data.",
        variant: "destructive",
      });
      return;
    }

    // INSTANT RETRIEVAL from pre-processed file
    const preGeneratedText = character.toLowerCase() === 'rama'
      ? chapterData.text_original
      : chapterData.perspectives[character];
      
    if (!preGeneratedText) {
        toast({
            title: "Perspective Not Found",
            description: `A pre-generated perspective for ${character} could not be found.`,
            variant: "destructive",
        });
        return;
    }
    
    // Instantly display the high-quality, pre-generated text
    if (storyContentRef.current) {
        storyContentRef.current.innerHTML = `<p>${preGeneratedText.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
    }


    // REAL-TIME ENHANCEMENT (AI call)
    setIsGenerating(true);
    try {
      const result = await narrateFromHeroPOV({
        chapterId: chapterId,
        characterName: character,
      });
      if (storyContentRef.current) {
        storyContentRef.current.innerHTML = `<p>${result.narration.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
      }
    } catch (error) {
      console.error("Error enhancing perspective:", error);
      toast({
        title: "Error",
        description: "Could not enhance the character's perspective.",
        variant: "destructive",
      });
       if (storyContentRef.current) {
         storyContentRef.current.innerHTML = `<p>${preGeneratedText.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`; // Revert on error
       }
    } finally {
      setIsGenerating(false);
    }
  };

  const characters = [
    { name: "Rama", image: "/rama.png" },
    { name: "Sita", image: "/sita.png" },
    { name: "Hanuman", image: "/hanuman.png" },
    { name: "Dashratha", image: "/darshratha.png" },
    { name: "Kaikeyi", image: "/Kaikeyi.png" }
  ];

  return (
    <div id="manuscript-page" className="w-full h-full bg-[#FAF8F2] text-[#2D241E] p-4 sm:p-8 flex gap-8">
      <style jsx>{`
        #manuscript-page {
          font-family: 'Playfair Display', serif;
        }
        .pov-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid #DDC9A7;
          background-color: #F2EFE6;
          transition: all 0.2s ease-in-out;
          cursor: pointer;
          overflow: hidden;
          position: relative;
        }
        .pov-button:hover, .pov-button.active {
          border-color: #42352A;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .pov-button img {
            object-fit: cover;
            object-position: center;
        }
        #story-content :global(h1), #story-content :global(h2), #story-content :global(h3) {
            font-family: 'Playfair Display', serif;
            color: #42352A;
            margin-bottom: 1rem;
        }
        #story-content :global(p) {
            font-family: 'PT Sans', sans-serif;
            line-height: 1.8;
            margin-bottom: 1.5rem;
            text-align: justify;
        }
      `}</style>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex justify-between items-center pb-4 border-b-2 border-[#42352A]/20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10" onClick={onBack}>
                    <ArrowLeft />
                    <span className="sr-only">Back</span>
                </Button>
                <h1 className="text-2xl sm:text-4xl font-headline text-primary">The Ramayana</h1>
            </div>
          <Button
            id="listen-button"
            onClick={handleListen}
            variant="ghost"
            className="text-lg text-primary hover:bg-primary/10 font-headline"
          >
            Listen ▶
          </Button>
        </header>

        <div className="prose-lg max-w-none flex-1 overflow-y-auto p-4 relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
                <LoaderCircle className="animate-spin text-primary" size={48} />
            </div>
          ) : (
            <div id="story-content" ref={storyContentRef} dangerouslySetInnerHTML={{ __html: htmlContent }} />
          )}

          {isGenerating && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                 <LoaderCircle className="animate-spin text-primary" size={32} />
            </div>
          )}
        </div>
      </div>

      {/* Right POV Panel */}
      <aside id="pov-panel" className="flex flex-col items-center gap-4 py-4 px-2 bg-[#E6DBC9]/50 rounded-lg border border-[#DDC9A7]">
        <h3 className="font-headline text-sm text-primary/80 mb-2">Point of View</h3>
        {characters.map((char) => (
          <button
            key={char.name}
            className="pov-button"
            data-character={char.name}
            onClick={() => handlePovClick(char.name)}
            title={char.name}
          >
            <Image src={char.image} alt={char.name} layout="fill" />
          </button>
        ))}
      </aside>
    </div>
  );
}
