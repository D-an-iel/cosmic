import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useImagePreloader } from './useImagePreloader.js';

// High-Performance Next-Gen WebP Assets (~92% smaller than originals)
import ringHeroWebp from '../../assets/lunar_ring_hero.webp';
import eclipseWebp from '../../assets/eclipse_collection.webp';
import novaWebp from '../../assets/nova_collection.webp';
import lunarWebp from '../../assets/lunar_collection.webp';
import ringAngleWebp from '../../assets/lunar_ring_angle.webp';
import ringMacroWebp from '../../assets/lunar_ring_macro.webp';

const EXHIBITION_PIECES = [
  {
    id: "34bbdbad-11bb-4ffc-a641-dae851c1ad52",
    slug: "lunar-silver-ring",
    name: "Lunar Silver Ring",
    material: "Solid 925 Sterling Silver",
    finish: "Liquid Rhodium Finish",
    price: 799,
    image: ringHeroWebp,
  },
  {
    id: "celestial-pendant-001",
    slug: "celestial-pendant",
    name: "Celestial Star Pendant",
    material: "Solid 925 Sterling Silver",
    finish: "Hand-Beveled Mirror Polish",
    price: 1299,
    image: eclipseWebp,
  },
  {
    id: "stellar-chain-002",
    slug: "stellar-chain",
    name: "Stellar Curb Chain",
    material: "Solid 925 Sterling Silver",
    finish: "High Gloss Diamond Cut",
    price: 1499,
    image: novaWebp,
  },
  {
    id: "orbit-bracelet-003",
    slug: "orbit-bracelet",
    name: "Orbit Liquid Bangle",
    material: "Solid 925 Sterling Silver",
    finish: "Ergonomic Liquid Rhodium",
    price: 999,
    image: lunarWebp,
  },
  {
    id: "nova-eclipse-ring-004",
    slug: "nova-eclipse-ring",
    name: "Nova Geometric Studs",
    material: "Solid 925 Sterling Silver",
    finish: "Mirror Silver & Shadow Bevel",
    price: 649,
    image: ringAngleWebp,
  },
  {
    id: "cosmic-signature-pendant-005",
    slug: "cosmic-signature-pendant",
    name: "Cosmic Signature Piece",
    material: "Solid 925 Sterling Silver",
    finish: "Haute Joaillerie Atelier Cast",
    price: 1599,
    image: ringMacroWebp,
  },
];

const PRELOAD_URLS = EXHIBITION_PIECES.map((p) => p.image);

