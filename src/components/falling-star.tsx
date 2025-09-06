
"use client";

import { useEffect } from 'react';

interface FallingStarProps {
  onAnimationComplete: () => void;
}

export function FallingStar({ onAnimationComplete }: FallingStarProps) {
  useEffect(() => {
    const timer = setTimeout(onAnimationComplete, 1500); // Match animation duration
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <>
      <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
        <div className="star-container">
          <div className="star" />
        </div>
        <div className="flash" />
      </div>
      <style jsx>{`
        @keyframes zoom-in-and-flare {
          0% {
            transform: translateZ(-2000px) scale(0.1);
            opacity: 0;
          }
          70% {
            transform: translateZ(0px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateZ(50px) scale(50);
            opacity: 0;
          }
        }
        
        @keyframes screen-flash {
          0%, 65% {
            opacity: 0;
          }
          75% {
            opacity: 0.9;
          }
          100% {
            opacity: 0;
          }
        }

        .star-container {
            position: absolute;
            top: 50%;
            left: 50%;
            perspective: 800px;
        }

        .star {
          position: absolute;
          top: 0;
          left: 0;
          width: 8px;
          height: 8px;
          background: radial-gradient(circle, #fff 30%, rgba(255, 255, 255, 0) 100%);
          border-radius: 50%;
          box-shadow: 0 0 15px 5px #fff, 0 0 30px 10px #D2B48C, 0 0 50px 15px #42352A;
          animation: zoom-in-and-flare 1.5s ease-in forwards;
          transform-style: preserve-3d;
        }
        
        .flash {
            position: absolute;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: #FAF8F2; /* Manuscript background color */
            animation: screen-flash 1.5s ease-out forwards;
        }
      `}</style>
    </>
  );
}
