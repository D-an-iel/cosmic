import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

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
  const [activeIndex, setActiveIndex] = useState(2); // Center piece default
  const [activatedPiece, setActivatedPiece] = useState(null); // Center piece tapped for caption
  const containerRef = useRef(null);

  const [windowWidth, setWindowWidth] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth : 1200;
  });

  useEffect(() => {
    let timeoutId = null;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 100);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isMobile = windowWidth < 768;
  const spacing = isMobile ? 210 : 310;
  const baseWidth = isMobile ? 220 : 310;
  const arcCurvature = isMobile ? 32 : 46;

  // Spring position driver - runs entirely in motion values without React state polling!
  const springOffset = useSpring(activeIndex, {
    stiffness: 160,
    damping: 26,
    mass: 0.8,
  });

  useEffect(() => {
    springOffset.set(activeIndex);
  }, [activeIndex, springOffset]);

  // Inertial momentum drag handling (Push -> Drift -> Settle)
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartIndexRef = useRef(activeIndex);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);

  const handlePointerDown = useCallback((e) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    dragStartIndexRef.current = springOffset.get();
    lastXRef.current = dragStartXRef.current;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    setActivatedPiece(null);
  }, [springOffset]);

  const handlePointerMove = useCallback((e) => {
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

    const newVirtual = dragStartIndexRef.current - deltaX / spacing;
    springOffset.set(newVirtual);
  }, [spacing, springOffset]);

  const handlePointerUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;

    const velocity = velocityRef.current;
    const currentVal = springOffset.get();
    const projectedOffset = currentVal - velocity * 0.4;
    const targetNearest = Math.max(
      0,
      Math.min(EXHIBITION_PIECES.length - 1, Math.round(projectedOffset))
    );

    setActiveIndex(targetNearest);
  }, [springOffset]);

  const handlePieceClick = useCallback((index, piece) => {
    const currentVal = springOffset.get();
    if (Math.abs(currentVal - index) < 0.35) {
      // Toggle museum caption
      setActivatedPiece((prev) => (prev?.id === piece.id ? null : piece));
    } else {
      // Glide to center
      setActivatedPiece(null);
      setActiveIndex(index);
    }
  }, [springOffset]);

  return (
    <section
      id="featured-collection"
      className="relative min-h-[95vh] sm:min-h-screen bg-[#000000] text-white flex flex-col justify-between overflow-hidden select-none py-16 sm:py-24"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* 1. ATMOSPHERIC VOLUMETRIC DEPTH ENVIRONMENT (Cached GPU Layer) */}
      <div className="absolute inset-0 pointer-events-none transform-gpu">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[650px] bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.025)_0%,_rgba(0,0,0,0.8)_60%,_transparent_80%)]" />
        <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-40" />
        <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-30" />
      </div>

      {/* 2. MINIMALIST EXHIBITION HEADER */}
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

      {/* 3. FLOATING ARC SPATIAL STAGE */}
      <div
        ref={containerRef}
        className="relative z-10 w-full h-[55vh] sm:h-[62vh] flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {EXHIBITION_PIECES.map((piece, index) => {
            const distanceOffset = Math.abs(index - activeIndex);
            const isCenter = distanceOffset === 0;
            const isAdjacent = distanceOffset === 1;
            const isActivated = activatedPiece?.id === piece.id;

            return (
              <FloatingArcPieceItem
                key={piece.id}
                index={index}
                piece={piece}
                springOffset={springOffset}
                spacing={spacing}
                baseWidth={baseWidth}
                arcCurvature={arcCurvature}
                isCenter={isCenter}
                isAdjacent={isAdjacent}
                isActivated={isActivated}
                isMobile={isMobile}
                onPieceClick={handlePieceClick}
              />
            );
          })}
        </div>
      </div>

      {/* 4. EDITORIAL MUSEUM CAPTION REVEAL (Emerges on Center Tap) */}
      <div className="relative z-30 min-h-[90px] flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {activatedPiece ? (
            <motion.div
              key={activatedPiece.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
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
            /* Passive Tracker */
            <motion.div
              key="passive-tracker"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 pointer-events-none"
            >
              {EXHIBITION_PIECES.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === activeIndex ? 'w-5 bg-white' : 'w-1 bg-white/20'
                  }`}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// --------------------------------------------------------------------------
// PERFORMANCE-OPTIMIZED MEMOIZED PIECE ITEM
// Eliminates per-frame React re-renders via GPU-bound MotionValues.
// Replaces expensive filter: blur() with hardware opacity/scale depth.
// Tiers animation: Center = Full, Adjacent = Reduced, Far = Static.
// --------------------------------------------------------------------------
const FloatingArcPieceItem = React.memo(function FloatingArcPieceItem({
  index,
  piece,
  springOffset,
  spacing,
  baseWidth,
  arcCurvature,
  isCenter,
  isAdjacent,
  isActivated,
  isMobile,
  onPieceClick,
}) {
  // Direct GPU MotionValue transforms (0 React re-renders during motion)
  const x = useTransform(springOffset, (curr) => (index - curr) * spacing);
  const y = useTransform(springOffset, (curr) => {
    const dist = index - curr;
    return Math.pow(dist, 2) * arcCurvature;
  });

  const scale = useTransform(springOffset, (curr) => {
    const absDist = Math.abs(index - curr);
    if (isActivated) return 1.24;
    return 1.15 * (1 - Math.min(absDist * 0.2, 0.45));
  });

  const opacity = useTransform(springOffset, (curr) => {
    const absDist = Math.abs(index - curr);
    if (isActivated) return 1.0;
    return 1.0 * (1 - Math.min(absDist * 0.35, 0.72));
  });

  const rotateY = useTransform(
    springOffset,
    (curr) => -Math.max(-10, Math.min(10, (index - curr) * 5.5))
  );

  const zIndex = useTransform(springOffset, (curr) => {
    if (isActivated) return 50;
    return Math.round(40 - Math.abs(index - curr) * 8);
  });

  // Tiered floating motion:
  // Center -> Full floating animation
  // Adjacent -> Reduced micro drift
  // Far -> Completely static (0 animation loops running)
  const floatAnimation = useMemo(() => {
    if (isActivated) {
      return { y: 0, scale: 1, rotate: 0 };
    }
    if (isCenter) {
      return {
        y: isMobile ? [0, -6, 0] : [0, -10, 0],
        scale: [1, 1.02, 1],
        rotate: isMobile ? [-0.6, 0.6, -0.6] : [-1.2, 1.2, -1.2],
      };
    }
    if (isAdjacent) {
      return {
        y: isMobile ? [0, -3, 0] : [0, -4, 0],
        scale: [1, 1.008, 1],
        rotate: 0,
      };
    }
    // Far images: completely static!
    return { y: 0, scale: 1, rotate: 0 };
  }, [isActivated, isCenter, isAdjacent, isMobile]);

  const floatTransition = useMemo(() => {
    if (!isCenter && !isAdjacent) return { duration: 0 };
    return {
      duration: isCenter ? 6.5 : 8.0,
      repeat: Infinity,
      ease: 'easeInOut',
    };
  }, [isCenter, isAdjacent]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        x,
        y,
        scale,
        opacity,
        rotateY,
        zIndex,
        perspective: 1000,
        transformStyle: 'preserve-3d',
        willChange: isCenter || isAdjacent ? 'transform, opacity' : 'auto',
      }}
      className="cursor-pointer select-none"
      onClick={() => onPieceClick(index, piece)}
    >
      <motion.div
        animate={floatAnimation}
        transition={floatTransition}
        style={{ transform: 'translate3d(0,0,0)' }}
        className="relative flex flex-col items-center"
      >
        {/* PURE FLOATING PHOTOGRAPHY (No borders, No boxes, No cards) */}
        <div
          style={{ width: `${baseWidth}px` }}
          className={`relative ${piece.aspect} rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] transition-shadow duration-500`}
        >
          <img
            src={piece.image}
            alt={piece.name}
            draggable={false}
            loading={isCenter ? 'eager' : 'lazy'}
            decoding="async"
            className={`w-full h-full object-cover select-none transition-all duration-500 ${
              isCenter
                ? 'filter brightness-105 contrast-105'
                : 'filter brightness-80 contrast-95'
            }`}
          />

          {/* Center Specular Highlight */}
          {isCenter && (
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-60" />
          )}

          {/* Soft Vignette Edge */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
        </div>

        {/* Diffused Cast Shadow */}
        <div
          style={{
            width: `${baseWidth * 0.72}px`,
            opacity: isCenter ? 0.8 : 0.35,
          }}
          className="h-4 -mt-1.5 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.95)_0%,_transparent_75%)] blur-sm pointer-events-none"
        />
      </motion.div>
    </motion.div>
  );
});
