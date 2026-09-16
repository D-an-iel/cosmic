import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, cubicBezier } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import campaignMasterImg from '../../assets/cosmic_campaign_master.webp';
import { ArrowDown } from 'lucide-react';

// Panel settle easing curve (tiny deceleration settle into resting position)
const panelSettleEase = cubicBezier(0.25, 0.1, 0.25, 1.0);

// 5 Architectural Panels definition (percentages of width: 20% each)
const PANELS_CONFIG = [
  { index: 0, dx: -30, dy: -12, mobileDx: -12, mobileDy: -5 },
  { index: 1, dx: -15, dy: 8,   mobileDx: -6,  mobileDy: 3  },
  { index: 2, dx: 0,   dy: -6,  mobileDx: 0,   mobileDy: -2 },
  { index: 3, dx: 15,  dy: 10,  mobileDx: 6,   mobileDy: 4  },
  { index: 4, dx: 30,  dy: -8,  mobileDx: 12,  mobileDy: -3 },
];

// Precise Museum Exhibit Hotspots mapped directly to physical accessories on model
// Coordinates are panel-relative so hotspots stay 100% locked during the split motion
// revealOrder defines the strictly sequential reveal: Ring -> Necklaces -> Bracelet -> Earrings
const EXHIBIT_HOTSPOTS = [
  {
    id: "lunar-ring",
    code: "01",
    category: "Solid 925 Band",
    name: "Lunar Silver Ring",
    price: "799",
    slug: "lunar-silver-ring",
    panelIndex: 1, // 20% - 40% column
    panelX: 62.5,  // overall x: 32.5%
    y: 43.1,       // index finger ring
    revealOrder: 0, // Phase 3: 1. Ring reveals first
  },
  {
    id: "stellar-choker",
    code: "02",
    category: "Collar Chain",
    name: "Stellar Micro Choker",
    price: "1199",
    slug: "stellar-chain",
    panelIndex: 2, // 40% - 60% column
    panelX: 78.5,  // overall x: 55.7%
    y: 56.7,       // choker around throat
    revealOrder: 1, // Phase 3: 2. Necklaces reveal next (choker)
  },
  {
    id: "celestial-pendant",
    code: "03",
    category: "Star Pendant",
    name: "Celestial Star Pendant",
    price: "1299",
    slug: "celestial-pendant",
    panelIndex: 2, // 40% - 60% column
    panelX: 85.0,  // overall x: 57.0%
    y: 66.2,       // center starburst pendant
    revealOrder: 2, // Phase 3: 2. Necklaces reveal next (pendant)
  },
  {
    id: "cosmic-curb",
    code: "04",
    category: "Heavy Chain",
    name: "Cosmic Curb Chain",
    price: "1499",
    slug: "stellar-chain",
    panelIndex: 2, // 40% - 60% column
    panelX: 41.0,  // overall x: 48.2%
    y: 70.1,       // heavy curb chain necklace
    revealOrder: 3, // Phase 3: 2. Necklaces reveal next (curb)
  },
  {
    id: "orbit-cuff",
    code: "05",
    category: "Molten Bangle",
    name: "Orbit Sculptural Cuff",
    price: "999",
    slug: "orbit-bracelet",
    panelIndex: 4, // 80% - 100% column
    panelX: 7.5,   // overall x: 81.5%
    y: 77.0,       // fluid silver wrist cuff
    revealOrder: 4, // Phase 3: 3. Bracelet reveals next
  },
  {
    id: "nova-stud",
    code: "06",
    category: "Lobe Architecture",
    name: "Nova Geometric Stud",
    price: "699",
    slug: "nova-eclipse-ring",
    panelIndex: 3, // 60% - 80% column
    panelX: 92.0,  // overall x: 78.4%
    y: 30.4,       // upper earring stud
    revealOrder: 5, // Phase 3: 4. Earrings reveal last (stud)
  },
  {
    id: "eclipse-drop",
    code: "07",
    category: "Earring Sculpture",
    name: "Eclipse Drop Earring",
    price: "849",
    slug: "nova-eclipse-ring",
    panelIndex: 3, // 60% - 80% column
    panelX: 79.5,  // overall x: 75.9%
    y: 32.2,       // lower earring drop
    revealOrder: 6, // Phase 3: 4. Earrings reveal last (drop)
  },
];

