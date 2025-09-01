
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface RamayanaPuppetShowProps {
  onBegin: () => void;
  onBack: () => void;
}

export function RamayanaPuppetShow({ onBegin, onBack }: RamayanaPuppetShowProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const startAutoScroll = () => {
        if (!scrollRef.current) return;
        setIsPlaying(true);
        autoScrollIntervalRef.current = setInterval(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollBy({ top: 1, behavior: 'smooth' });
                 if (scrollRef.current.scrollTop + scrollRef.current.clientHeight >= scrollRef.current.scrollHeight - 5) {
                    stopAutoScroll();
                }
            }
        }, 30);
    };

    const stopAutoScroll = () => {
        if (autoScrollIntervalRef.current) {
            clearInterval(autoScrollIntervalRef.current);
            autoScrollIntervalRef.current = null;
        }
        setIsPlaying(false);
    };

    const handleUserScroll = (event: React.WheelEvent | React.TouchEvent) => {
        // Stop autoscroll only if it's currently active and user interaction is significant
        if (isPlaying && ('deltaY' in event ? Math.abs(event.deltaY) > 0 : true)) {
           stopAutoScroll();
        }
    };
    
    const togglePlay = () => {
      if (isPlaying) {
        stopAutoScroll();
      } else {
        startAutoScroll();
      }
    }

    useEffect(() => {
        // Clean up interval on component unmount
        return () => {
            if (autoScrollIntervalRef.current) {
                clearInterval(autoScrollIntervalRef.current);
            }
        };
    }, []);

  return (
    <div className="w-full h-full bg-[#111] text-white font-headline overflow-hidden relative">
      <Button variant="outline" size="icon" className="absolute top-6 left-6 z-50 rounded-full bg-black/50 text-white border-white/50 hover:bg-white/20" onClick={onBack}>
        <ArrowLeft className="w-5 h-5" />
        <span className="sr-only">Back to Celestial Map</span>
      </Button>
      
      <div 
        ref={scrollRef} 
        className="absolute inset-0 overflow-y-scroll snap-y snap-mandatory"
        onWheel={handleUserScroll}
        onTouchMove={handleUserScroll}
      >
        <div className="h-screen w-full flex flex-col items-center justify-center snap-start relative">
             <div className="absolute z-30 text-center">
                 <h1 className="text-6xl font-bold">The Birth of Rama</h1>
                 <p className="text-2xl mt-4 text-white/80">A Tholpavakoothu Performance</p>
                 <Button onClick={togglePlay} variant="outline" size="lg" className="mt-8 bg-transparent text-white border-white hover:bg-white hover:text-black">
                    {isPlaying ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                    {isPlaying ? "Pause" : "Play Story"}
                 </Button>
             </div>
        </div>
        
        <Scene1 />
        
        <div className="h-screen w-full flex flex-col items-center justify-center snap-start text-center">
            <h2 className="text-4xl">To be continued...</h2>
            <Button onClick={onBack} variant="link" className="text-white text-lg mt-4">Return to the Stars</Button>
        </div>
      </div>
      
       <div className="absolute bottom-6 right-6 z-50">
           <Button onClick={togglePlay} variant="outline" size="icon" className="rounded-full bg-black/50 text-white border-white/50 hover:bg-white/20">
             {isPlaying ? <Pause /> : <Play />}
           </Button>
        </div>
    </div>
  );
}


const Puppet = ({ id, src, alt, animation, className }: { id: string; src: string; alt: string; animation: string; className?: string; }) => (
    <div id={id} className={cn("puppet", className)} style={{ animation }}>
        <Image src={src} alt={alt} width={150} height={300} style={{width: 'auto', height: '100%'}} />
    </div>
);

