
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import type { Story } from "@/lib/stories";
import { LoaderCircle, BookOpen, ArrowLeft } from "lucide-react";
import { narrateFromHeroPOV } from "@/ai/flows/heros-pov";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "./ui/scroll-area";
import { KingChessPieceIcon } from "./icons/king-chess-piece";
import { QueenChessPieceIcon } from "./icons/queen-chess-piece";
import { cn } from "@/lib/utils";

interface ManuscriptProps {
  story: Story;
  onBegin: () => void;
  onBack: () => void;
}

export function Manuscript({ story, onBegin, onBack }: ManuscriptProps) {
  const [selectedHero, setSelectedHero] = useState<string>("");
  const [povText, setPovText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGeneratePov = async (hero: string) => {
    if (!hero) {
      toast({
        title: "Select a Character",
        description: "Please choose a character to see their point of view.",
        variant: "destructive",
      });
      return;
    }
    setSelectedHero(hero);
    setIsGenerating(true);
    setPovText("");
    try {
      const result = await narrateFromHeroPOV({
        storySummary: story.summary,
        heroName: hero,
      });
      setPovText(result.narration);
    } catch (error) {
      console.error("POV generation failed:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate the character's perspective.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Assign king/queen to characters, assuming 2-4 characters
  const characterRoles = story.characters.map((char, index) => {
      if (index === 0) return { char, role: 'king' as const, Icon: KingChessPieceIcon };
      if (index === 1) return { char, role: 'queen' as const, Icon: QueenChessPieceIcon };
      if (index === 2) return { char, role: 'king' as const, Icon: KingChessPieceIcon };
      return { char, role: 'queen' as const, Icon: QueenChessPieceIcon };
  })

  return (
    <div className="w-full h-full flex items-center justify-center p-4 sm:p-8 relative">
       <Button variant="ghost" size="icon" className="absolute top-4 left-4 z-10" onClick={onBack}>
        <ArrowLeft />
        <span className="sr-only">Back to Celestial Map</span>
      </Button>
      <Card className="w-full max-w-3xl max-h-full flex flex-col animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-4xl">{story.title}</CardTitle>
          <CardDescription className="font-body text-base pt-2">{story.summary}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 min-y-0 overflow-y-auto p-4 md:p-6 space-y-6">
          <div className="bg-primary/5 p-4 rounded-lg border">
            <h3 className="font-headline text-xl mb-4 text-center">Whose Point of View?</h3>
            <div className="flex gap-4 items-center justify-center">
              {characterRoles.map(({char, Icon, role}) => (
                <button
                    key={char}
                    onClick={() => handleGeneratePov(char)}
                    disabled={isGenerating}
                    className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg transition-all duration-300",
                        selectedHero === char ? 'bg-accent scale-110' : 'hover:bg-accent/50',
                    )}
                >
                    <Icon className="w-12 h-12 text-primary" />
                    <span className="font-headline text-sm">{char}</span>
                </button>
              ))}
            </div>

            {isGenerating && (
                <div className="flex justify-center items-center h-48 mt-4">
                    <LoaderCircle className="animate-spin text-primary" size={32} />
                </div>
            )}
            
            {povText && (
                <ScrollArea className="h-48 mt-4">
                  <p className="font-body text-sm whitespace-pre-wrap p-4 bg-background rounded-md">
                    {povText}
                  </p>
                </ScrollArea>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row justify-center gap-4 p-6">
          <Button onClick={onBegin} size="lg">
            <BookOpen className="mr-2" />
            Begin the Journey
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
