
"use client";

import { useState, useRef, useEffect } from "react";
import { characterDrivenNarration } from "@/ai/flows/character-driven-narration";
import { useToast } from "@/hooks/use-toast";
import { Volume2, LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface DialoguePlayerProps {
  character: string;
  text: string;
}

export function DialoguePlayer({ character, text }: DialoguePlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const handlePlay = async () => {
    if (isLoading) return;
    
    if (audioUrl) {
      audioRef.current?.play();
      return;
    }

    setIsLoading(true);
    try {
      const result = await characterDrivenNarration({
        characterName: character,
        dialogue: text,
      });
      setAudioUrl(result.media);
    } catch (error) {
      console.error("Narration failed:", error);
      toast({
        title: "Narration Error",
        description: "Could not generate audio for this dialogue.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  }, [audioUrl]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePlay}
            disabled={isLoading}
            className="text-foreground/70 hover:text-foreground"
            aria-label="Play narration"
          >
            {isLoading ? (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Hear narration</p>
        </TooltipContent>
      </Tooltip>
      {audioUrl && <audio ref={audioRef} src={audioUrl} hidden />}
    </TooltipProvider>
  );
}
