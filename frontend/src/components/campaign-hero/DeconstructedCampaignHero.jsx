import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import campaignMasterImg from '../../assets/cosmic_campaign_master.jpg';
import lunarImg from '../../assets/lunar_collection.jpg';
import eclipseImg from '../../assets/eclipse_collection.jpg';
import novaImg from '../../assets/nova_collection.jpg';
import CampaignProductPanel from './CampaignProductPanel.jsx';
import FloatingBuyNowDrawer from '../luxury-mobile/FloatingBuyNowDrawer.jsx';
import { ArrowDown, Sparkles } from 'lucide-react';

const CAMPAIGN_PIECES = [
  {
    id: "34bbdbad-11bb-4ffc-a641-dae851c1ad52",
    slug: "lunar-silver-ring",
    name: "Lunar Silver Ring",
    price: 799,
    category: "Rings",
    image: lunarImg,
    origin: { x: -80, y: -60 }, // On left hand
    destDesktop: { x: -320, y: -160, rotate: -4 },
    destMobile: { x: -90, y: -210, rotate: -3 },
  },
  {
    id: "celestial-pendant-001",
    slug: "celestial-pendant",
    name: "Celestial Star Pendant",
    price: 1299,
    category: "Necklaces",
    image: eclipseImg,
    origin: { x: 0, y: 30 }, // On neck/chest
    destDesktop: { x: 0, y: -200, rotate: 0 },
    destMobile: { x: 85, y: -220, rotate: 2 },
  },
  {
    id: "stellar-chain-002",
    slug: "stellar-chain",
    name: "Stellar Curb Chain",
    price: 1499,
    category: "Necklaces",
    image: novaImg,
    origin: { x: -20, y: 0 }, // Collarbone drape
    destDesktop: { x: -330, y: 150, rotate: 3 },
    destMobile: { x: -95, y: -10, rotate: 2 },
  },
  {
    id: "orbit-bracelet-003",
    slug: "orbit-bracelet",
    name: "Orbit Liquid Bangle",
    price: 999,
    category: "Bracelets",
    image: lunarImg,
    origin: { x: 80, y: 120 }, // Lower right wrist
    destDesktop: { x: 330, y: 140, rotate: -3 },
    destMobile: { x: 90, y: 0, rotate: -3 },
  },
  {
    id: "nova-eclipse-ring-004",
    slug: "nova-eclipse-ring",
    name: "Nova Geometric Studs",
    price: 649,
    category: "Earrings",
    image: novaImg,
    origin: { x: 85, y: -110 }, // Ear lobe
    destDesktop: { x: 320, y: -170, rotate: 4 },
    destMobile: { x: -85, y: 195, rotate: -2 },
  },
  {
    id: "cosmic-signature-pendant-005",
    slug: "cosmic-signature-pendant",
    name: "Cosmic Signature Piece",
    price: 1599,
    category: "Haute Joaillerie",
    image: eclipseImg,
    origin: { x: 0, y: 80 }, // Center focal
    destDesktop: { x: 0, y: 220, rotate: 0 },
    destMobile: { x: 85, y: 190, rotate: 3 },
  },
];

