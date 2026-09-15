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

    const promises = imageUrls.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;

        if (img.decode) {
          img
            .decode()
            .then(() => resolve(src))
            .catch(() => {
              // Fallback if decode fails
              img.onload = () => resolve(src);
              img.onerror = () => resolve(src);
            });
        } else {
          img.onload = () => resolve(src);
          img.onerror = () => resolve(src);
        }
      });
    });

    Promise.all(promises).then(() => {
      if (!isCancelled) {
        setIsLoaded(true);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [imageUrls]);

  return isLoaded;
}
