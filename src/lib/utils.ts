import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Preloads a video file by creating a link element with rel="preload".
 * This hints the browser to fetch the video in the background.
 * @param src The source URL of the video to preload.
 */
export function preloadVideo(src: string) {
  // Ensure this only runs on the client
  if (typeof window === 'undefined') {
    return;
  }
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'video';
  link.href = src;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}
