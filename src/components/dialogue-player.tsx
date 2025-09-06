
"use client";

import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Volume2, LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { functions } from "@/lib/firebase";
import { httpsCallable } from "firebase/functions";

interface DialoguePlayerProps {
  character: string;
  text: string;
}

const generateNarration = httpsCallable(functions, 'generateNarration');

export function DialoguePlayer({ character, text }: DialoguePlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handlePlay = async () => {
    if (isLoading) return;
    
    // If we already have the URL, just play it.
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      return;
    }

    setIsLoading(true);
    try {
      // Securely call our Firebase Function
      const result: any = await generateNarration({ text_to_speak: text });
      const newAudioUrl = result.data.audioUrl;
      setAudioUrl(newAudioUrl);
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

  // Effect to play audio once the URL is set
  useEffect(() => {
    if (audioUrl) {
        if (!audioRef.current) {
            audioRef.current = new Audio(audioUrl);
        } else {
            audioRef.current.src = audioUrl;
        }
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
            className="text-foreground/70 hover:text-foreground inline-block ml-2"
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
      {/* The Audio element is now created programmatically and not rendered */}
    </TooltipProvider>
  );
}
