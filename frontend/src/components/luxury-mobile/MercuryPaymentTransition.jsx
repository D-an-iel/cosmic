import React, { useEffect, useState } from 'react';
import ChromeCosmicStar from './ChromeCosmicStar.jsx';

export default function MercuryPaymentTransition({ onComplete }) {
  // Phase 0: Fade to black
  // Phase 1: Liquid Mercury Blob emerges and morphs (0.4s - 1.1s)
  // Phase 2: Mercury snaps into faceted Cosmic Star (1.1s - 1.6s)
  // Phase 3: Halo glow emits & triggers onComplete
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 350);
    const t2 = setTimeout(() => setPhase(2), 1100);
    const t3 = setTimeout(() => {
      setPhase(3);
      if (onComplete) onComplete();
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden font-sans select-none animate-fadeIn">
      {/* Background Deep Specular Void */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,40,40,0.4)_0%,#000000_75%)] pointer-events-none" />

      {/* Floating Mercury Canvas / Morphing Visualizer */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {phase < 2 ? (
          /* Liquid Metal Mercury Morphing Animation */
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* Ambient Mercury Glow */}
            <div className="absolute inset-0 rounded-full bg-white/20 blur-2xl animate-pulse" />

            <svg
              viewBox="0 0 120 120"
              className="w-32 h-32 filter drop-shadow-[0_0_25px_rgba(255,255,255,0.7)] animate-[spin_6s_ease-in-out_infinite]"
            >
              <defs>
                <linearGradient id="mercuryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="25%" stopColor="#D8D8D8" />
                  <stop offset="50%" stopColor="#8E8E8E" />
                  <stop offset="75%" stopColor="#ECECEC" />
                  <stop offset="100%" stopColor="#666666" />
                </linearGradient>
                <filter id="mercuryGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Dynamic Fluid Blob Paths */}
              <path
                d="M 60,18 C 82,16 102,36 100,58 C 98,82 78,102 58,100 C 34,98 18,76 22,54 C 26,30 38,20 60,18 Z"
                fill="url(#mercuryGrad)"
                filter="url(#mercuryGlow)"
                className="transition-all duration-700 ease-in-out"
                style={{
                  transform: phase === 1 ? 'scale(1.1) rotate(45deg)' : 'scale(0.8)',
                  transformOrigin: 'center',
                }}
              />
              <circle cx="50" cy="45" r="14" fill="#FFFFFF" opacity="0.6" filter="blur(2px)" />
            </svg>
          </div>
        ) : (
          /* Snaps into Faceted Chrome Cosmic Star */
          <div className="relative flex items-center justify-center animate-scale-up">
            <ChromeCosmicStar size={96} isRotating={false} pulseTrigger={1} />
          </div>
        )}

        {/* Elegant Typography & Status */}
        <div className="text-center space-y-2">
          <span className="font-serif tracking-[0.3em] text-sm md:text-base text-white uppercase block">
            {phase < 2 ? 'Forging Secure Settlement...' : 'Settlement Confirmed'}
          </span>
          <span className="text-[10px] tracking-[0.35em] text-[#707070] uppercase block font-mono">
            Atelier Escrow Protocol • Liquid Rhodium Verified
          </span>
        </div>
      </div>
    </div>
  );
}
