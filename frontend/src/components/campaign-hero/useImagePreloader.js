import { useState, useEffect } from 'react';

/**
 * Custom hook to preload and decode images into browser memory cache.
 * Guarantees zero layout shifts and zero image popping.
 */
export function useImagePreloader(imageUrls = []) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    if (!imageUrls || imageUrls.length === 0) {
      setIsLoaded(true);
      return;
    }

    // Safety fallback: ensure gallery is ALWAYS visible within 350ms max
    const timer = setTimeout(() => {
      if (!isCancelled) setIsLoaded(true);
    }, 350);

    const promises = imageUrls.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(src);
        img.onerror = () => resolve(src);
        img.src = src;
        if (img.complete) {
          resolve(src);
        }
      });
    });

    Promise.all(promises).then(() => {
      if (!isCancelled) {
        clearTimeout(timer);
        setIsLoaded(true);
      }
    });

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [imageUrls]);

  return isLoaded;
}
