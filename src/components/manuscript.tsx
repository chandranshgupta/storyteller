
"use client";

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
import { BookOpen, ArrowLeft } from "lucide-react";

interface ManuscriptProps {
  story: Story;
  onBegin: () => void;
  onBack: () => void;
}

export function Manuscript({ story, onBegin, onBack }: ManuscriptProps) {
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
        <CardContent className="flex-1 min-y-0 overflow-y-auto p-4 md:p-6 text-center">
            <p className="text-muted-foreground">Prepare to immerse yourself in the epic tale.</p>
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
