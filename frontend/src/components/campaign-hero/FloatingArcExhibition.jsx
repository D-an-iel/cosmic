import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

import ringHeroImg from '../../assets/lunar_ring_hero.jpg';
import eclipseImg from '../../assets/eclipse_collection.jpg';
import novaImg from '../../assets/nova_collection.jpg';
import lunarImg from '../../assets/lunar_collection.jpg';
import ringAngleImg from '../../assets/lunar_ring_angle.jpg';
import ringMacroImg from '../../assets/lunar_ring_macro.jpg';

const EXHIBITION_PIECES = [
  {
    id: "34bbdbad-11bb-4ffc-a641-dae851c1ad52",
    slug: "lunar-silver-ring",
    name: "Lunar Silver Ring",
    material: "Solid 925 Sterling Silver",
    finish: "Liquid Rhodium Finish",
    price: 799,
    image: ringHeroImg,
    aspect: "aspect-[4/5]",
  },
  {
    id: "celestial-pendant-001",
    slug: "celestial-pendant",
    name: "Celestial Star Pendant",
    material: "Solid 925 Sterling Silver",
    finish: "Hand-Beveled Mirror Polish",
    price: 1299,
    image: eclipseImg,
    aspect: "aspect-[4/5]",
  },
  {
    id: "stellar-chain-002",
    slug: "stellar-chain",
    name: "Stellar Curb Chain",
    material: "Solid 925 Sterling Silver",
    finish: "High Gloss Diamond Cut",
    price: 1499,
    image: novaImg,
    aspect: "aspect-[4/5]",
  },
  {
    id: "orbit-bracelet-003",
    slug: "orbit-bracelet",
    name: "Orbit Liquid Bangle",
    material: "Solid 925 Sterling Silver",
    finish: "Ergonomic Liquid Rhodium",
    price: 999,
    image: lunarImg,
    aspect: "aspect-[4/5]",
  },
  {
    id: "nova-eclipse-ring-004",
    slug: "nova-eclipse-ring",
    name: "Nova Geometric Studs",
    material: "Solid 925 Sterling Silver",
    finish: "Mirror Silver & Shadow Bevel",
    price: 649,
    image: ringAngleImg,
    aspect: "aspect-[4/5]",
  },
  {
    id: "cosmic-signature-pendant-005",
    slug: "cosmic-signature-pendant",
    name: "Cosmic Signature Piece",
    material: "Solid 925 Sterling Silver",
    finish: "Haute Joaillerie Atelier Cast",
    price: 1599,
    image: ringMacroImg,
    aspect: "aspect-[4/5]",
  },
];

