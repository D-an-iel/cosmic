import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, ArrowRight, Eye } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext.jsx';
import FloatingBuyNowDrawer from '../luxury-mobile/FloatingBuyNowDrawer.jsx';

export default function Spatial3DCollection({ products = [] }) {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedQuickBuy, setSelectedQuickBuy] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const safeProducts = products.length > 0 ? products : [];

  const filteredProducts = activeCategory === 'All'
    ? safeProducts
    : safeProducts.filter((p) => {
        const cat = p.category?.toLowerCase() || '';
        return cat.includes(activeCategory.toLowerCase());
      });

  const count = filteredProducts.length;

  const handleNext = () => {
    setActiveIndex((prev) => (prev < count - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : count - 1));
  };

  return (
    <section id="spatial-collection" className="relative w-full py-20 bg-black overflow-hidden select-none font-sans">
      {/* 1. SECTION EDITORIAL HEADER */}
      <div className="max-w-4xl mx-auto px-6 text-center space-y-3 mb-10">
        <span className="text-[10px] uppercase tracking-[0.45em] text-[#A0A0A0] font-mono block">
          SPATIAL 3D ARCHITECTURE
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl uppercase tracking-wider text-white font-light">
          The Collections
        </h2>
        <p className="text-xs text-[#808080] font-light max-w-sm mx-auto leading-relaxed">
          Swipe or drag to orbit the gallery. Every piece is sculpted in solid 925 sterling silver and finished with liquid rhodium.
        </p>

        {/* Category Selector Pills */}
        <div className="flex justify-center gap-2 pt-4">
          {['All', 'Rings', 'Necklaces', 'Bracelets'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setActiveIndex(0);
              }}
              className={`px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] border rounded-full transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'border-white bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                  : 'border-white/15 text-[#888888] hover:border-white/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 2. THREE-DIMENSIONAL ORBIT CAROUSEL STAGE */}
      <div className="relative w-full h-[520px] sm:h-[580px] flex items-center justify-center perspective-[1200px]">
        {filteredProducts.map((product, idx) => {
          let offset = idx - activeIndex;
          if (offset > count / 2) offset -= count;
          if (offset < -count / 2) offset += count;

          const absOffset = Math.abs(offset);
          if (absOffset > 2) return null; // Cull cards out of sight

          const isCenter = offset === 0;
          const translateX = offset * 210; // spatial arc
          const translateZ = -absOffset * 95; // depth push
          const rotateY = offset * -15; // yaw inwards
          const scale = isCenter ? 1.06 : Math.max(0.78, 1 - absOffset * 0.16);
          const opacity = isCenter ? 1 : Math.max(0.35, 1 - absOffset * 0.45);
          const zIndex = 30 - absOffset * 10;

          const imgUrl =
            product.images?.[0]?.src ||
            product.gallery?.[0]?.src ||
            product.image ||
            '/assets/lunar_collection.jpg';

          const inWishlist = isInWishlist(product.id);

          return (
            <motion.div
              key={product.id || idx}
              onClick={() => {
                if (!isCenter) setActiveIndex(idx);
                else navigate(`/cinematic/product/${product.slug}`);
              }}
              animate={{
                x: translateX,
                z: translateZ,
                rotateY: rotateY,
                scale: scale,
                opacity: opacity,
              }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ zIndex }}
              className={`absolute w-[290px] sm:w-[330px] bg-[#070707] border ${
                isCenter
                  ? 'border-[#C0C0C0]/60 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(192,192,192,0.2)]'
                  : 'border-white/10 shadow-2xl'
              } p-5 rounded-2xl flex flex-col justify-between overflow-hidden cursor-pointer group select-none`}
            >
              {/* Card Top: Category & Wishlist Button */}
              <div className="flex items-center justify-between mb-3 z-10">
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#808080] font-mono">
                  {product.category || 'Fine Creation'}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className="p-2 rounded-full bg-black/70 border border-white/15 hover:border-white/40 text-white transition-all cursor-pointer"
                  title="Preserve in Vault"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      inWishlist ? 'fill-red-500 text-red-500' : 'text-[#C0C0C0]'
                    }`}
                  />
                </button>
              </div>

              {/* Jewelry Image with Specular Hover */}
              <div className="aspect-square relative overflow-hidden bg-neutral-950 border border-white/5 mb-4 rounded-xl">
                <img
                  src={imgUrl}
                  alt={product.name}
                  className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-[9px] uppercase tracking-widest text-white font-medium flex items-center gap-1">
                    <Eye className="w-3 h-3" /> View 4-Snap Story
                  </span>
                </div>
              </div>

              {/* Information & Action Buttons */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-serif text-lg tracking-wide text-white truncate group-hover:text-[#C0C0C0] transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="font-mono text-sm text-white font-medium">
                      ₹{Number(product.price).toLocaleString('en-IN')} INR
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-[#707070]">
                      Solid 925
                    </span>
                  </div>
                </div>

                {isCenter && (
                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedQuickBuy(product);
                        setIsDrawerOpen(true);
                      }}
                      className="flex-1 py-3 chrome-button text-[10px] uppercase tracking-[0.25em] font-bold text-black rounded-sm cursor-pointer shadow-[0_0_20px_rgba(192,192,192,0.35)] transition-all hover:scale-[1.02]"
                    >
                      Instant Buy →
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. PAGINATION ORBIT CONTROLS */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          type="button"
          onClick={handlePrev}
          className="p-2.5 rounded-full border border-white/20 hover:border-white text-white text-xs transition-colors cursor-pointer"
          aria-label="Previous Creation"
        >
          ←
        </button>

        <div className="flex items-center gap-2">
          {filteredProducts.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                idx === activeIndex
                  ? 'w-6 h-1 bg-white'
                  : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="p-2.5 rounded-full border border-white/20 hover:border-white text-white text-xs transition-colors cursor-pointer"
          aria-label="Next Creation"
        >
          →
        </button>
      </div>

      {/* 4. IN-PLACE 75vh FLOATING BUY NOW GLASS DRAWER */}
      <FloatingBuyNowDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        product={selectedQuickBuy}
      />
    </section>
  );
}
