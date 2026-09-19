import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroHdMaster from '../../assets/hero_hd_master.webp';

export default function HeroBanner() {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth luxury vitrine mouse parallax
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={(e) => {
        setIsHovered(true);
        handleMouseMove(e);
      }}
      onMouseLeave={handleMouseLeave}
      className="relative w-full bg-black select-none overflow-hidden font-aileron flex flex-col items-center justify-center pt-0 pb-0 sm:pb-8"
    >
      {/* Immersive Luxury Hero Showcase: 72vh on mobile for editorial impact, 2752x1536 aspect on desktop */}
      <div className="relative w-full max-w-[1920px] h-[68vh] min-h-[460px] max-h-[620px] sm:h-auto sm:aspect-[2752/1536] sm:min-h-[500px] md:min-h-[580px] max-h-[92vh] overflow-hidden">
        
        {/* Alive Parallax & Breathing Layer */}
        <div 
          className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out will-change-transform cosmic-hero-breathing"
          style={{
            transform: isHovered 
              ? `scale(1.018) translate3d(${mousePos.x * -8}px, ${mousePos.y * -6}px, 0px) rotateX(${mousePos.y * 1.2}deg) rotateY(${mousePos.x * -1.2}deg)`
              : 'scale(1.0)',
            transformStyle: 'preserve-3d',
            perspective: 1200,
          }}
        >
          {/* 1. Ultra-HD Master Showcase Image (Crystal Clear 4K, centered editorial focus) */}
          <img
            src={heroHdMaster}
            alt="COSMIC Haute Joaillerie — Forged In Intention"
            className="w-full h-full object-cover object-center pointer-events-none filter contrast-[1.03] brightness-[1.01]"
            loading="eager"
            fetchPriority="high"
          />

          {/* 2. Subtle Luxury Silver Light Sheen (Simulates studio light drifting across precious metals) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen opacity-40">
            <div className="cosmic-silver-sheen w-[40%] h-full bg-gradient-to-r from-transparent via-white/12 to-transparent skew-x-[-22deg]" />
          </div>
        </div>

        {/* 3. Interactive CTA Button Overlay precisely aligned over 'SHOP COLLECTION ->' */}
        <Link
          to="/collections"
          id="hero-shop-collection-btn"
          aria-label="Shop Collection"
          className="absolute z-20 cursor-pointer group focus:outline-none left-1/2 -translate-x-1/2 top-[53.2%] sm:top-[54.2%] w-44 sm:w-[17%] h-10 sm:h-[6%] min-h-[40px] flex items-center justify-center"
        >
          {/* Translucent luxury hover border and subtle glint */}
          <div className="w-full h-full border border-white/0 group-hover:border-white/40 group-active:border-white/60 group-hover:bg-white/[0.06] transition-all duration-300 rounded-none shadow-[0_0_15px_rgba(255,255,255,0)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center">
            <span className="sr-only">Shop Collection</span>
          </div>
        </Link>

        {/* 4. Bottom Ambient Dark Fade merging seamlessly into solid #000000 */}
        <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-48 md:h-60 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none z-10" />

        {/* 5. Minimal Editorial "Scroll to Explore" Cue */}
        <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity duration-300">
          <span className="text-[8.5px] sm:text-[10px] uppercase tracking-[0.3em] text-[#a0a0a0] font-mono">
            Scroll to explore
          </span>
          <div className="w-[1px] h-3 sm:h-4 bg-gradient-to-b from-[#888] to-transparent animate-pulse" />
        </div>
      </div>

      {/* Embedded High-End CSS Animations */}
      <style>{`
        /* Slow continuous luxury vitrine breathing */
        @keyframes subtleBreathing {
          0% {
            transform: scale(1.002) translateY(0px);
          }
          50% {
            transform: scale(1.015) translateY(-2px);
          }
          100% {
            transform: scale(1.002) translateY(0px);
          }
        }

        .cosmic-hero-breathing {
          animation: subtleBreathing 14s ease-in-out infinite alternate;
        }

        /* Ambient light sheen sweeping across silver jewelry every 12 seconds */
        @keyframes silverSheenSweep {
          0% {
            transform: translateX(-150%);
            opacity: 0;
          }
          20% {
            opacity: 0.6;
          }
          40% {
            transform: translateX(350%);
            opacity: 0;
          }
          100% {
            transform: translateX(350%);
            opacity: 0;
          }
        }

        .cosmic-silver-sheen {
          animation: silverSheenSweep 12s cubic-bezier(0.25, 1, 0.5, 1) infinite;
        }
      `}</style>
    </section>
  );
}