export default function FloatingArcExhibition() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(2); // Center piece (Stellar Chain)
  const [activatedPiece, setActivatedPiece] = useState(null); // When center piece is tapped for caption
  const containerRef = useRef(null);

  const [windowWidth, setWindowWidth] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth : 1200;
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const spacing = isMobile ? 210 : 310;
  const baseWidth = isMobile ? 220 : 310;

  // Spring position driver for smooth physical gliding
  const springOffset = useSpring(activeIndex, {
    stiffness: 140,
    damping: 24,
    mass: 0.9,
  });

  const [currentVirtualOffset, setCurrentVirtualOffset] = useState(activeIndex);

  useEffect(() => {
    springOffset.set(activeIndex);
  }, [activeIndex, springOffset]);

  useEffect(() => {
    const unsubscribe = springOffset.on('change', (latest) => {
      setCurrentVirtualOffset(latest);
    });
    return () => unsubscribe();
  }, [springOffset]);

  // Inertial momentum drag handling (Push -> Drift -> Settle)
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartIndexRef = useRef(activeIndex);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);

  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    dragStartIndexRef.current = currentVirtualOffset;
    lastXRef.current = dragStartXRef.current;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    setActivatedPiece(null); // Dismiss caption on drag
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - dragStartXRef.current;
    const now = performance.now();
    const dt = now - lastTimeRef.current;

    if (dt > 10) {
      velocityRef.current = (clientX - lastXRef.current) / dt;
      lastXRef.current = clientX;
      lastTimeRef.current = now;
    }

    // Direct translation with slight resistance at ends
    const newVirtual = dragStartIndexRef.current - deltaX / spacing;
    springOffset.set(newVirtual);
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    // Apply inertial velocity momentum (Push -> Drift -> Settle)
    const velocity = velocityRef.current; // px per ms
    const projectedOffset = currentVirtualOffset - velocity * 0.45;
    const targetNearest = Math.max(
      0,
      Math.min(EXHIBITION_PIECES.length - 1, Math.round(projectedOffset))
    );

    setActiveIndex(targetNearest);
  };

  const handlePieceClick = (index, piece) => {
    if (Math.abs(currentVirtualOffset - index) < 0.35) {
      // It's the center piece: toggle activation caption
      setActivatedPiece((prev) => (prev?.id === piece.id ? null : piece));
    } else {
      // It's an off-center piece: glide it to center
      setActivatedPiece(null);
      setActiveIndex(index);
    }
  };

  return (
    <section
      id="featured-collection"
      className="relative min-h-[95vh] sm:min-h-screen bg-[#000000] text-white flex flex-col justify-between overflow-hidden select-none py-16 sm:py-24"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* 1. ATMOSPHERIC VOLUMETRIC DEPTH ENVIRONMENT */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft Center Volumetric Fog */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[650px] bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.025)_0%,_rgba(0,0,0,0.8)_60%,_transparent_80%)]" />
        {/* Faint Metallic Streaks */}
        <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-40" />
        <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-30" />
      </div>

      {/* 2. MINIMALIST EXHIBITION HEADER (Storytelling / Discovery) */}
      <div className="relative z-20 max-w-xl mx-auto text-center px-6 pointer-events-none">
        <span className="text-[9px] uppercase tracking-[0.5em] text-[#707070] font-mono block mb-2">
          CINEMATIC EXHIBITION // MMXXVI
        </span>
        <h3 className="font-serif text-2xl sm:text-4xl uppercase tracking-[0.2em] text-white font-light">
          Suspended Adornments
        </h3>
        <p className="text-[10px] sm:text-xs text-[#606060] uppercase tracking-[0.25em] font-mono mt-1">
          Swipe to navigate • Tap center piece to examine
        </p>
      </div>

      {/* 3. FLOATING ARC SPATIAL STAGE (NO cards, NO containers, NO borders) */}
      <div
        ref={containerRef}
        className="relative z-10 w-full h-[55vh] sm:h-[62vh] flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {EXHIBITION_PIECES.map((piece, i) => {
            const distance = i - currentVirtualOffset;
            const absDist = Math.abs(distance);
            const isCenter = absDist < 0.45;
            const isActivated = activatedPiece?.id === piece.id;

            // Curved Arc Geometry: Parabolic elevation curve
            // Center is elevated at apex (Y = 0 or -15), sides curve downwards
            const arcCurvature = isMobile ? 32 : 46;
            const arcY = Math.pow(distance, 2) * arcCurvature;

            // Center Focus Depth System
            // Center: 1.15 (or 1.25 when activated), sides: 0.85, far: 0.70
            const baseScale = isActivated
              ? 1.24
              : 1.15 * (1 - Math.min(absDist * 0.2, 0.45));
            const opacity = isActivated
              ? 1.0
              : 1.0 * (1 - Math.min(absDist * 0.35, 0.72));
            const blurAmount = isCenter ? 0 : Math.min(absDist * 2.2, 5);
            const rotateY = -Math.max(-10, Math.min(10, distance * 5.5));
            const zIndex = isActivated ? 50 : Math.round(40 - absDist * 8);

            // Staggered multi-frequency float drift parameters
            const floatDuration = 6.5 + (i % 3) * 0.8;
            const floatDelay = (i % 4) * 0.6;

            return (
              <motion.div
                key={piece.id}
                style={{
                  position: 'absolute',
                  x: distance * spacing,
                  y: arcY,
                  scale: baseScale,
                  opacity,
                  filter: `blur(${blurAmount}px)`,
                  rotateY: `${rotateY}deg`,
                  zIndex,
                  perspective: 1200,
                  transformStyle: 'preserve-3d',
                }}
                className="cursor-pointer transition-filter duration-300"
                onClick={() => handlePieceClick(i, piece)}
              >
                {/* Continuous Multi-Frequency Floating & Breathing Wrapper */}
                <motion.div
                  animate={
                    isActivated
                      ? { y: 0, scale: 1, rotate: 0 } // Calms ambient drift when active
                      : {
                          y: [0, -12, 0],
                          scale: [1, 1.025, 1],
                          rotate: [-1.2, 1.2, -1.2],
                        }
                  }
                  transition={{
                    duration: floatDuration,
                    delay: floatDelay,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative flex flex-col items-center"
                >
                  {/* PURE FLOATING PHOTOGRAPHY (NO cards, NO borders, NO boxes) */}
                  <div
                    style={{ width: `${baseWidth}px` }}
                    className={`relative ${piece.aspect} rounded-2xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.98)] group transition-all duration-700`}
                  >
                    <img
                      src={piece.image}
                      alt={piece.name}
                      draggable={false}
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        isCenter
                          ? 'filter brightness-105 contrast-110 group-hover:scale-105'
                          : 'filter brightness-75 contrast-95'
                      }`}
                    />

                    {/* Subtle Liquid Rhodium Specular Sheen on Center Piece */}
                    {isCenter && (
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/12 to-transparent pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
                    )}

                    {/* Soft Vignette Edge Melt */}
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
                  </div>

                  {/* Soft Volumetric Cast Shadow Beneath Floating Piece */}
                  <div
                    style={{
                      width: `${baseWidth * 0.75}px`,
                      opacity: isCenter ? 0.85 : 0.4,
                    }}
                    className="h-5 -mt-2 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.95)_0%,_transparent_75%)] blur-md pointer-events-none"
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 4. EDITORIAL MUSEUM CAPTION REVEAL (Emerges gracefully on Center Tap) */}
      <div className="relative z-30 min-h-[90px] flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {activatedPiece ? (
            <motion.div
              key={activatedPiece.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-2 max-w-sm mx-auto"
            >
              <div>
                <h4 className="font-serif text-xl sm:text-2xl text-white font-light tracking-wide">
                  {activatedPiece.name}
                </h4>
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#888888] font-mono pt-0.5">
                  {activatedPiece.material} • {activatedPiece.finish}
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 pt-1">
                <span className="font-mono text-sm text-white font-medium tracking-wider">
                  ₹{activatedPiece.price.toLocaleString('en-IN')}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/cinematic/product/${activatedPiece.slug}`)
                  }
                  className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-[#C0C0C0] hover:text-white border-b border-white/30 hover:border-white transition-all pb-0.5 cursor-pointer font-mono"
                >
                  <span>View Piece</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ) : (
            /* Subtle Passive Orbit Indicator when no piece is activated */
            <motion.div
              key="passive-tracker"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 pointer-events-none"
            >
              {EXHIBITION_PIECES.map((_, i) => {
                const isSelected = i === activeIndex;
                return (
                  <span
                    key={i}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      isSelected ? 'w-5 bg-white' : 'w-1 bg-white/20'
                    }`}
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
