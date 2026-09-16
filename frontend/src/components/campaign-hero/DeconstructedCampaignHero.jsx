import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import campaignMasterImg from '../../assets/cosmic_campaign_master.webp';
import { ArrowDown } from 'lucide-react';

// 5 Architectural Panels
const PANELS = [
  { index: 0, clip: 'inset(0 80% 0 0)', dx: -24, dy: -8, mobileDx: -10, mobileDy: -4 },
  { index: 1, clip: 'inset(0 60% 0 20%)', dx: -12, dy: 6, mobileDx: -5, mobileDy: 3 },
  { index: 2, clip: 'inset(0 40% 0 40%)', dx: 0, dy: -4, mobileDx: 0, mobileDy: -2 },
  { index: 3, clip: 'inset(0 20% 0 60%)', dx: 12, dy: 8, mobileDx: 5, mobileDy: 4 },
  { index: 4, clip: 'inset(0 0 0 80%)', dx: 24, dy: -6, mobileDx: 10, mobileDy: -3 },
];

// Subtle Product Pinpoint Indicators (Subtle circles, thin chrome outlines, tiny glow, NO cards, NO prices)
const PRODUCT_INDICATORS = [
  {
    id: "ring",
    slug: "lunar-silver-ring",
    code: "01",
    label: "Ring",
    x: "41%",
    y: "55%",
  },
  {
    id: "pendant",
    slug: "celestial-pendant",
    code: "02",
    label: "Pendant",
    x: "50%",
    y: "40%",
  },
  {
    id: "chain",
    slug: "stellar-chain",
    code: "03",
    label: "Chain",
    x: "47%",
    y: "32%",
  },
  {
    id: "bangle",
    slug: "orbit-bracelet",
    code: "04",
    label: "Bangle",
    x: "63%",
    y: "64%",
  },
  {
    id: "earring",
    slug: "nova-eclipse-ring",
    code: "05",
    label: "Earring",
    x: "58%",
    y: "24%",
  },
];

