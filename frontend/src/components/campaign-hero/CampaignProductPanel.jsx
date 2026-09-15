import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Eye, Sparkles } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext.jsx';

export default function CampaignProductPanel({
  panelIndex,
  product,
  onQuickBuy,
  onInspect,
  style = {},
  className = '',
}) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  return (
    <motion.div
      style={style}
      whileHover={{ scale: 1.04, y: -4 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onInspect(product)}
      className={`relative bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/20 hover:border-white/50 rounded-2xl p-4 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_25px_rgba(255,255,255,0.08)] flex flex-col justify-between cursor-pointer group select-none transition-colors ${className}`}
    >
      {/* Specular Rim Light Gradient Sweep */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />

      {/* Top Meta: Index & Wishlist */}
      <div className="flex items-center justify-between z-10 mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#A0A0A0] bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
            PIECE 0{panelIndex}
          </span>
          <span className="text-[8px] font-mono uppercase tracking-widest text-[#606060]">
            S925
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="p-1.5 rounded-full bg-black/60 border border-white/15 hover:border-white/40 text-white transition-all cursor-pointer shadow-sm"
          title="Preserve in Vault"
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              inWishlist ? 'fill-red-500 text-red-500' : 'text-[#A0A0A0]'
            }`}
          />
        </button>
      </div>

      {/* Macro Jewelry Imagery */}
      <div className="aspect-square relative overflow-hidden bg-black/80 border border-white/10 rounded-xl mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover filter brightness-95 contrast-105 group-hover:scale-108 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
          <span className="text-[9px] uppercase tracking-widest text-white font-medium flex items-center gap-1">
            <Eye className="w-3 h-3 text-[#C0C0C0]" />
            <span>Inspect Macro Detail</span>
          </span>
        </div>
      </div>

      {/* Product Details & Action Buttons */}
      <div className="space-y-2 z-10">
        <div>
          <h4 className="font-serif text-sm tracking-wide text-white truncate group-hover:text-[#D0D0D0] transition-colors">
            {product.name}
          </h4>
          <div className="flex items-baseline justify-between pt-0.5">
            <span className="font-mono text-xs text-white font-semibold">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            <span className="text-[8px] uppercase tracking-widest text-[#707070]">
              Liquid Rhodium
            </span>
          </div>
        </div>

        <div className="pt-1 flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickBuy(product);
            }}
            className="flex-1 py-2 chrome-button text-[9px] uppercase tracking-[0.2em] font-bold text-black rounded-lg cursor-pointer shadow-[0_0_15px_rgba(192,192,192,0.3)] transition-all hover:scale-[1.02] active:scale-95"
          >
            Instant Buy →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
