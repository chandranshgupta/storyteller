
"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import type { Story } from "@/lib/stories";
import { Button } from "./ui/button";
import { LoaderCircle, ArrowLeft } from "lucide-react";
import { narrateFromHeroPOV } from "@/ai/flows/heros-pov";
import { generateCharacterLore } from "@/ai/flows/character-lore";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "./ui/scroll-area";


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
  const [isPovGenerating, setIsPovGenerating] = useState(false);
  
  const [loreCharacter, setLoreCharacter] = useState<string | null>(null);
  const [isLoreLoading, setIsLoreLoading] = useState(false);
  const [loreText, setLoreText] = useState("");

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
        
        if (!htmlRes.ok) throw new Error(`HTTP error! status: ${htmlRes.status} for HTML file`);
        if (!jsonRes.ok) throw new Error(`HTTP error! status: ${jsonRes.status} for JSON file`);

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
  
  const handlePovClick = async (character: string) => {
    // For now, we are assuming we are always on Chapter 1 as per the Hybrid RAG plan
    const chapterId = 1;
    const chapterData = preprocessedData.find(c => c.chapter === chapterId);

    if (!chapterData) {
      toast({ title: "Error", description: "Could not find chapter data.", variant: "destructive" });
      return;
    }

    // INSTANT RETRIEVAL from pre-processed file
    const preGeneratedText = character.toLowerCase() === 'rama'
      ? chapterData.text_original
      : chapterData.perspectives[character];
      
    if (!preGeneratedText) {
        toast({ title: "Perspective Not Found", description: `A pre-generated perspective for ${character} could not be found.`, variant: "destructive" });
        return;
    }
    
    // Instantly display the high-quality, pre-generated text
    if (storyContentRef.current) {
        storyContentRef.current.innerHTML = `<p>${preGeneratedText.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`;
    }


    // REAL-TIME ENHANCEMENT (AI call)
    setIsPovGenerating(true);
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
      toast({ title: "Error", description: "Could not enhance the character's perspective.", variant: "destructive" });
       if (storyContentRef.current) { // Revert on error
         storyContentRef.current.innerHTML = `<p>${preGeneratedText.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`; 
       }
    } finally {
      setIsPovGenerating(false);
    }
  };
  
  const handleLoreClick = async (character: string) => {
    setLoreCharacter(character);
    setIsLoreLoading(true);
    setLoreText(`<p>Summoning the story of ${character}...</p>`);
    try {
      const result = await generateCharacterLore({ characterName: character });
      // The result is now a string directly
      setLoreText(result.replace(/\n/g, '<br><br>'));
    } catch (error) {
       console.error("Error generating lore:", error);
       setLoreText("The ancient scrolls are silent at this moment. Please try again.");
       toast({ title: "Error", description: "Failed to generate character lore.", variant: "destructive" });
    } finally {
      setIsLoreLoading(false);
    }
  }
  
  const handleListen = () => {
    console.log("Listen button clicked. Full page narration to be implemented.");
  };

  const characters = [
    { name: "Rama", image: "/rama.png" },
    { name: "Sita", image: "/sita.png" },
    { name: "Hanuman", image: "/hanuman.png" },
    { name: "Dashratha", image: "/darshratha.png" },
    { name: "Kaikeyi", image: "/Kaikeyi.png" }
  ];

  return (
    <div id="manuscript-page" className="w-full h-full bg-background text-foreground p-4 sm:p-8 flex gap-8">
      <style jsx>{`
        #manuscript-page { font-family: 'Playfair Display', serif; }
        .pov-button {
          width: 60px; height: 60px; border-radius: 50%;
          border: 2px solid #DDC9A7; background-color: #F2EFE6;
          transition: all 0.2s ease-in-out; cursor: pointer;
          overflow: hidden; position: relative;
        }
        .pov-button:hover, .pov-button.active {
          border-color: #42352A; transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .pov-button img { object-fit: cover; object-position: center; }
        #story-content :global(h1), #story-content :global(h2), #story-content :global(h3) {
            font-family: 'Playfair Display', serif; color: #42352A;
            margin-bottom: 1rem;
        }
        #story-content :global(p) {
            font-family: 'PT Sans', sans-serif; line-height: 1.8;
            margin-bottom: 1.5rem; text-align: justify;
        }
      `}</style>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex justify-between items-center pb-4 border-b-2 border-primary/20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10" onClick={onBack}>
                    <ArrowLeft /> <span className="sr-only">Back</span>
                </Button>
                <h1 className="text-2xl sm:text-4xl font-headline text-primary">The Ramayana</h1>
            </div>
          <Button id="listen-button" onClick={handleListen} variant="ghost" className="text-lg text-primary hover:bg-primary/10 font-headline">
            Listen ▶
          </Button>
        </header>

        <div className="prose-lg max-w-none flex-1 overflow-y-auto p-4 relative">
          {isLoading ? (
            <div className="flex items-center justify-center h-full"><LoaderCircle className="animate-spin text-primary" size={48} /></div>
          ) : (
            <div id="story-content" ref={storyContentRef} dangerouslySetInnerHTML={{ __html: htmlContent }} />
          )}
          {isPovGenerating && (
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center"><LoaderCircle className="animate-spin text-primary" size={32} /></div>
          )}
        </div>
      </div>

      {/* Right POV Panel */}
      <aside id="pov-panel" className="flex flex-col items-center gap-4 py-4 px-2 bg-accent/50 rounded-lg border border-ring">
        <h3 className="font-headline text-sm text-primary/80 mb-2">Character Lore</h3>
        {characters.map((char) => (
          <button key={char.name} className="pov-button" data-character={char.name} onClick={() => handleLoreClick(char.name)} title={`Learn about ${char.name}`}>
            <Image src={char.image} alt={char.name} layout="fill" />
          </button>
        ))}
      </aside>

      {/* Lore Modal */}
       <Dialog open={!!loreCharacter} onOpenChange={(isOpen) => !isOpen && setLoreCharacter(null)}>
        <DialogContent className="bg-[#f4f1ea] border-[#3a2a1a] max-w-3xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-headline text-3xl text-primary text-center">The Story of {loreCharacter}</DialogTitle>
             <DialogClose className="text-primary hover:text-foreground" />
          </DialogHeader>
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-6 font-body text-base text-foreground/90 prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: loreText }} />
             {isLoreLoading && (
                <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                    <LoaderCircle className="animate-spin text-primary" size={32} />
                </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
