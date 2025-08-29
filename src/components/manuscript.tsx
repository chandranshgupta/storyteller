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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { Story } from "@/lib/stories";
import { LoaderCircle, BookOpen, ArrowLeft } from "lucide-react";
import { narrateFromHeroPOV } from "@/ai/flows/heros-pov";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";

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

  const handleGeneratePov = async () => {
    if (!selectedHero) {
      toast({
        title: "Select a Character",
        description: "Please choose a character to see their point of view.",
        variant: "destructive",
      });
      return;
    }
    setIsGenerating(true);
    setPovText("");
    try {
      const result = await narrateFromHeroPOV({
        storySummary: story.summary,
        heroName: selectedHero,
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
            <h3 className="font-headline text-xl mb-4">Hero's Point of View</h3>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Select onValueChange={setSelectedHero} value={selectedHero}>
                <SelectTrigger className="w-full sm:w-[200px] flex-shrink-0">
                  <SelectValue placeholder="Select a Character" />
                </SelectTrigger>
                <SelectContent>
                  {story.characters.map((char) => (
                    <SelectItem key={char} value={char}>
                      {char}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleGeneratePov} disabled={isGenerating} className="w-full sm:w-auto">
                {isGenerating ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Generate Perspective"
                )}
              </Button>
            </div>
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
