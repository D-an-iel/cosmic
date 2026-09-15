import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Eye, ShieldCheck, Sparkles } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext.jsx';
import FloatingBuyNowDrawer from '../luxury-mobile/FloatingBuyNowDrawer.jsx';

import lunarImg from '../../assets/lunar_collection.jpg';
import eclipseImg from '../../assets/eclipse_collection.jpg';
import novaImg from '../../assets/nova_collection.jpg';
import ringHeroImg from '../../assets/lunar_ring_hero.jpg';

export const CAMPAIGN_PRODUCTS = [
  {
    id: "34bbdbad-11bb-4ffc-a641-dae851c1ad52",
    slug: "lunar-silver-ring",
    name: "Lunar Silver Ring",
    code: "PIECE 01",
    price: 799,
    category: "Rings",
    image: ringHeroImg,
    finish: "Liquid Rhodium",
    material: "Solid 925 Sterling Silver",
    description: "Hand-beveled architectural band with liquid mercury luster. Worn on left hand in campaign.",
  },
  {
    id: "celestial-pendant-001",
    slug: "celestial-pendant",
    name: "Celestial Star Pendant",
    code: "PIECE 02",
    price: 1299,
    category: "Necklaces",
    image: eclipseImg,
    finish: "Mirror Polish",
    material: "Solid 925 Sterling Silver",
    description: "Four-pointed star pendant with deep shadow beveled facetting.",
  },
  {
    id: "stellar-chain-002",
    slug: "stellar-chain",
    name: "Stellar Curb Chain",
    code: "PIECE 03",
    price: 1499,
    category: "Necklaces",
    image: novaImg,
    finish: "High Gloss Rhodium",
    material: "Solid 925 Sterling Silver",
    description: "Precision diamond-cut links designed for liquid drape along the collarbone.",
  },
  {
    id: "orbit-bracelet-003",
    slug: "orbit-bracelet",
    name: "Orbit Liquid Bangle",
    code: "PIECE 04",
    price: 999,
    category: "Bracelets",
    image: lunarImg,
    finish: "Liquid Rhodium",
    material: "Solid 925 Sterling Silver",
    description: "Sculptural toroid bangle with seamless ergonomic wrist contour.",
  },
  {
    id: "nova-eclipse-ring-004",
    slug: "nova-eclipse-ring",
    name: "Nova Geometric Studs",
    code: "PIECE 05",
    price: 649,
    category: "Earrings",
    image: novaImg,
    finish: "Mirror Silver",
    material: "Solid 925 Sterling Silver",
    description: "Minimalist celestial studs catching ambient light at every rotation.",
  },
  {
    id: "cosmic-signature-pendant-005",
    slug: "cosmic-signature-pendant",
    name: "Cosmic Signature Piece",
    code: "PIECE 06",
    price: 1599,
    category: "Haute Joaillerie",
    image: eclipseImg,
    finish: "Liquid Rhodium & Obsidian",
    material: "Solid 925 Sterling Silver",
    description: "The campaign centerpiece. Architectural geometry forged with celestial proportion.",
  },
];

export default function CampaignCollectionGrid() {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleInstantBuy = (product, e) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleInspect = (product) => {
    navigate(`/cinematic/product/${product.slug}`);
  };

  return (
    <section id="campaign-collection" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto relative z-20">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] uppercase tracking-[0.3em] text-[#A0A0A0] font-mono">
          <Sparkles className="w-3 h-3 text-[#C0C0C0]" />
          <span>FEATURED COLLECTION // CATALOGUE</span>
        </div>
        <h3 className="font-serif text-3xl sm:text-5xl uppercase tracking-[0.15em] text-white font-light">
          The Campaign Adornments
        </h3>
        <p className="text-xs sm:text-sm text-[#909090] font-light leading-relaxed max-w-xl mx-auto pt-1">
          Every piece highlighted within the editorial silhouette is individually cast in solid 925 sterling silver, hand-beveled, and immersion-finished in liquid rhodium.
        </p>
      </div>

      {/* Product Grid: 1 col mobile, 2 col tablet, 3 col desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {CAMPAIGN_PRODUCTS.map((product) => {
          const inWishlist = isInWishlist(product.id);

          return (
            <motion.div
              key={product.id}
              id={`product-${product.slug}`}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={() => handleInspect(product)}
              className="group relative bg-[#090909] border border-white/10 hover:border-white/30 rounded-2xl p-5 flex flex-col justify-between cursor-pointer transition-all shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              {/* Card Specular Rim Highlight */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/5 via-transparent to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Top Card Meta */}
                <div className="flex items-center justify-between mb-3 z-10 relative">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#C0C0C0] bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      {product.code}
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-[#707070]">
                      {product.category}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className="p-2 rounded-full bg-black/60 border border-white/15 hover:border-white/40 text-white transition-all cursor-pointer"
                    title="Preserve in Private Vault"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        inWishlist ? 'fill-red-500 text-red-500' : 'text-[#909090]'
                      }`}
                    />
                  </button>
                </div>

                {/* Macro Imagery */}
                <div className="aspect-square relative overflow-hidden rounded-xl bg-black/60 border border-white/10 mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-[10px] uppercase tracking-widest text-white font-medium flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#C0C0C0]" />
                      <span>View Macro Editorial Dossier</span>
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1.5 z-10 relative">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-serif text-lg text-white font-normal tracking-wide group-hover:text-[#D0D0D0] transition-colors">
                      {product.name}
                    </h4>
                    <span className="font-mono text-sm text-white font-semibold">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#808080] font-light line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-[9px] font-mono uppercase tracking-wider text-[#606060]">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>S925 Hallmark</span>
                    </span>
                    <span>•</span>
                    <span>{product.finish}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-4 border-t border-white/10 flex gap-2.5 z-10 relative">
                <button
                  type="button"
                  onClick={(e) => handleInstantBuy(product, e)}
                  className="flex-1 py-3 chrome-button text-[10px] uppercase tracking-[0.2em] font-bold text-black rounded-lg cursor-pointer shadow-[0_0_15px_rgba(192,192,192,0.25)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>Instant Buy</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating In-Place Checkout Drawer */}
      <FloatingBuyNowDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        product={selectedProduct}
      />
    </section>
  );
}