const Scene1 = () => {
    return (
        <section className="h-[300vh] w-full relative snap-start">
           <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* Layer 1: The Light Source */}
                <div className="divya-light" />
                
                {/* Layer 2: The Screen */}
                <div className="screen" />
                
                {/* Layer 3: The Puppets */}
                <div className="puppet-container">
                    <Puppet id="rama-baby" src="/Rama_baby.png" alt="Baby Rama" animation="fade-in 2s 1s forwards, up-and-down-subtle 4s 3s infinite ease-in-out alternate" />
                    <Puppet id="cot" src="/Cot.png" alt="Cradle" animation="slide-in-bottom 2s 3s forwards, up-and-down-subtle 4s 3s infinite ease-in-out alternate" className="h-[150px]" />
                    <Puppet id="doctor" src="/Doctor.png" alt="Doctor" animation="slide-in-left 3s 5s forwards, up-and-down 3s 5s infinite ease-in-out alternate" className="h-[280px] bottom-10" />
                    
                    <Puppet id="dwarpal-l1" src="/Dwarpal_Left.png" alt="Guard" animation="slide-in-far-left 3s 7s forwards, up-and-down 3.2s 7s infinite ease-in-out alternate" className="h-[350px] left-[15%]" />
                    <Puppet id="dwarpal-l2" src="/Dwarpal_Left.png" alt="Guard" animation="slide-in-far-left 3s 7.5s forwards, up-and-down 2.8s 7.5s infinite ease-in-out alternate" className="h-[350px] left-[5%]" />

                    <Puppet id="dwarpal-r1" src="/Dwarpal_Right.png" alt="Guard" animation="slide-in-far-right 3s 7s forwards, up-and-down 3.1s 7s infinite ease-in-out alternate" className="h-[350px] right-[15%]" />
                    <Puppet id="dwarpal-r2" src="/Dwarpal_Right.png" alt="Guard" animation="slide-in-far-right 3s 7.5s forwards, up-and-down 2.9s 7.5s infinite ease-in-out alternate" className="h-[350px] right-[5%]" />
                    
                    {/* Background depth elements */}
                    <Puppet id="bg-cot1" src="/Cot.png" alt="Background Cot" animation="fade-in-bg 4s 8s forwards" className="h-[120px] left-[2%] bottom-[25%] z-[1]" />
                    <Puppet id="bg-cot2" src="/Cot.png" alt="Background Cot" animation="fade-in-bg 4s 8.5s forwards" className="h-[120px] left-[18%] bottom-[28%] z-[1]" />
                    <Puppet id="bg-cot3" src="/Cot.png" alt="Background Cot" animation="fade-in-bg 4s 9s forwards" className="h-[120px] right-[8%] bottom-[22%] z-[1]" />
                </div>
           </div>
           
           {/* Sounds - Using hidden audio elements controlled by animation delays would be complex.
               For a real app, a library like Howler.js synced to scroll position would be better.
               This is a visual-only implementation based on the prompt. */}
            
            <style jsx>{`
                .screen {
                    position: absolute;
                    inset: 0;
                    background-color: #f5f5dc; // Beige color for the cloth
                    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4d5eXlzc3OLi4ubm5uVlZWYmJilpaW8vLzLysyBoIsoBgabw8/Vq7e5g5vNs8Tf0c/g1dLh1tPj2dTg1tXj2dbm3Nfn3dzz8/MAAAAAwElEQVR42mJgAAJGEMgCRYqi40wMsqalpZ6dnpEAKGMjOEaFh8e2Z0rP3i0gGfAM2LY2V1iZeLS4mPvsAsMYgT1iYaLg3dxZ3sVdwgUaAZs2fPz9R2+cn3j38gXGOrYpJEKx3Abt4gZJ4zY2NhEkDeMymsFw2M0wOJjRmLCY4AJBpxFQNjNm4yY8glcIwSMEgZgQxEMwVBhRhvVjENQwYyIXIQrGDrIqCCAMwMbtgpwIRgKGhgAAucA6jWJOMdsAAAAASUVORK5CYII=');
                    mix-blend-mode: lighten;
                    opacity: 0;
                    z-index: 10;
                    animation: fade-in 3s 2s forwards;
                }

                .divya-light {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 1200px;
                    height: 1200px;
                    background: radial-gradient(circle, rgba(255, 200, 150, 0.8) 0%, rgba(255, 255, 255, 0) 60%);
                    z-index: 1;
                    animation: flicker 2.5s ease-in-out infinite alternate, fade-in 2s 1.5s forwards;
                    opacity: 0;
                }
                
                .puppet-container {
                   position: absolute;
                   inset: 0;
                   z-index: 5;
                }

                .puppet {
                    position: absolute;
                    bottom: -400px; /* Start off-screen */
                    left: 50%;
                    transform: translateX(-50%);
                    height: 300px; /* Base height */
                    filter: drop-shadow(5px 5px 15px rgba(0, 0, 0, 0.6));
                    opacity: 0;
                    z-index: 5;
                }
                
                .puppet > :global(img) {
                    width: auto;
                    height: 100%;
                }

                @keyframes fade-in {
                    to { opacity: 1; }
                }
                @keyframes fade-in-bg {
                   to { opacity: 0.6; }
                }

                @keyframes slide-in-bottom {
                    from { bottom: -400px; opacity: 0; }
                    to { bottom: 20px; opacity: 1; }
                }
                
                @keyframes slide-in-left {
                    from { left: -200px; opacity: 0; }
                    to { left: 30%; opacity: 1; }
                }
                
                @keyframes slide-in-far-left {
                   from { left: -200px; opacity: 0; }
                   to { opacity: 1; }
                }
                @keyframes slide-in-far-right {
                   from { right: -200px; opacity: 0; }
                   to { opacity: 1; }
                }


                @keyframes flicker {
                    0%, 100% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 0.8;
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.05);
                        opacity: 1;
                    }
                }
                
                #rama-baby {
                    height: 80px;
                    bottom: 50%;
                    z-index: 20;
                }
                
                #cot {
                    z-index: 15;
                }
                
                @keyframes up-and-down {
                    from { transform: translate(-50%, 0); }
                    to { transform: translate(-50%, -40px); }
                }

                @keyframes up-and-down-subtle {
                    from { transform: translate(-50%, 0); }
                    to { transform: translate(-50%, -10px); }
                }
                
                /* This is a simple visual trick. For a real app, use JS to sync animations */
                .puppet {
                   animation-name: puppet-flicker;
                   animation-timing-function: ease-in-out;
                   animation-iteration-count: infinite;
                   animation-direction: alternate;
                }

                @keyframes puppet-flicker {
                    0%, 100% {
                        filter: brightness(0.9) drop-shadow(5px 5px 15px rgba(0,0,0,0.6));
                    }
                    50% {
                        filter: brightness(1.1) drop-shadow(8px 8px 20px rgba(0,0,0,0.8));
                    }
                }
            `}</style>
        </section>
    );
}
