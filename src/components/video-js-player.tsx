
"use client";

import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import type { VideoJsPlayer, VideoJsPlayerOptions } from 'video.js';

interface VideoJsPlayerProps {
  options: VideoJsPlayerOptions;
  onReady?: (player: VideoJsPlayer) => void;
}

export const VideoJsPlayer: React.FC<VideoJsPlayerProps> = ({ options, onReady }) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<VideoJsPlayer | null>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current?.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, options, () => {
        player.log('player is ready');
        onReady && onReady(player);
      });
    
    // You can update player options here since the player is initialized
    } else {
      const player = playerRef.current;
      if (player) {
        player.autoplay(options.autoplay || false);
        player.src(options.sources || []);
        if (options.poster) {
          player.poster(options.poster);
        }
      }
    }
  }, [options, onReady]);

  // Dispose the Video.js player when the component unmounts
  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};
