import React, { useState, useEffect } from 'react';
import lunarImg from '../../assets/lunar_collection.jpg';
import heroImg from '../../assets/hero_editorial.jpg';
import cosmicStar from '../../assets/cosmic_star.png';

export default function CinematicMobileHero({ onExplore }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute rotation & scale based on scroll
  const rotationAngle = scrollY * 0.18;
  const pieceScale = Math.max(0.85, 1 - scrollY * 0.0006);
  const opacityFade = Math.max(0, 1 - scrollY * 0.0025);

  return (
    <section className="relative w-full h-[95dvh] sm:h-screen overflow-hidden flex flex-col items-center justify-between px-6 py-12 text-center bg-black select-none">
      {/* 1. ATMOSPHERIC ENVIRONMENT: STONE TEXTURE & FOG */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src={heroImg}
          alt="Atmospheric Stone"
          className="w-full h-full object-cover opacity-25 filter grayscale contrast-125"
        />
        {/* Atmospheric Fog Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-white/10 via-transparent to-transparent blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#C0C0C0]/5 blur-3xl rounded-full pointer-events-none" />
      </div>

      {/* 2. TOP BRAND ACCENT */}
      <div
        style={{ opacity: opacityFade }}
        className="relative z-10 space-y-1 pt-4 transition-opacity duration-300"
      >
        <span className="text-[10px] uppercase tracking-[0.45em] text-[#C0C0C0] font-mono block">
          HAUTE JOAILLERIE
        </span>
      </div>

      {/* 3. CENTER: 80% VIEWPORT JEWELRY PIECE WITH ROTATING SPECULAR ACCENT */}
      <div className="relative z-10 w-full max-w-sm flex-1 flex flex-col items-center justify-center my-auto">
        <div
          style={{
            transform: `scale(${pieceScale}) rotate(${rotationAngle}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
          className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center"
        >
          {/* Ambient Rim Glow */}
          <div className="absolute inset-4 rounded-full border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.12)] pointer-events-none" />

          {/* Sculptural Flagship Piece */}
          <img
            src={lunarImg}
            alt="Cosmic Lunar Ring"
            className="w-full h-full object-contain filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.95)] contrast-110"
          />

          {/* Light Reflection Sweep Overlay */}
          <div
            className="absolute inset-0 rounded-full opacity-40 mix-blend-overlay pointer-events-none"
            style={{
              background: `linear-gradient(${135 + rotationAngle}deg, rgba(255,255,255,0.8) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.4) 100%)`,
            }}
          />
        </div>
      </div>

      {/* 4. LOWER EDITORIAL TYPOGRAPHY & EXPLORE CTA */}
      <div
        style={{ opacity: opacityFade }}
        className="relative z-10 space-y-6 pb-6 transition-opacity duration-300 w-full max-w-md"
      >
        <div className="space-y-2">
          <h2 className="font-serif text-3xl sm:text-4xl uppercase tracking-[0.25em] text-white font-light">
            COSMIC
          </h2>
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#A0A0A0] font-light">
            FORGED IN INTENTION
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              if (onExplore) onExplore();
              else {
                const el = document.getElementById('curated-collection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="w-full max-w-xs mx-auto py-4 px-8 chrome-button text-xs uppercase tracking-[0.3em] font-bold rounded-sm shadow-[0_0_25px_rgba(192,192,192,0.35)] cursor-pointer transition-all hover:scale-105"
          >
            Explore Collection
          </button>
        </div>

        <div className="text-[9px] uppercase tracking-[0.3em] text-[#606060] font-mono">
          Milan • Paris • New York • Mumbai
        </div>
      </div>
    </section>
  );
}
