import { Sparkles } from "lucide-react";

export function AppHeader() {
  return (
    <header className="w-full p-4 border-b border-white/10 flex items-center justify-center absolute top-0 left-0 z-20 bg-transparent">
      <div className="flex items-center gap-2 text-foreground">
        <Sparkles className="w-6 h-6" />
        <h1 className="text-2xl font-headline tracking-widest">
          Nakshatra Narratives
        </h1>
      </div>
    </header>
  );
}