export default function ArchitecturalCampaignHero() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Active hotspot state (null or hotspot id)
  const [activeHotspotId, setActiveHotspotId] = useState(null);

  // 3-Phase State Machine:
  // 'hidden'   : Phase 1 (Image Split in progress). ZERO hotspots visible.
  // 'settling' : Phase 2 (Panels reached 100% separated position. 250ms settle pause. ZERO hotspots visible).
  // 'revealed' : Phase 3 (Hotspots sequentially fade in with 75ms stagger: Ring -> Necklaces -> Bracelet -> Earrings).
  const [revealState, setRevealState] = useState('hidden');
  const settleTimerRef = useRef(null);

  // Optimized mobile check
  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile((prev) => (prev !== mobile ? mobile : prev));
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dismiss active hotspot on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.museum-marker-anchor')) {
        setActiveHotspotId(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Cleanup settle timer on unmount
  useEffect(() => {
    return () => {
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
    };
  }, []);

  // Synchronous scroll binding via Framer Motion
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1. Image Split Progress:
  // Reaches 1.0 (100% separated) at 0.40 of the scroll runway.
  // Phase 1: Only panel movement across [0.0, 0.40].
  const splitProgress = useTransform(scrollYProgress, [0.0, 0.40], [0, 1], {
    clamp: true,
  });

  // State machine transition listener:
  // Highlights now reveal near the END of the experience (starting at 0.70)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest >= 0.70) {
      // Reveal sequence starts near the end
      if (revealState === 'hidden') {
        setRevealState('settling');
        if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
        // Phase 2 Settle Pause: 250ms deliberate pause before Phase 3 sequential reveal
        settleTimerRef.current = setTimeout(() => {
          setRevealState('revealed');
        }, 260);
      }
    } else if (latest < 0.65) {
      // User is scrolling back up: abort and hide hotspots
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current);
      if (revealState !== 'hidden') {
        setRevealState('hidden');
        setActiveHotspotId(null);
      }
    }
  });

  // Check initial position on mount (e.g. if loaded mid-scroll)
  useEffect(() => {
    const current = splitProgress.get();
    if (current >= 0.98 && revealState === 'hidden') {
      settleTimerRef.current = setTimeout(() => {
        setRevealState('revealed');
      }, 260);
    }
  }, []);

  // 2. Initial Editorial Brand Header Fade Out
  const brandOpacity = useTransform(scrollYProgress, [0, 0.10], [1.0, 0.0]);

  // 3. Scroll Prompt Fade Out
  const scrollPromptOpacity = useTransform(scrollYProgress, [0, 0.08], [1.0, 0.0]);

  const scrollToCollections = useCallback(() => {
    const el = document.getElementById('collections') || document.getElementById('shop');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleHotspotToggle = useCallback((id, e) => {
    e.stopPropagation();
    setActiveHotspotId((curr) => (curr === id ? null : id));
  }, []);

  const handleProductNavigate = useCallback((slug, e) => {
    e.stopPropagation();
    navigate(`/product/${slug}`);
  }, [navigate]);

  const isRevealed = revealState === 'revealed';

  return (
    <div ref={containerRef} className="relative w-full h-[175vh] bg-black">
      {/* PINNED VIEWPORT */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center select-none px-3 sm:px-6">
        
        {/* Subtle Background Radial Vignette for Depth */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0d0d0d] via-[#050505] to-black pointer-events-none" />

        {/* 1. INITIAL EDITORIAL BRANDING (Visible at scroll 0) */}
        <motion.div
          style={{ opacity: brandOpacity }}
          className="absolute top-10 sm:top-14 left-0 right-0 z-20 text-center pointer-events-none px-4"
        >
          <span className="text-[9px] uppercase tracking-[0.45em] text-[#909090] font-mono block">
            MILAN • PARIS • NEW YORK
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-[0.25em] text-white font-light mt-1">
            COSMIC
          </h1>
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#666666] mt-1 font-light">
            HAUTE JOAILLERIE // CAMPAIGN MMXXVI
          </p>
        </motion.div>

        {/* 2. DECONSTRUCTION METADATA (Appears only in Phase 3 after settle pause) */}
        <div
          style={{
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? 'translateY(0)' : 'translateY(-4px)',
            transition: isRevealed
              ? 'opacity 500ms ease 100ms, transform 500ms ease 100ms'
              : 'opacity 150ms ease 0ms, transform 150ms ease 0ms',
          }}
          className="absolute top-10 sm:top-14 left-0 right-0 z-20 text-center pointer-events-none px-4"
        >
          <span className="text-[9px] uppercase tracking-[0.4em] text-[#A0A0A0] font-mono block">
            ARCHITECTURAL DECONSTRUCTION
          </span>
          <h2 className="font-serif text-xl sm:text-2xl uppercase tracking-[0.2em] text-white font-light mt-0.5">
            5 Campaign Panels
          </h2>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#707070] font-mono mt-0.5">
            Tap exhibit markers to reveal individual creations
          </p>
        </div>

        {/* 3. CENTRAL CAMPAIGN VIEWPORT (Pure black background, zero duplicate image) */}
        <div
          className="relative w-full max-w-[340px] sm:max-w-md md:max-w-lg lg:max-w-xl aspect-[9/16] max-h-[76vh] sm:max-h-[80vh] flex items-center justify-center my-auto shadow-[0_20px_60px_rgba(0,0,0,0.9)] rounded-sm bg-black"
        >
          {/* 5 ARCHITECTURAL SPLIT PANELS (GPU hardware-accelerated column slicing) */}
          <div className="relative w-full h-full">
            {PANELS_CONFIG.map((panel) => {
              const panelHotspots = EXHIBIT_HOTSPOTS.filter(
                (h) => h.panelIndex === panel.index
              );

              return (
                <ArchitecturalPanel
                  key={panel.index}
                  panel={panel}
                  progress={splitProgress}
                  isMobile={isMobile}
                  hotspots={panelHotspots}
                  activeHotspotId={activeHotspotId}
                  revealState={revealState}
                  onToggleHotspot={handleHotspotToggle}
                  onNavigate={handleProductNavigate}
                />
              );
            })}
          </div>

          {/* Atmospheric Frame Vignette */}
          <div className="absolute inset-0 rounded-sm pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.7)]" />
        </div>

        {/* 4. INITIAL SCROLL PROMPT */}
        <motion.div
          style={{ opacity: scrollPromptOpacity }}
          className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#707070] font-mono">
            Scroll to reveal structure
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowDown className="w-3.5 h-3.5 text-[#A0A0A0]" />
          </motion.div>
        </motion.div>

        {/* 5. EXPLORE COLLECTION BUTTON (Reveals once panels are open & settled) */}
        <div
          style={{
            opacity: isRevealed ? 1 : 0,
            transform: isRevealed ? 'translateY(0)' : 'translateY(4px)',
            transition: isRevealed
              ? 'opacity 500ms ease 200ms, transform 500ms ease 200ms'
              : 'opacity 150ms ease 0ms, transform 150ms ease 0ms',
            pointerEvents: isRevealed ? 'auto' : 'none',
          }}
          className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center gap-1.5"
        >
          <button
            type="button"
            id="explore-collections-btn"
            onClick={scrollToCollections}
            className="group flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-[9px] uppercase tracking-[0.25em] text-[#C0C0C0] hover:text-white transition-all cursor-pointer font-mono backdrop-blur-md"
          >
            <span>Explore Collections</span>
            <ArrowDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform text-white" />
          </button>
        </div>

      </div>
    </div>
  );
}

// Sub-component: A single architectural slice of the master photograph with panel-anchored hotspots
const ArchitecturalPanel = React.memo(function ArchitecturalPanel({
  panel,
  progress,
  isMobile,
  hotspots,
  activeHotspotId,
  revealState,
  onToggleHotspot,
  onNavigate,
}) {
  const targetX = isMobile ? panel.mobileDx : panel.dx;
  const targetY = isMobile ? panel.mobileDy : panel.dy;

  // Direct GPU transform mapping with panelSettleEase for tiny easing settle in Phase 2
  const x = useTransform(progress, [0, 1], [0, targetX], { ease: panelSettleEase });
  const y = useTransform(progress, [0, 1], [0, targetY], { ease: panelSettleEase });

  // Subtle hairline panel seam border fades in as panels separate
  const seamOpacity = useTransform(progress, [0.08, 0.35], [0, 0.45]);

  const isPanelActive = hotspots.some((h) => h.id === activeHotspotId);

  return (
    <motion.div
      style={{
        x,
        y,
        left: `${panel.index * 20}%`,
        width: '20%',
        willChange: 'transform',
        zIndex: isPanelActive ? 50 : 10 + panel.index,
      }}
      className="absolute top-0 bottom-0 overflow-visible"
    >
      {/* 1. Sliced Image Column (overflow-hidden to guarantee clean slice) */}
      <div className="absolute inset-0 overflow-hidden w-full h-full">
        <img
          src={campaignMasterImg}
          alt={`COSMIC Architectural Column ${panel.index + 1}`}
          loading="eager"
          decoding="async"
          style={{
            position: 'absolute',
            top: 0,
            left: `-${panel.index * 100}%`,
            width: '500%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'contrast(108%) brightness(96%)',
            transform: 'translate3d(0,0,0)',
            willChange: 'transform',
          }}
          className="select-none max-w-none"
        />

        {/* Hairline Panel Seam Chrome Line */}
        <motion.div
          style={{ opacity: seamOpacity }}
          className="absolute inset-y-0 right-0 w-[1px] bg-white/30 pointer-events-none"
        />
        <motion.div
          style={{ opacity: seamOpacity }}
          className="absolute inset-y-0 left-0 w-[1px] bg-white/10 pointer-events-none"
        />
      </div>

      {/* 2. Museum Exhibit Hotspots Anchored to this Panel (Moves with the panel!) */}
      <div className="absolute inset-0 pointer-events-auto">
        {hotspots.map((hotspot) => (
          <MuseumExhibitMarker
            key={hotspot.id}
            hotspot={hotspot}
            isActive={activeHotspotId === hotspot.id}
            revealState={revealState}
            onToggle={(e) => onToggleHotspot(hotspot.id, e)}
            onNavigate={(e) => onNavigate(hotspot.slug, e)}
          />
        ))}
      </div>
    </motion.div>
  );
});

// Sub-component: Museum Exhibit Marker & Minimal Floating Luxury Preview
const MuseumExhibitMarker = React.memo(function MuseumExhibitMarker({
  hotspot,
  isActive,
  revealState,
  onToggle,
  onNavigate,
}) {
  const isRevealed = revealState === 'revealed';

  // Phase 3 Stagger:
  // Sequential reveal order: Ring (0) -> Necklaces (1..3) -> Bracelet (4) -> Earrings (5..6)
  // 75ms stagger between consecutive items for subtle, organic discovery
  const staggerDelayMs = (hotspot.revealOrder || 0) * 75;

  return (
    <div
      id={`hotspot-${hotspot.id}`}
      style={{
        left: `${hotspot.panelX}%`,
        top: `${hotspot.y}%`,
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed
          ? 'translate3d(-50%, -50%, 0) scale(1)'
          : 'translate3d(-50%, -50%, 0) scale(0.6)',
        pointerEvents: isRevealed ? 'auto' : 'none',
        // When revealing: each item staggers smoothly. When hiding: instant clean dismissal with 0ms delay.
        transition: isRevealed
          ? `opacity 400ms cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelayMs}ms, transform 450ms cubic-bezier(0.16, 1, 0.3, 1) ${staggerDelayMs}ms`
          : 'opacity 120ms ease-out 0ms, transform 120ms ease-out 0ms',
      }}
      className="museum-marker-anchor absolute z-30"
    >
      {/* Exhibit Marker Button */}
      <button
        type="button"
        id={`btn-hotspot-${hotspot.id}`}
        onClick={onToggle}
        className="relative group p-2 cursor-pointer focus:outline-none flex items-center justify-center select-none"
        aria-label={`Inspect ${hotspot.name}`}
      >
        {/* Outer subtle breathing pulse */}
        <span className="absolute w-5 h-5 rounded-full border border-white/40 animate-ping opacity-40 pointer-events-none" />

        {/* Architectural Chrome Ring */}
        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-300 backdrop-blur-md ${
          isActive
            ? 'bg-white border-white scale-110 shadow-[0_0_12px_#ffffff]'
            : 'bg-black/70 border-white/80 group-hover:scale-125 group-hover:border-white shadow-[0_0_8px_rgba(255,255,255,0.3)]'
        }`}>
          {/* Inner Pin Dot */}
          <span className={`w-1 h-1 rounded-full transition-colors ${
            isActive ? 'bg-black' : 'bg-white shadow-[0_0_4px_#ffffff]'
          }`} />
        </div>

        {/* Minimal Museum Code Tag (e.g. [01]) */}
        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[7px] font-mono tracking-widest text-[#A0A0A0] group-hover:text-white transition-colors pointer-events-none whitespace-nowrap bg-black/60 px-1 py-0.2 rounded border border-white/10">
          {hotspot.code}
        </span>
      </button>

      {/* MINIMAL FLOATING LUXURY PRODUCT PREVIEW */}
      {isActive && (
        <div
          id={`preview-card-${hotspot.id}`}
          onClick={(e) => e.stopPropagation()}
          className={`absolute z-50 bottom-full mb-3.5 min-w-[170px] sm:min-w-[190px] max-w-[220px] bg-[#090909]/95 backdrop-blur-xl border border-white/25 p-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.85)] animate-fade-in text-left pointer-events-auto rounded-sm ${
            hotspot.panelIndex >= 3 ? 'right-0' : hotspot.panelIndex <= 1 ? 'left-0' : 'left-1/2 -translate-x-1/2'
          }`}
        >
          {/* Subtle Hairline Pointer Triangle */}
          <div
            className={`absolute -bottom-1.5 w-3 h-3 bg-[#090909] border-b border-r border-white/25 rotate-45 ${
              hotspot.panelIndex >= 3 ? 'right-4' : hotspot.panelIndex <= 1 ? 'left-4' : 'left-1/2 -translate-x-1/2'
            }`}
          />

          {/* Micro Category & Code Header */}
          <div className="flex items-center justify-between text-[8px] font-mono uppercase tracking-[0.25em] text-[#808080] mb-1">
            <span>{hotspot.category}</span>
            <span className="text-[#C0C0C0]">[{hotspot.code}]</span>
          </div>

          {/* Product Name */}
          <h4 className="font-serif text-xs uppercase tracking-wide text-white leading-snug mb-1">
            {hotspot.name}
          </h4>

          {/* Price */}
          <div className="font-mono text-xs text-white chrome-gradient-text font-semibold mb-3">
            ₹{hotspot.price}
          </div>

          {/* Minimal Action Link */}
          <button
            type="button"
            id={`view-product-btn-${hotspot.id}`}
            onClick={onNavigate}
            className="w-full pt-2 border-t border-white/15 text-[9px] uppercase font-mono tracking-[0.2em] text-[#C0C0C0] hover:text-white flex items-center justify-between group/btn transition-colors cursor-pointer"
          >
            <span>View Product</span>
            <span className="group-hover/btn:translate-x-1 transition-transform text-white">→</span>
          </button>
        </div>
      )}
    </div>
  );
});
