import React, { useState, useEffect, useRef } from 'react';
import cosmicRing from '../assets/cosmic_ring.png';
import cosmicStar from '../assets/cosmic_star.png';

/**
 * Premium Cinematic Intro Sequence for COSMIC (Haute Joaillerie)
 * Borderless, Box-Free, Crisp Alpha Rendering (~4.0s):
 * 1. Black screen (0.0s - 0.2s)
 * 2. Thin chrome light streak enters and sweeps the orbit (0.2s - 0.55s)
 * 3. Pure 3D chrome orbital ring forms dynamically from streak (0.55s - 1.1s)
 * 4. Specular chrome reflection travels across the ring (1.1s - 1.5s)
 * 5. Four-point celestial star emerges with diamond glint (1.5s - 1.9s)
 * 6. Hold completed emblem briefly in poise (1.9s - 2.15s)
 * 7. Fade in text "COSMIC" (2.15s - 2.4s)
 * 8. Gradually increase letter spacing "C O S M I C" (2.4s - 2.7s)
 * 9. Polished chrome reflection sweeps across text (2.7s - 2.95s)
 * 10. Display tagline "Wear The Universe" (2.95s - 3.3s)
 * 11. Hold composition (3.3s - 3.6s)
 * 12. Scale composition slightly smaller & move upward (3.6s - 3.9s)
 * 13. Fade into homepage content (3.9s - 4.3s)
 */
