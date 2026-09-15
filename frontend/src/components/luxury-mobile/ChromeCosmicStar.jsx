import React, { useEffect, useState } from 'react';

export default function ChromeCosmicStar({
  size = 64,
  isRotating = true,
  pulseTrigger = 0,
  isCheckmark = false,
  className = '',
}) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (pulseTrigger > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 240);
      return () => clearTimeout(timer);
    }
  }, [pulseTrigger]);

  return (
    <div
      className={`relative flex items-center justify-center select-none transition-transform duration-500 ease-out ${className}`}
      style={{
        width: size,
        height: size,
        transform: pulse ? 'scale(1.18)' : 'scale(1)',
      }}
    >
      {/* Specular Ambient Glow Halo */}
      <div
        className="absolute inset-0 rounded-full blur-xl pointer-events-none transition-opacity duration-700"
        style={{
          background: isCheckmark
            ? 'radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(255,255,255,0.1) 50%, transparent 80%)'
            : 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(192,192,192,0.12) 50%, transparent 75%)',
          opacity: pulse ? 1 : 0.65,
        }}
      />

      {isCheckmark ? (
        /* Morph into High-Polish Chrome Checkmark */
        <svg
          viewBox="0 0 64 64"
          width={size}
          height={size}
          className="relative z-10 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.6)] animate-fadeIn"
          fill="none"
        >
          <defs>
            <linearGradient id="chromeCheckGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#E2E2E2" />
              <stop offset="70%" stopColor="#A6A6A6" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>
            <radialGradient id="checkGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="32" cy="32" r="28" fill="#0A0A0A" stroke="url(#chromeCheckGrad)" strokeWidth="1.5" />
          <path
            d="M20 33 L28 41 L45 23"
            stroke="url(#chromeCheckGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        /* Faceted Chrome 4-Point Cosmic Star */
        <div
          className={`relative z-10 w-full h-full flex items-center justify-center ${
            isRotating ? 'animate-[spin_18s_linear_infinite]' : ''
          }`}
        >
          <svg
            viewBox="0 0 100 100"
            width={size}
            height={size}
            className="filter drop-shadow-[0_0_12px_rgba(255,255,255,0.35)]"
            fill="none"
          >
            <defs>
              <linearGradient id="facetTopLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#D4D4D4" />
                <stop offset="100%" stopColor="#8C8C8C" />
              </linearGradient>
              <linearGradient id="facetTopRight" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#A8A8A8" />
                <stop offset="100%" stopColor="#666666" />
              </linearGradient>
              <linearGradient id="facetBottomLeft" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8C8C8C" />
                <stop offset="50%" stopColor="#CCCCCC" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
              <linearGradient id="facetBottomRight" x1="100%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#666666" />
                <stop offset="50%" stopColor="#B0B0B0" />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
            </defs>

            {/* Facet 1: North-West */}
            <path d="M 50,4 L 50,50 L 4,50 Z" fill="url(#facetTopLeft)" />
            {/* Facet 2: North-East */}
            <path d="M 50,4 L 96,50 L 50,50 Z" fill="url(#facetTopRight)" />
            {/* Facet 3: South-West */}
            <path d="M 4,50 L 50,50 L 50,96 Z" fill="url(#facetBottomLeft)" />
            {/* Facet 4: South-East */}
            <path d="M 50,50 L 96,50 L 50,96 Z" fill="url(#facetBottomRight)" />

            {/* Center Razor Bevel Lines */}
            <line x1="50" y1="4" x2="50" y2="96" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.8" />
            <line x1="4" y1="50" x2="96" y2="50" stroke="#FFFFFF" strokeWidth="0.8" strokeOpacity="0.8" />

            {/* Center Radiant Core Diamond */}
            <polygon points="50,42 58,50 50,58 42,50" fill="#FFFFFF" opacity="0.9" />
          </svg>
        </div>
      )}
    </div>
  );
}