export default function DeconstructedCampaignHero({ onQuickBuyProduct }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1. Background Master Photograph Transforms
  const imageScale = useTransform(scrollYProgress, [0, 0.15, 0.65], [1.0, 1.03, 1.1]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.2, 0.6], [1.0, 0.85, 0.22]);
  const imageBlur = useTransform(
    scrollYProgress,
    [0, 0.2, 0.6],
    ["blur(0px)", "blur(3px)", "blur(14px)"]
  );

  // 2. Typography Cross-Fades
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.15, 0.25], [1.0, 0.7, 0.0]);
  const deconstructedTitleOpacity = useTransform(
    scrollYProgress,
    [0.22, 0.38, 0.85, 0.95],
    [0.0, 1.0, 1.0, 0.4]
  );
  const scrollPromptOpacity = useTransform(scrollYProgress, [0, 0.12], [1.0, 0.0]);

  // 3. Panel Deconstruction Progress (0 at start, 1 when fully separated)
  const deconstructProgress = useTransform(scrollYProgress, [0.15, 0.62], [0, 1]);
  const panelOpacity = useTransform(scrollYProgress, [0.12, 0.25, 0.65], [0.0, 0.7, 1.0]);

  // Quick Buy Drawer State
  const [drawerProduct, setDrawerProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleInspect = (product) => {
    navigate(`/cinematic/product/${product.slug}`);
  };

  const handleQuickBuy = (product) => {
    setDrawerProduct(product);
    setIsDrawerOpen(true);
  };

  return (
    <div ref={containerRef} className="relative w-full h-[360vh] bg-black">
      {/* PINNED STICKY VIEWPORT CONTAINER */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black flex items-center justify-center select-none">
        
        {/* 1. MASTER HIGH-FASHION CAMPAIGN PHOTOGRAPH */}
        <motion.div
          style={{
            scale: imageScale,
            opacity: imageOpacity,
            filter: imageBlur,
          }}
          className="absolute inset-0 z-0 w-full h-full"
        >
          <img
            src={campaignMasterImg}
            alt="COSMIC Fashion Campaign"
            className="w-full h-full object-cover object-center filter contrast-110 brightness-95"
          />
          {/* Chiaroscuro Atmospheric Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/10 to-black/80 pointer-events-none" />
        </motion.div>

        {/* 2. INITIAL CAMPAIGN HERO BRANDING (Scroll 0 -> 0.2) */}
        <motion.div
          style={{ opacity: heroTextOpacity }}
          className="absolute inset-0 z-10 flex flex-col justify-between items-center p-6 sm:p-12 text-center pointer-events-none"
        >
          {/* Top Campaign Eyebrow */}
          <div className="pt-16 sm:pt-20">
            <span className="text-[10px] uppercase tracking-[0.5em] text-[#C0C0C0] font-mono block drop-shadow-md">
              HAUTE JOAILLERIE • CAMPAIGN MMXXVI
            </span>
          </div>

          {/* Center Space for Model Adornment */}
          <div className="flex-1" />

          {/* Bottom Title & Scroll Invitation */}
          <div className="space-y-4 pb-8 max-w-lg">
            <h1 className="font-serif text-4xl sm:text-6xl uppercase tracking-[0.3em] text-white font-light drop-shadow-2xl">
              COSMIC
            </h1>
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#A0A0A0] font-light">
              FORGED IN INTENTION
            </p>
            <motion.div
              style={{ opacity: scrollPromptOpacity }}
              className="pt-4 flex flex-col items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#707070]"
            >
              <span>Scroll to deconstruct composition</span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowDown className="w-3.5 h-3.5 text-[#A0A0A0]" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* 3. DECONSTRUCTION TITLE (Appears as panels separate) */}
        <motion.div
          style={{ opacity: deconstructedTitleOpacity }}
          className="absolute top-16 sm:top-20 left-0 right-0 z-10 text-center px-4 pointer-events-none"
        >
          <span className="text-[9px] uppercase tracking-[0.45em] text-[#A0A0A0] font-mono block">
            DECONSTRUCTION // MMXXVI
          </span>
          <h2 className="font-serif text-xl sm:text-3xl uppercase tracking-[0.2em] text-white font-light mt-1">
            Pieces Within The Silhouette
          </h2>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#606060] mt-1 font-mono">
            Extracted from the composition • Tap to inspect or purchase
          </p>
        </motion.div>

        {/* 4. THE 6 FLOATING DECONSTRUCTED PRODUCT PANELS */}
        <div className="relative z-20 w-full h-full max-w-6xl mx-auto flex items-center justify-center pointer-events-none">
          {CAMPAIGN_PIECES.map((piece, idx) => {
            const dest = isMobile ? piece.destMobile : piece.destDesktop;

            // Interpolate position from origin to destination as scroll advances
            return (
              <DeconstructedPiecePanel
                key={piece.id}
                index={idx + 1}
                piece={piece}
                origin={piece.origin}
                destination={dest}
                progress={deconstructProgress}
                opacity={panelOpacity}
                onInspect={handleInspect}
                onQuickBuy={handleQuickBuy}
                isMobile={isMobile}
              />
            );
          })}
        </div>
      </div>

      {/* IN-PLACE 75vh FLOATING BUY NOW DRAWER */}
      <FloatingBuyNowDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        product={drawerProduct}
      />
    </div>
  );
}

// Sub-component computing smooth scroll physics for each floating panel
function DeconstructedPiecePanel({
  index,
  piece,
  origin,
  destination,
  progress,
  opacity,
  onInspect,
  onQuickBuy,
  isMobile,
}) {
  const x = useTransform(progress, [0, 1], [origin.x, destination.x]);
  const y = useTransform(progress, [0, 1], [origin.y, destination.y]);
  const rotate = useTransform(progress, [0, 1], [0, destination.rotate || 0]);
  const scale = useTransform(
    progress,
    [0, 0.4, 1],
    [0.75, 0.95, isMobile ? 0.92 : 1.0]
  );

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
      }}
      className={`absolute pointer-events-auto ${
        isMobile ? 'w-[155px]' : 'w-[240px]'
      }`}
    >
      <CampaignProductPanel
        panelIndex={index}
        product={piece}
        onInspect={onInspect}
        onQuickBuy={onQuickBuy}
      />
    </motion.div>
  );
}