export default function CinematicIntro({ onComplete }) {
  const [phase, setPhase] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);
  const timersRef = useRef([]);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const handleSkip = React.useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setFadingOut(true);
    setTimeout(() => {
      if (onCompleteRef.current) onCompleteRef.current();
    }, 280);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') handleSkip();
    };
    window.addEventListener('keydown', onKeyDown);

    const addTimer = (fn, delayMs) => {
      const timer = setTimeout(fn, delayMs);
      timersRef.current.push(timer);
      return timer;
    };

    // 1. Black screen -> 2. Chrome streak enters (200ms)
    addTimer(() => setPhase(1), 200);

    // 3. Orbital ring forms from streak (550ms)
    addTimer(() => setPhase(2), 550);

    // 4. Metallic reflection travels across ring (1100ms)
    addTimer(() => setPhase(3), 1100);

    // 5. Four-point star appears with glint (1500ms)
    addTimer(() => setPhase(4), 1500);

    // 6. Hold completed logo briefly (1900ms)
    addTimer(() => setPhase(5), 1900);

    // 7. Fade in text "COSMIC" (2150ms)
    addTimer(() => setPhase(6), 2150);

    // 8. Expand letter spacing: C O S M I C (2400ms)
    addTimer(() => setPhase(7), 2400);

    // 9. Chrome reflection sweeps across text (2700ms)
    addTimer(() => setPhase(8), 2700);

    // 10. Display tagline: "Wear The Universe" (2950ms)
    addTimer(() => setPhase(9), 2950);

    // 11. Hold composition (3300ms)
    addTimer(() => setPhase(10), 3300);

    // 12. Scale smaller & move upward (3600ms)
    addTimer(() => setPhase(11), 3600);

    // 13. Fade into homepage (~3.9s - 4.0s)
    addTimer(() => {
      setFadingOut(true);
      setPhase(12);
    }, 3900);

    // Complete unmount (4300ms)
    addTimer(() => {
      if (onCompleteRef.current) onCompleteRef.current();
    }, 4300);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [handleSkip]);

  return (
    <div
      className={`fixed inset-0 z-[110] bg-[#000000] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-400 pointer-events-none select-none ${
        fadingOut ? 'opacity-0' : 'opacity-100'
      }`}
      aria-label="Cosmic Brand Cinematic Intro"
    >
      {/* Subtle Ambient Radial Spotlight (True Luxury Tone) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,_rgba(255,255,255,0.04)_0%,_transparent_65%)] pointer-events-none" />

      {/* Main Composition Container - Open & Unconstrained */}
      <div
        className="relative z-10 flex flex-col items-center justify-center transition-all duration-450 ease-out"
        style={{
          transform:
            phase >= 11
              ? 'scale(0.92) translateY(-24px)'
              : 'scale(1) translateY(0)',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* ========================================================= */}
        {/* BORDERLESS EMBLEM COMPOSITION (Ring + Star)               */}
        {/* ========================================================= */}
        <div className="relative w-72 h-72 sm:w-88 sm:h-88 md:w-96 md:h-96 flex items-center justify-center overflow-visible">
          
          {/* LAYER 1: ORBITAL RING (Pure transparent PNG, no boxes, no blur patches) */}
          <img
            src={cosmicRing}
            alt=""
            className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-all duration-500 ease-out ${
              phase >= 2 ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              // Specular brightness gleam in Phase 3
              filter:
                phase === 3
                  ? 'brightness(1.35) drop-shadow(0 0 10px rgba(255,255,255,0.45))'
                  : 'brightness(1)',
              transition: 'filter 0.4s ease-in-out, opacity 0.5s ease-out',
            }}
          />

          {/* LAYER 2: CHROME LIGHT STREAK SVG (Sweeps freely across orbit) */}
          <svg
            viewBox="0 0 736 736"
            className={`absolute inset-0 w-full h-full pointer-events-none overflow-visible transition-opacity duration-300 ${
              phase >= 1 && phase <= 2 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <defs>
              <linearGradient id="streakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                <stop offset="25%" stopColor="#E5E5E5" stopOpacity="0.9" />
                <stop offset="65%" stopColor="#A0A0A0" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#666666" stopOpacity="0" />
              </linearGradient>
              <filter id="streakGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ellipse matching orbital trajectory */}
            <ellipse
              cx="410"
              cy="410"
              rx="270"
              ry="85"
              transform="rotate(-23 410 410)"
              fill="none"
              stroke="url(#streakGradient)"
              strokeWidth="2.8"
              strokeLinecap="round"
              filter="url(#streakGlow)"
              style={{
                strokeDasharray: '300 1200',
                strokeDashoffset:
                  phase === 0 ? '1200' :
                  phase === 1 ? '750' :
                  phase === 2 ? '0' : '0',
                transition: 'stroke-dashoffset 0.58s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          </svg>

          {/* LAYER 3: FOUR-POINT CELESTIAL STAR (Pure transparent PNG, appears in Phase 4) */}
          <img
            src={cosmicStar}
            alt="Cosmic Star"
            className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-all duration-350 ease-out ${
              phase >= 4
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-75'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          {/* PINPOINT STAR GLINT (Flashes at nexus in Phase 4) */}
          <div
            className={`absolute pointer-events-none transition-all duration-350 ${
              phase === 4
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-50'
            }`}
            style={{
              top: '54.2%',
              left: '64.1%',
              transform: 'translate(-50%, -50%)',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 sm:w-20 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 sm:h-20 w-[1.5px] bg-gradient-to-b from-transparent via-white to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,1)]" />
          </div>
        </div>

        {/* ========================================================= */}
        {/* BRAND TYPOGRAPHY & EXPANDING KERNING                      */}
        {/* ========================================================= */}
        <div className="flex flex-col items-center text-center mt-2">
          
          {/* Brand Name "COSMIC" (Phases 6 - 8) */}
          <div
            className={`transition-opacity duration-300 ease-out relative overflow-hidden ${
              phase >= 6 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <h1
              className="font-aileron font-normal text-3xl sm:text-4xl md:text-5xl uppercase tracking-[0.2em] transition-all duration-450 chrome-gradient-text select-none"
              style={{
                letterSpacing: phase >= 7 ? '0.58em' : '0.2em',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              COSMIC
            </h1>

            {/* Specular Chrome Sweep across text (Phase 8) */}
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-200 ${
                phase >= 8 ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div
                className="w-full h-full"
                style={{
                  background:
                    'linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.7) 50%, transparent 75%)',
                  mixBlendMode: 'color-dodge',
                  transform: phase >= 8 ? 'translateX(120%)' : 'translateX(-120%)',
                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>
          </div>

          {/* Hairline Divider & Tagline "Wear The Universe" (Phase 9 - 11) */}
          <div
            className={`transition-all duration-400 ease-out flex flex-col items-center mt-2.5 ${
              phase >= 9
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2'
            }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="w-16 sm:w-20 h-[1px] bg-gradient-to-r from-transparent via-[#C0C0C0]/40 to-transparent mb-2" />
            <p className="font-aileron text-xs sm:text-sm tracking-[0.32em] text-[#A0A0A0] font-light uppercase select-none">
              Wear The Universe
            </p>
          </div>
        </div>
      </div>

      {/* Discreet Luxury Skip Control */}
      <button
        onClick={handleSkip}
        className="pointer-events-auto absolute bottom-6 right-8 z-50 text-[10px] tracking-[0.28em] text-[#555555] hover:text-[#C0C0C0] uppercase font-aileron transition-colors duration-300 cursor-pointer focus:outline-none"
        aria-label="Skip Cinematic Intro"
      >
        Skip [esc]
      </button>
    </div>
  );
}
