import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

import lunarImg from '../../assets/lunar_collection.jpg';
import eclipseImg from '../../assets/eclipse_collection.jpg';
import novaImg from '../../assets/nova_collection.jpg';
import ringHeroImg from '../../assets/lunar_ring_hero.jpg';

export const EDITORIAL_PIECES = [
  {
    id: "34bbdbad-11bb-4ffc-a641-dae851c1ad52",
    slug: "lunar-silver-ring",
    name: "Lunar Silver Ring",
    code: "01",
    price: 799,
    category: "Ring",
    image: ringHeroImg,
    finish: "Liquid Rhodium",
  },
  {
    id: "celestial-pendant-001",
    slug: "celestial-pendant",
    name: "Celestial Star Pendant",
    code: "02",
    price: 1299,
    category: "Pendant",
    image: eclipseImg,
    finish: "Mirror Polish",
  },
  {
    id: "stellar-chain-002",
    slug: "stellar-chain",
    name: "Stellar Curb Chain",
    code: "03",
    price: 1499,
    category: "Necklace",
    image: novaImg,
    finish: "High Gloss",
  },
  {
    id: "orbit-bracelet-003",
    slug: "orbit-bracelet",
    name: "Orbit Liquid Bangle",
    code: "04",
    price: 999,
    category: "Bracelet",
    image: lunarImg,
    finish: "Liquid Rhodium",
  },
  {
    id: "nova-eclipse-ring-004",
    slug: "nova-eclipse-ring",
    name: "Nova Geometric Studs",
    code: "05",
    price: 649,
    category: "Earrings",
    image: novaImg,
    finish: "Mirror Silver",
  },
  {
    id: "cosmic-signature-pendant-005",
    slug: "cosmic-signature-pendant",
    name: "Cosmic Signature Piece",
    code: "06",
    price: 1599,
    category: "Haute Joaillerie",
    image: eclipseImg,
    finish: "Liquid Rhodium",
  },
];

