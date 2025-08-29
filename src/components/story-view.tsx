"use client";
import { useRef, useEffect, useState } from 'react';
import type { Story, Chapter } from "@/lib/stories";
import { Button } from "./ui/button";
import { ArrowLeft, User, MessageSquare } from "lucide-react";
import Image from 'next/image';
import { DialoguePlayer } from './dialogue-player';
import { Card, CardContent } from './ui/card';

interface StoryViewProps {
  story: Story;
  onBack: () => void;
}

function FadeInOnScroll({ children }: { children: React.ReactNode }) {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      });
    });
    const { current } = domRef;
    if (current) {
      observer.observe(current);
    }
    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {children}
    </div>
  );
}

export function StoryView({ story, onBack }: StoryViewProps) {
  return (
    <div className="w-full h-full relative">
      <Button variant="outline" size="icon" className="fixed top-20 sm:top-6 left-6 z-20 rounded-full" onClick={onBack}>
        <ArrowLeft className="w-5 h-5" />
        <span className="sr-only">Back to Manuscript</span>
      </Button>

      <div className="absolute inset-0 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-16">
          {story.chapters.map((chapter) => (
            <section key={chapter.title} className="space-y-8">
              <FadeInOnScroll>
                <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden shadow-2xl shadow-primary/10">
                  <Image src={chapter.image} alt={chapter.title} fill style={{ objectFit: 'cover' }} data-ai-hint={chapter.dataAiHint} />
                </div>
                <h2 className="font-headline text-5xl mt-8 text-center">{chapter.title}</h2>
              </FadeInOnScroll>
              
              <div className="prose prose-lg dark:prose-invert max-w-none font-body text-foreground/90 text-justify leading-relaxed">
                {chapter.content.map((item, index) => (
                  <FadeInOnScroll key={index}>
                    {typeof item === 'string' ? (
                      <p>{item}</p>
                    ) : (
                      <Card className="my-8 bg-card/50">
                        <CardContent className="p-4 flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div className="bg-primary text-primary-foreground rounded-full p-2">
                               <User className="w-5 h-5"/>
                            </div>
                            <p className="font-headline text-sm mt-1">{item.character}</p>
                          </div>
                          <div className="flex-1 italic pt-1">
                            <MessageSquare className="inline-block w-4 h-4 mr-2 text-primary/50" />
                            "{item.line}"
                          </div>
                          <DialoguePlayer character={item.character} text={item.line} />
                        </CardContent>
                      </Card>
                    )}
                  </FadeInOnScroll>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className="h-32"></div>
      </div>
    </div>
  );
}