export default function FloatingArcExhibition() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(2); // Center piece (Stellar Chain)
  const [activatedPiece, setActivatedPiece] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // 1. Asynchronous Image Preloader: guarantees zero layout shift & zero popping
  const imagesReady = useImagePreloader(PRELOAD_URLS);

  const [windowWidth, setWindowWidth] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth : 1200;
  });

  useEffect(() => {
    let timer = null;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 100);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isMobile = windowWidth < 768;
  const spacing = isMobile ? 220 : 320;
  const baseWidth = isMobile ? 220 : 310;
  const arcCurvature = isMobile ? 28 : 42;

  // 2. Single Motion Layer (ONE animation system, ONE render loop)
  const targetX = -activeIndex * spacing;
  const springX = useSpring(targetX, {
    stiffness: 180,
    damping: 26,
    mass: 0.8,
  });

  useEffect(() => {
    springX.set(targetX);
  }, [targetX, springX]);

  // Pointer drag with physical inertia (Push -> Drift -> Settle)
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(targetX);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);

  const handlePointerDown = useCallback(
    (e) => {
      setIsDragging(true);
      dragStartXRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      dragStartOffsetRef.current = springX.get();
      lastXRef.current = dragStartXRef.current;
      lastTimeRef.current = performance.now();
      velocityRef.current = 0;
      setActivatedPiece(null);
    },
    [springX]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const deltaX = clientX - dragStartXRef.current;
      const now = performance.now();
      const dt = now - lastTimeRef.current;

      if (dt > 10) {
        velocityRef.current = (clientX - lastXRef.current) / dt;
        lastXRef.current = clientX;
        lastTimeRef.current = now;
      }

      springX.set(dragStartOffsetRef.current + deltaX);
    },
    [isDragging, springX]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const velocity = velocityRef.current; // px per ms
    const currentOffset = springX.get();
    const projectedOffset = currentOffset + velocity * 180;
    const projectedIndex = Math.round(-projectedOffset / spacing);
    const targetNearest = Math.max(
      0,
      Math.min(EXHIBITION_PIECES.length - 1, projectedIndex)
    );

    setActiveIndex(targetNearest);
  }, [isDragging, spacing, springX]);

  const handlePieceClick = useCallback(
    (index, piece) => {
      if (index === activeIndex) {
        setActivatedPiece((prev) => (prev?.id === piece.id ? null : piece));
      } else {
        setActivatedPiece(null);
        setActiveIndex(index);
      }
    },
    [activeIndex]
  );

  // 3. Virtualization: only render activeIndex - 2 to activeIndex + 2 (Max 5 items in DOM)
  const visibleItems = useMemo(() => {
    const minIdx = Math.max(0, activeIndex - 2);
    const maxIdx = Math.min(EXHIBITION_PIECES.length - 1, activeIndex + 2);
    const list = [];
    for (let i = minIdx; i <= maxIdx; i++) {
      list.push({ piece: EXHIBITION_PIECES[i], index: i });
    }
    return list;
  }, [activeIndex]);

  if (!imagesReady) {
    // Elegant deep black preload stage (avoids any visual layout shift)
    return (
      <section className="min-h-[90vh] bg-[#000000] flex items-center justify-center">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="text-[9px] uppercase tracking-[0.4em] text-[#606060] font-mono">
            INITIALIZING EXHIBITION
          </span>
        </div>
      </section>
    );
  }

  return (
    <section
      id="featured-collection"
      className="relative min-h-[95vh] sm:min-h-screen bg-[#000000] text-white flex flex-col justify-between overflow-hidden select-none py-16 sm:py-24"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* ATMOSPHERIC DEPTH (Hardware Cached) */}
      <div className="absolute inset-0 pointer-events-none transform-gpu">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_70%)]" />
        <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-40" />
      </div>

      {/* EXHIBITION TITLE */}
      <div className="relative z-20 max-w-xl mx-auto text-center px-6 pointer-events-none">
        <span className="text-[9px] uppercase tracking-[0.5em] text-[#707070] font-mono block mb-1.5">
          CINEMATIC EXHIBITION // MMXXVI
        </span>
        <h3 className="font-serif text-2xl sm:text-4xl uppercase tracking-[0.2em] text-white font-light">
          Suspended Adornments
        </h3>
        <p className="text-[10px] sm:text-xs text-[#606060] uppercase tracking-[0.25em] font-mono mt-1">
          Swipe to navigate • Tap center piece to examine
        </p>
      </div>

      {/* STAGE: SINGLE ANIMATED MOTION CONTAINER */}
      <div className="relative z-10 w-full h-[55vh] sm:h-[62vh] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-visible">
        {/* ONE Animated Motion Container: translates along x */}
        <motion.div
          style={{
            x: springX,
            transform: 'translate3d(0,0,0)',
            willChange: isDragging ? 'transform' : 'auto',
          }}
          className="relative flex items-center justify-center"
        >
          {visibleItems.map(({ piece, index }) => {
            const distance = index - activeIndex;
            const absDist = Math.abs(distance);
            const isCenter = distance === 0;
            const isActivated = activatedPiece?.id === piece.id;

            // Pure CSS transforms calculated per activeIndex transition
            const xPos = index * spacing;
            const yPos = Math.pow(distance, 2) * arcCurvature;
            const scale = isActivated
              ? 1.25
              : isCenter
              ? 1.15
              : absDist === 1
              ? 0.86
              : 0.70;
            const opacity = isActivated
              ? 1.0
              : isCenter
              ? 1.0
              : absDist === 1
              ? 0.58
              : 0.30;
            const rotateY = -Math.max(-8, Math.min(8, distance * 5));
            const zIndex = isActivated ? 50 : 40 - absDist * 10;

            return (
              <div
                key={piece.id}
                onClick={() => handlePieceClick(index, piece)}
                style={{
                  position: 'absolute',
                  left: `${xPos}px`,
                  transform: `translate3d(-50%, ${yPos}px, 0) scale(${scale}) rotateY(${rotateY}deg)`,
                  opacity,
                  zIndex,
                  width: `${baseWidth}px`,
                  transition: isDragging
                    ? 'none'
                    : 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease',
                  willChange: isCenter ? 'transform, opacity' : 'auto',
                }}
                className="cursor-pointer select-none flex flex-col items-center"
              >
                {/* PURE PHOTOGRAPHY CONTAINER (NO cards, NO borders, NO boxes) */}
                <div
                  className={`relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.98)] transition-all duration-500 ${
                    isCenter ? 'ring-1 ring-white/15' : 'ring-1 ring-white/5'
                  }`}
                >
                  <img
                    src={piece.image}
                    alt={piece.name}
                    draggable={false}
                    className={`w-full h-full object-cover select-none transition-all duration-500 ${
                      isCenter
                        ? 'filter brightness-105 contrast-105'
                        : 'filter brightness-80 contrast-90'
                    }`}
                  />

                  {/* Specular sheen on center piece */}
                  {isCenter && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none opacity-70" />
                  )}
                </div>

                {/* Soft diffused cast shadow */}
                <div
                  style={{ opacity: isCenter ? 0.85 : 0.3 }}
                  className="w-3/4 h-4 -mt-1 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.95)_0%,_transparent_75%)] blur-sm pointer-events-none transition-opacity duration-500"
                />
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* EDITORIAL MUSEUM CAPTION (Reveals on Center Tap) */}
      <div className="relative z-30 min-h-[85px] flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {activatedPiece ? (
            <motion.div
              key={activatedPiece.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-1.5 max-w-sm mx-auto"
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
            /* Minimalist Dot Tracker */
            <motion.div
              key="tracker"
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