export default function EditorialHorizontalGallery() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(2); // Center by default
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
  const cardWidth = isMobile ? 260 : 340;
  const gap = isMobile ? 16 : 32;
  const step = cardWidth + gap;

  // Track position offset driven by activeIndex
  const targetOffset = -activeIndex * step;
  const springOffset = useSpring(targetOffset, {
    stiffness: 240,
    damping: 28,
    mass: 0.8,
  });

  useEffect(() => {
    springOffset.set(targetOffset);
  }, [activeIndex, targetOffset, springOffset]);

  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Determine swipe direction with low threshold for responsiveness
    if (offset < -50 || velocity < -300) {
      setActiveIndex((prev) => Math.min(prev + 1, EDITORIAL_PIECES.length - 1));
    } else if (offset > 50 || velocity > 300) {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleCardClick = (index, piece) => {
    if (index === activeIndex) {
      navigate(`/cinematic/product/${piece.slug}`);
    } else {
      setActiveIndex(index);
    }
  };

  return (
    <section
      id="featured-collection"
      className="relative py-28 sm:py-36 bg-black text-white overflow-hidden select-none"
    >
      {/* Background Soft Atmospheric Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_0%,_transparent_70%)] pointer-events-none" />

      {/* Header: Minimal Editorial Typography */}
      <div className="max-w-4xl mx-auto px-6 text-center space-y-3 mb-16 sm:mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] uppercase tracking-[0.35em] text-[#A0A0A0] font-mono">
          <Sparkles className="w-3 h-3 text-[#C0C0C0]" />
          <span>FEATURED COLLECTION</span>
        </div>
        <h3 className="font-serif text-3xl sm:text-5xl uppercase tracking-[0.2em] text-white font-light">
          Editorial Showcase
        </h3>
        <p className="text-xs sm:text-sm text-[#808080] font-light max-w-md mx-auto pt-1 leading-relaxed">
          Drag horizontally to explore the pieces featured in the campaign silhouette.
        </p>
      </div>

      {/* HORIZONTAL CAROUSEL VIEWPORT */}
      <div
        ref={containerRef}
        className="relative w-full overflow-visible flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        {/* Animated Horizontal Strip containing all cards on the same horizontal plane */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          style={{ x: springOffset }}
          className="flex items-center"
        >
          {EDITORIAL_PIECES.map((piece, index) => {
            const distance = index - activeIndex;
            const absDist = Math.abs(distance);
            const isCenter = distance === 0;

            // Restrained, elegant focal transforms
            const scale = isCenter ? 1.05 : Math.max(0.91, 1 - absDist * 0.07);
            const opacity = isCenter ? 1.0 : Math.max(0.48, 1 - absDist * 0.26);
            const rotateY = Math.max(-6, Math.min(6, distance * -3.5));
            const zIndex = isCenter ? 30 : 20 - absDist;

            return (
              <motion.div
                key={piece.id}
                animate={{
                  scale,
                  opacity,
                  rotateY,
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  width: `${cardWidth}px`,
                  marginRight: `${gap}px`,
                  zIndex,
                  perspective: 1000,
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => handleCardClick(index, piece)}
                className={`flex-shrink-0 relative bg-[#090909] border rounded-2xl p-5 sm:p-6 transition-colors duration-500 group cursor-pointer ${
                  isCenter
                    ? 'border-white/35 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(255,255,255,0.06)]'
                    : 'border-white/10 hover:border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.8)]'
                }`}
              >
                {/* Specular Liquid Rhodium Rim Glow */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none transition-opacity duration-500 ${
                    isCenter ? 'opacity-100' : 'opacity-20'
                  }`}
                />

                {/* 1. Large Luxury Product Photography */}
                <div className="aspect-[3/4] relative rounded-xl overflow-hidden bg-black/80 border border-white/10 mb-5">
                  <img
                    src={piece.image}
                    alt={piece.name}
                    className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                      isCenter
                        ? 'filter brightness-100 contrast-105 group-hover:scale-105'
                        : 'filter brightness-80 contrast-95'
                    }`}
                  />
                  {/* Subtle Corner Code Badge */}
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md border border-white/15 text-[9px] font-mono uppercase tracking-widest text-[#B0B0B0]">
                    {piece.code} // S925
                  </div>
                </div>

                {/* 2. Product Name & Category */}
                <div className="space-y-1 z-10 relative">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#707070] font-mono block">
                    {piece.category} • {piece.finish}
                  </span>
                  <h4 className="font-serif text-lg sm:text-xl text-white font-light tracking-wide truncate">
                    {piece.name}
                  </h4>
                </div>

                {/* 3. Price & View Piece Link */}
                <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between z-10 relative">
                  <span className="font-mono text-sm sm:text-base text-white font-medium tracking-wider">
                    ₹{piece.price.toLocaleString('en-IN')}
                  </span>

                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-[#A0A0A0] group-hover:text-white transition-colors font-medium">
                    <span>View Piece</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* GALLERY CONTROLS & PAGINATION TRACKER */}
      <div className="mt-14 max-w-sm mx-auto px-4 flex items-center justify-between z-20 relative">
        {/* Left Arrow */}
        <button
          type="button"
          onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
          disabled={activeIndex === 0}
          className="p-2 rounded-full border border-white/15 hover:border-white/40 disabled:opacity-20 disabled:hover:border-white/15 text-white transition-all cursor-pointer disabled:cursor-not-allowed"
          title="Previous Piece"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Minimalist Dot & Code Tracker */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {EDITORIAL_PIECES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeIndex
                    ? 'w-6 bg-white'
                    : 'w-1.5 bg-white/25 hover:bg-white/50'
                }`}
                title={`Go to piece 0${i + 1}`}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-[#808080] tracking-widest pl-1">
            0{activeIndex + 1} / 0{EDITORIAL_PIECES.length}
          </span>
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={() =>
            setActiveIndex((prev) =>
              Math.min(prev + 1, EDITORIAL_PIECES.length - 1)
            )
          }
          disabled={activeIndex === EDITORIAL_PIECES.length - 1}
          className="p-2 rounded-full border border-white/15 hover:border-white/40 disabled:opacity-20 disabled:hover:border-white/15 text-white transition-all cursor-pointer disabled:cursor-not-allowed"
          title="Next Piece"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
