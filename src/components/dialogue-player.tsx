
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

interface DialoguePlayerProps {
  character: string;
  text: string;
}

const NARRATION_FUNCTION_URL = 'https://us-central1-nakshatra-narratives.cloudfunctions.net/generateNarration';

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
      // Securely call our Firebase Function via HTTP
      const response = await fetch(NARRATION_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: { text_to_speak: text } }), // Functions expect a 'data' wrapper
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'The narration service failed.');
      }
      
      const result = await response.json();
      const newAudioUrl = result.result?.audioUrl; // onCall functions wrap response in 'result'

      if (!newAudioUrl) {
          throw new Error("The narration service returned an invalid response.");
      }
      
      setAudioUrl(newAudioUrl);

    } catch (error: any) {
      console.error("Narration failed:", error);
      toast({
        title: "Narration Error",
        description: error.message || "Could not generate audio for this dialogue.",
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
