
"use client";
import { useState, useRef, useEffect, UIEvent } from "react";
import type { Story } from "@/lib/stories";
import { Button } from "./ui/button";
import { LoaderCircle, ArrowLeft } from "lucide-react";
import { narrateFromHeroPOV } from "@/ai/flows/heros-pov";
import { useToast } from "@/hooks/use-toast";

interface StoryViewProps {
  story: Story;
  onBack: () => void;
}

interface RamayanaChapter {
    chapter: number;
    kanda: string;
    text: string;
}

export function StoryView({ story, onBack }: StoryViewProps) {
  const [ramayanaData, setRamayanaData] = useState<RamayanaChapter[]>([]);
  const [displayedChapters, setDisplayedChapters] = useState<RamayanaChapter[]>([]);
  const [currentPovChapter, setCurrentPovChapter] = useState<RamayanaChapter | null>(null);
  const [povText, setPovText] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [popup, setPopup] = useState<{ x: number, y: number, text: string } | null>(null);
  const [guruPopup, setGuruPopup] = useState<{ text: string } | null>(null);

  const storyContentRef = useRef<HTMLDivElement>(null);
  const wisdomIconRef = useRef<HTMLSpanElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchStoryData() {
      setIsLoading(true);
      try {
        const response = await fetch('/ramayana_complete.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: RamayanaChapter[] = await response.json();
        setRamayanaData(data);
        const firstChapter = data.find(chap => chap.chapter === 1);
        if (firstChapter) {
          setDisplayedChapters([firstChapter]);
          setCurrentPovChapter(firstChapter);
        }
      } catch (error) {
        console.error("Failed to load Ramayana data:", error);
        toast({
            title: "Error",
            description: "Could not load the story text.",
            variant: "destructive",
        })
      } finally {
        setIsLoading(false);
      }
    }
    fetchStoryData();
  }, [story.id, toast]);

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popup && wisdomIconRef.current && !wisdomIconRef.current.contains(event.target as Node)) {
        setPopup(null);
      }
      if (guruPopup) {
        setGuruPopup(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [popup, guruPopup]);


  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    // Load next chapter when user is 80% of the way through the current content
    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      loadNextChapter();
    }

    // Determine the current chapter for POV
    const chapterElements = Array.from(event.currentTarget.children);
    let topChapterIndex = 0;
    let minDistance = Infinity;

    chapterElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        // Find the chapter element closest to the top of the viewport
        if (Math.abs(rect.top) < minDistance) {
            minDistance = Math.abs(rect.top);
            topChapterIndex = index;
        }
    });

    const currentChapterForPov = displayedChapters[topChapterIndex];
    if (currentChapterForPov && currentChapterForPov.chapter !== currentPovChapter?.chapter) {
        setCurrentPovChapter(currentChapterForPov);
        setPovText(null); // Reset POV text when chapter changes
    }
  };

  const loadNextChapter = () => {
    if (ramayanaData.length === 0 || displayedChapters.length === ramayanaData.length) {
      return; // All chapters loaded
    }
    const lastLoadedChapterNumber = displayedChapters[displayedChapters.length - 1].chapter;
    const nextChapter = ramayanaData.find(chap => chap.chapter === lastLoadedChapterNumber + 1);

    if (nextChapter && !displayedChapters.find(dc => dc.chapter === nextChapter.chapter)) {
      setDisplayedChapters(prev => [...prev, nextChapter]);
    }
  };


  const handleListen = () => {
    // This button is now just for show until we implement full page narration
    console.log("Listen button clicked. Full page narration to be implemented.");
  };

  const handlePovClick = async (character: string) => {
    if (!currentPovChapter) return;
    
    // Clear previous POV text
    setPovText(null);
    
    if (character.toLowerCase() === 'rama') {
      // No generation needed for default view, just ensure no POV text is shown
      return;
    }

    setIsGenerating(true);

    try {
      const result = await narrateFromHeroPOV({
        chapterId: currentPovChapter.chapter,
        characterName: character,
      });
      setPovText(result.narration);
    } catch (error) {
      console.error("Error generating perspective:", error);
      toast({
        title: "Error",
        description: "Could not generate character's perspective.",
        variant: "destructive",
      });
      setPovText(null); // Clear POV on error
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = storyContentRef.current?.getBoundingClientRect();
      
      if(containerRect) {
         setPopup({
          x: rect.right - containerRect.left,
          y: rect.top - containerRect.top,
          text: selection.toString()
        });
      }
    } else {
      setPopup(null);
    }
  };

  const handleWisdomClick = () => {
    if (!popup) return;
    const selectedText = popup.text;
    setPopup(null);
    setGuruPopup({ text: `[Fetching philosophical insight for: '${selectedText}'... The full explanation will be generated by the RAG system here.]` });
  };

  const characters = ["Rama", "Sita", "Hanuman", "Dashratha", "Kaikeyi"];
  
  const displayedText = isGenerating 
    ? "Generating perspective..." 
    : povText 
    ? povText
    : currentPovChapter?.text ?? "";


  return (
    <div id="manuscript-page" className="w-full h-full bg-[#f5f5dc] text-[#1a1a1a] font-serif p-4 sm:p-8 flex gap-8">
      <style jsx>{`
        #manuscript-page {
          font-family: Georgia, serif;
        }
        .pov-button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid #553B28;
          background-color: #E6DBC9;
          transition: all 0.2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          text-align: center;
          cursor: pointer;
        }
        .pov-button:hover {
          background-color: #D2B48C;
          transform: scale(1.1);
        }
        .guru-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: #FAF8F2;
          border: 1px solid #DDC9A7;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          padding: 2rem;
          z-index: 100;
          max-width: 500px;
          border-radius: 0.5rem;
        }
        .wisdom-icon {
            position: absolute;
            cursor: pointer;
            font-size: 1.5rem;
            line-height: 1;
            user-select: none;
            z-index: 50;
        }
      `}</style>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center pb-4 border-b-2 border-[#553B28]/20">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10" onClick={onBack}>
                    <ArrowLeft />
                    <span className="sr-only">Back</span>
                </Button>
                <h1 className="text-2xl sm:text-4xl font-headline text-primary">{story.title}</h1>
            </div>
          <Button
            id="listen-button"
            onClick={handleListen}
            variant="ghost"
            className="text-lg text-primary hover:bg-primary/10"
          >
            Listen ▶
          </Button>
        </header>

        <div 
          id="story-content"
          ref={storyContentRef}
          onMouseUp={handleTextSelection}
          onScroll={handleScroll}
          className="prose-lg max-w-none flex-1 overflow-y-auto p-4 relative"
        >
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
                <LoaderCircle className="animate-spin text-primary" size={48} />
            </div>
          ) : povText ? (
            <div>
              <h2 className="text-xl font-headline text-primary/80 italic mb-4">
                Perspective on Chapter {currentPovChapter?.chapter}
              </h2>
              <p className="text-justify leading-relaxed whitespace-pre-wrap">{povText}</p>
            </div>
          ) : isGenerating ? (
             <div className="flex items-center justify-center h-full">
                <LoaderCircle className="animate-spin text-primary" size={48} />
            </div>
          ) : (
            displayedChapters.map(chapter => (
              <div key={chapter.chapter} id={`chapter-${chapter.chapter}`} className="mb-8">
                <h2 className="text-3xl font-headline text-primary/90 mb-4 border-b border-primary/20 pb-2">
                    Chapter {chapter.chapter}
                </h2>
                <p className="text-justify leading-relaxed whitespace-pre-wrap">{chapter.text}</p>
              </div>
            ))
          )}

          {popup && (
            <span
              ref={wisdomIconRef}
              className="wisdom-icon"
              style={{ left: `${popup.x}px`, top: `${popup.y}px` }}
              onClick={handleWisdomClick}
              title="Get Guru's Commentary"
            >
              🪷
            </span>
          )}
        </div>
      </div>

      {/* Right POV Panel */}
      <aside id="pov-panel" className="flex flex-col items-center gap-4 py-4 px-2 bg-[#E6DBC9]/50 rounded-lg border border-[#DDC9A7]">
        <h3 className="font-headline text-sm text-primary/80 mb-2">Point of View</h3>
        {characters.map((char) => (
          <button
            key={char}
            className="pov-button"
            data-character={char}
            onClick={() => handlePovClick(char)}
          >
            {char}
          </button>
        ))}
         <div className="text-xs text-center text-primary/60 mt-4 px-1">
            Showing POV for Ch. {currentPovChapter?.chapter ?? '...'}
        </div>
      </aside>

      {/* Guru Popup */}
      {guruPopup && (
        <div id="guru-popup" className="guru-popup">
            <p>{guruPopup.text}</p>
             <Button variant="outline" size="sm" onClick={() => setGuruPopup(null)} className="mt-4">Close</Button>
        </div>
      )}
    </div>
  );
}

    