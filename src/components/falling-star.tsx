
"use client";

import { useEffect } from 'react';

interface FallingStarProps {
  onAnimationComplete: () => void;
}

export function FallingStar({ onAnimationComplete }: FallingStarProps) {
  useEffect(() => {
    const timer = setTimeout(onAnimationComplete, 1500); // Must match animation duration
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <>
      <div className="fixed inset-0 z-50 pointer-events-none">
        <div className="star" />
      </div>
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateX(-100vw) translateY(-20vh) scale(0.5);
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100vw) translateY(80vh) scale(1.5);
            opacity: 0;
          }
        }
        .star {
          position: absolute;
          top: 0;
          left: 0;
          width: 5px;
          height: 5px;
          background: radial-gradient(circle, #fff 20%, rgba(255, 255, 255, 0) 100%);
          border-radius: 50%;
          box-shadow: 0 0 15px 5px #fff, 0 0 30px 10px #D2B48C, 0 0 50px 15px #42352A;
          animation: fall 1.5s ease-in forwards;
        }
        .star::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 150%;
            height: 2px;
            background: linear-gradient(to right, rgba(255,255,255,0.8), rgba(255,255,255,0));
            transform-origin: left;
            transform: rotate(-45deg) translateX(-50%);
        }
      `}</style>
    </>
  );
}
