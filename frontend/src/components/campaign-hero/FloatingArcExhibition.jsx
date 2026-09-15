import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useImagePreloader } from './useImagePreloader.js';

// Pre-optimized WebP assets (~18KB - 60KB each, ~92% total payload reduction)
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
    price: 799,
    image: ringHeroWebp,
  },
  {
    id: "celestial-pendant-001",
    slug: "celestial-pendant",
    name: "Celestial Star Pendant",
    price: 1299,
    image: eclipseWebp,
  },
  {
    id: "stellar-chain-002",
    slug: "stellar-chain",
    name: "Stellar Curb Chain",
    price: 1499,
    image: novaWebp,
  },
  {
    id: "orbit-bracelet-003",
    slug: "orbit-bracelet",
    name: "Orbit Liquid Bangle",
    price: 999,
    image: lunarWebp,
  },
  {
    id: "nova-eclipse-ring-004",
    slug: "nova-eclipse-ring",
    name: "Nova Geometric Studs",
    price: 649,
    image: ringAngleWebp,
  },
  {
    id: "cosmic-signature-pendant-005",
    slug: "cosmic-signature-pendant",
    name: "Cosmic Signature Piece",
    price: 1599,
    image: ringMacroWebp,
  },
];

const PRELOAD_URLS = EXHIBITION_PIECES.map((p) => p.image);

export default function FloatingArcExhibition() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(2); // Center piece (Stellar Chain default)
  const [isDragging, setIsDragging] = useState(false);

  // 1. Asynchronous Image Preloader: prevents layout shifts and image popping
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
  // Center image occupies ~76vw on mobile, ~400px on desktop
  const cardWidth = isMobile ? Math.min(windowWidth * 0.76, 320) : 400;
  const gap = isMobile ? 24 : 48;
  const spacing = cardWidth + gap;

  // 2. Single Motion Layer (ONE animation system, ONE GPU compositor loop)
  const targetX = -activeIndex * spacing;
  const springX = useSpring(targetX, {
    stiffness: 220,
    damping: 28,
    mass: 0.7,
  });

  useEffect(() => {
    springX.set(targetX);
  }, [targetX, springX]);

  // Pointer drag with momentum (Push -> Drift -> Settle)
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

    const velocity = velocityRef.current; // px/ms
    const currentOffset = springX.get();
    const projectedOffset = currentOffset + velocity * 160;
    const projectedIndex = Math.round(-projectedOffset / spacing);
    const targetNearest = Math.max(
      0,
      Math.min(EXHIBITION_PIECES.length - 1, projectedIndex)
    );

    setActiveIndex(targetNearest);
  }, [isDragging, spacing, springX]);

  // Direct Tap: center image -> navigate to detail page; off-center -> glide to center
  const handlePieceClick = useCallback(
    (index, piece) => {
      if (index === activeIndex) {
        navigate(`/cinematic/product/${piece.slug}`);
      } else {
        setActiveIndex(index);
      }
    },
    [activeIndex, navigate]
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

  const activePiece = EXHIBITION_PIECES[activeIndex];

  if (!imagesReady) {
    return (
      <section className="h-[80vh] sm:h-[85vh] bg-[#000000] flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
      </section>
    );
  }

  return (
    <section
      id="featured-collection"
      className="relative h-[80vh] sm:h-[88vh] bg-[#000000] text-white flex flex-col justify-center overflow-hidden select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* 1. STAGE: ONE ANIMATED MOTION CONTAINER MOVING PURE IMAGERY IN SPACE */}
      <div className="relative w-full h-[60vh] sm:h-[68vh] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-visible">
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

            // Pure CSS transforms calculated per activeIndex transition
            const xPos = index * spacing;
            const scale = isCenter ? 1.0 : absDist === 1 ? 0.88 : 0.76;
            const opacity = isCenter ? 1.0 : absDist === 1 ? 0.38 : 0.14;
            const zIndex = isCenter ? 30 : 20 - absDist;

            return (
              <div
                key={piece.id}
                onClick={() => handlePieceClick(index, piece)}
                style={{
                  position: 'absolute',
                  left: `${xPos}px`,
                  transform: `translate3d(-50%, -50%, 0) scale(${scale})`,
                  opacity,
                  zIndex,
                  width: `${cardWidth}px`,
                  transition: isDragging
                    ? 'none'
                    : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
                  willChange: isCenter ? 'transform, opacity' : 'auto',
                }}
                className="cursor-pointer select-none flex flex-col items-center top-1/2"
              >
                {/* PURE FLOATING PHOTOGRAPHY (Zero containers, Zero borders, Zero buttons) */}
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-[0_25px_65px_rgba(0,0,0,0.95)]">
                  <img
                    src={piece.image}
                    alt={piece.name}
                    draggable={false}
                    className={`w-full h-full object-cover select-none transition-all duration-500 ${
                      isCenter
                        ? 'filter brightness-105 contrast-105'
                        : 'filter brightness-75 contrast-90'
                    }`}
                  />
                  {/* Subtle rim light accent on centered piece */}
                  {isCenter && (
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
                  )}
                </div>

                {/* Soft diffused cast shadow */}
                <div
                  style={{ opacity: isCenter ? 0.75 : 0.2 }}
                  className="w-4/5 h-4 -mt-1 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.95)_0%,_transparent_75%)] blur-sm pointer-events-none transition-opacity duration-500"
                />
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* 2. BOTTOM-LEFT MINIMALIST PRODUCT INFORMATION */}
      <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-12 z-30 pointer-events-none select-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePiece.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="space-y-0.5"
          >
            <h4 className="font-serif text-xl sm:text-2xl text-white font-light tracking-wide">
              {activePiece.name}
            </h4>
            <p className="font-mono text-xs sm:text-sm text-[#888888] tracking-widest pt-0.5">
              ₹{activePiece.price.toLocaleString('en-IN')}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. BOTTOM-RIGHT SUBTLE INDEX COUNTER */}
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-12 z-30 pointer-events-none select-none">
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#555555]">
          0{activeIndex + 1} / 0{EXHIBITION_PIECES.length}
        </span>
      </div>
    </section>
  );
}