export default function DeconstructedCampaignHero() {
  const containerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });

  useEffect(() => {
    let timer = null;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsMobile(window.innerWidth < 768);
      }, 100);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1. Image Split Progress: 0 at start, 1 at peak split
  const splitProgress = useTransform(scrollYProgress, [0.05, 0.45], [0, 1]);

  // 2. Initial Brand Header Fade Out
  const brandOpacity = useTransform(scrollYProgress, [0, 0.15], [1.0, 0.0]);

  // 3. Deconstruction Metadata Fade In
  const deconstructMetaOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.35, 0.7, 0.9],
    [0.0, 1.0, 1.0, 0.0]
  );

  // 4. Subtle Product Indicators Fade In
  const indicatorsOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.4, 0.72, 0.92],
    [0.0, 1.0, 1.0, 0.0]
  );

  // 5. Scroll Prompt Fade Out
  const scrollPromptOpacity = useTransform(scrollYProgress, [0, 0.1], [1.0, 0.0]);

  // 6. Cinematic Hero Exit Dissolve: panels fade away smoothly as collection enters
  const heroExitOpacity = useTransform(scrollYProgress, [0.7, 0.95], [1.0, 0.0]);

  const scrollToCollection = () => {
    const el = document.getElementById('featured-collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToProduct = () => {
    scrollToCollection();
  };

  return (
    <div ref={containerRef} className="relative w-full h-[140vh] bg-black">
      {/* PINNED HERO VIEWPORT */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex flex-col items-center justify-center select-none px-4 sm:px-8">
        
        {/* Subtle Background Radial Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#111111] via-[#060606] to-black pointer-events-none" />

        {/* 1. INITIAL TOP BRANDING OVERLAY (Scroll 0 -> 0.18) */}
        <motion.div
          style={{ opacity: brandOpacity }}
          className="absolute top-12 sm:top-14 left-0 right-0 z-20 text-center pointer-events-none px-4"
        >
          <span className="text-[9px] uppercase tracking-[0.45em] text-[#A0A0A0] font-mono block">
            MILAN • PARIS • NEW YORK
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl uppercase tracking-[0.25em] text-white font-light mt-1">
            COSMIC
          </h1>
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#707070] mt-1 font-light">
            HAUTE JOAILLERIE // CAMPAIGN MMXXVI
          </p>
        </motion.div>

        {/* 2. DECONSTRUCTION METADATA TITLE (Appears as panels divide) */}
        <motion.div
          style={{ opacity: deconstructMetaOpacity }}
          className="absolute top-12 sm:top-14 left-0 right-0 z-20 text-center pointer-events-none px-4"
        >
          <span className="text-[9px] uppercase tracking-[0.4em] text-[#A0A0A0] font-mono block">
            EDITORIAL DECONSTRUCTION
          </span>
          <h2 className="font-serif text-xl sm:text-2xl uppercase tracking-[0.2em] text-white font-light mt-0.5">
            5 Architectural Panels
          </h2>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#707070] font-mono mt-0.5">
            Indicators reveal pieces featured within the silhouette
          </p>
        </motion.div>

        {/* 3. CENTRAL CAMPAIGN IMAGE FRAME (Fades out into dark transition at hero exit) */}
        <motion.div
          style={{ opacity: heroExitOpacity }}
          className="relative w-full max-w-4xl lg:max-w-5xl h-[72vh] sm:h-[78vh] flex items-center justify-center my-auto"
        >
          
          {/* Base Unified Master Image (Prevents any visual gaps) */}
          <div className="absolute inset-0 rounded-lg overflow-hidden opacity-20 pointer-events-none">
            <img
              src={campaignMasterImg}
              alt="COSMIC Master Silhouette"
              className="w-full h-full object-cover object-center filter contrast-105 brightness-90"
            />
          </div>

          {/* 5 ARCHITECTURAL SPLIT PANELS */}
          <div className="relative w-full h-full">
            {PANELS.map((panel) => {
              return (
                <SplitImagePanel
                  key={panel.index}
                  panel={panel}
                  progress={splitProgress}
                  isMobile={isMobile}
                />
              );
            })}
          </div>

          {/* 4. SUBTLE PRODUCT PINPOINT INDICATORS (NO cards, NO prices, NO buy buttons) */}
          <motion.div
            style={{ opacity: indicatorsOpacity }}
            className="absolute inset-0 pointer-events-auto"
          >
            {PRODUCT_INDICATORS.map((indicator) => (
              <SubtleProductBeacon
                key={indicator.id}
                indicator={indicator}
                onClick={scrollToProduct}
              />
            ))}
          </motion.div>

          {/* Atmospheric Frame Vignette */}
          <div className="absolute inset-0 rounded-lg pointer-events-none shadow-[inset_0_0_50px_rgba(0,0,0,0.6)]" />
        </motion.div>

        {/* 5. INITIAL SCROLL INVITATION PROMPT */}
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

        {/* 6. TRANSITION INVITATION TO COLLECTION SECTION */}
        <motion.div
          style={{ opacity: deconstructMetaOpacity }}
          className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center gap-1.5 pointer-events-auto"
        >
          <button
            type="button"
            onClick={scrollToCollection}
            className="group flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/30 text-[9px] uppercase tracking-[0.25em] text-[#B0B0B0] hover:text-white transition-all cursor-pointer font-mono"
          >
            <span>Explore Editorial Showcase</span>
            <ArrowDown className="w-3 h-3 group-hover:translate-y-0.5 transition-transform text-white" />
          </button>
        </motion.div>

      </div>
    </div>
  );
}

// Sub-component: A single architectural slice of the master photograph (Memoized)
const SplitImagePanel = React.memo(function SplitImagePanel({ panel, progress, isMobile }) {
  const targetX = isMobile ? panel.mobileDx : panel.dx;
  const targetY = isMobile ? panel.mobileDy : panel.dy;

  // Smooth transforms from together (0, 0) to slight separation
  const x = useTransform(progress, [0, 1], [0, targetX]);
  const y = useTransform(progress, [0, 1], [0, targetY]);

  // Subtle hairline panel border fades in as panels separate
  const borderOpacity = useTransform(progress, [0.1, 0.4], [0, 0.4]);

  return (
    <motion.div
      style={{
        x,
        y,
        clipPath: panel.clip,
        transform: 'translate3d(0,0,0)',
        willChange: 'transform',
      }}
      className="absolute inset-0 w-full h-full overflow-hidden"
    >
      {/* The Master Image slice */}
      <img
        src={campaignMasterImg}
        alt="COSMIC Architectural Panel"
        loading="eager"
        decoding="async"
        className="w-full h-full object-cover object-center filter contrast-110 brightness-95 select-none"
      />

      {/* Subtle Hairline Chrome Panel Border */}
      <motion.div
        style={{ opacity: borderOpacity }}
        className="absolute inset-0 border-r border-l border-white/20 pointer-events-none"
      />
    </motion.div>
  );
});

// Sub-component: Subtle glowing chrome pinpoint beacon (Memoized)
const SubtleProductBeacon = React.memo(function SubtleProductBeacon({ indicator, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{ left: indicator.x, top: indicator.y }}
      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={`Piece ${indicator.code}: ${indicator.label} (Click to view in collection)`}
    >
      {/* Outer Subtle Pulse Ring */}
      <div className="relative flex items-center justify-center">
        <span className="absolute w-6 h-6 rounded-full border border-white/30 animate-ping opacity-50 pointer-events-none" />
        
        {/* Core Chrome Ring */}
        <div className="w-5 h-5 rounded-full bg-black/60 border border-white/80 flex items-center justify-center shadow-[0_0_12px_rgba(255,255,255,0.4)] group-hover:scale-125 group-hover:border-white transition-transform duration-300">
          {/* Inner Pin Dot */}
          <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
        </div>

        {/* Minimalist Micro Code Badge (Appears subtly on hover / touch) */}
        <div
          className={`absolute left-7 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-black/80 border border-white/20 text-[8px] font-mono uppercase tracking-widest text-[#E0E0E0] whitespace-nowrap transition-all duration-300 pointer-events-none ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1'
          }`}
        >
          <span>{indicator.code} // {indicator.label}</span>
        </div>
      </div>
    </div>
  );
});
