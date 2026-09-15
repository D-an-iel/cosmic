import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Share2, Sparkles, ShieldCheck, Box } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext.jsx';
import FloatingBuyNowDrawer from './FloatingBuyNowDrawer.jsx';

import defaultHero from '../../assets/lunar_ring_hero.jpg';
import defaultMacro from '../../assets/lunar_ring_macro.jpg';
import defaultModel from '../../assets/lunar_ring_onmodel.jpg';
import defaultPackaging from '../../assets/lunar_ring_packaging.jpg';

export default function EditorialProductView({
  product,
  onAddToCart,
}) {
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Sizing & variant state
  const sizes = product?.sizes || ['6', '7', '8', '9', '10'];
  const [selectedSize, setSelectedSize] = useState('8');
  const [selectedColor, setSelectedColor] = useState('Liquid Rhodium');
  const [isBuyNowOpen, setIsBuyNowOpen] = useState(false);

  // Gallery items fallback
  const heroImg = product?.images?.[0]?.src || product?.gallery?.[0]?.src || product?.image || defaultHero;
  const macroImg = product?.images?.[1]?.src || product?.gallery?.[1]?.src || defaultMacro;
  const modelImg = product?.images?.[2]?.src || product?.gallery?.[2]?.src || defaultModel;
  const specImg = product?.images?.[3]?.src || product?.gallery?.[3]?.src || defaultPackaging;

  const inWishlist = isInWishlist(product?.id);

  if (!product) return null;

  return (
    <div className="relative w-full bg-black text-white selection:bg-[#C0C0C0] selection:text-black font-sans">
      {/* 1. TOP MINIMAL OVERLAY NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 z-30 h-16 px-5 flex items-center justify-between pointer-events-none">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-full bg-black/50 border border-white/10 hover:border-white/30 text-white backdrop-blur-md pointer-events-auto transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <Link to="/" className="font-serif tracking-[0.25em] text-xs uppercase text-white font-medium pointer-events-auto drop-shadow-md">
          COSMIC
        </Link>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            className="p-2.5 rounded-full bg-black/50 border border-white/10 hover:border-white/30 text-white backdrop-blur-md transition-all cursor-pointer"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-white'}`} />
          </button>
        </div>
      </header>

      {/* 2. VERTICAL SNAP CONTAINER (4 EDITORIAL VIEWPORTS) */}
      <div className="w-full h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-none">
        
        {/* SCREEN 1: HERO SCULPTURAL PHOTOGRAPHY */}
        <section className="relative w-full h-[100dvh] snap-start snap-always flex flex-col justify-end p-6 sm:p-10 pb-28 sm:pb-32 overflow-hidden bg-black">
          <div className="absolute inset-0 z-0">
            <img
              src={heroImg}
              alt={product.name}
              className="w-full h-full object-cover object-center filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
          </div>

          <div className="relative z-10 space-y-2 max-w-lg animate-fadeIn">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C0C0C0] font-mono block">
              SCREEN 01 // HERO ARCHITECTURE
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wider text-white font-light">
              {product.name}
            </h1>
            <p className="font-mono text-base text-white font-medium">
              ₹{Number(product.price).toLocaleString('en-IN')} INR
            </p>
            <p className="text-xs text-[#A0A0A0] font-light max-w-sm pt-1 leading-relaxed">
              Forged from solid 925 sterling silver and finished with liquid rhodium for eternal brilliance.
            </p>
            <div className="text-[9px] font-mono uppercase tracking-widest text-[#707070] pt-2">
              ↓ Scroll vertically for craft exploration
            </div>
          </div>
        </section>

        {/* SCREEN 2: CLOSE-UP MACRO CRAFT DETAIL */}
        <section className="relative w-full h-[100dvh] snap-start snap-always flex flex-col justify-end p-6 sm:p-10 pb-28 sm:pb-32 overflow-hidden bg-black">
          <div className="absolute inset-0 z-0">
            <img
              src={macroImg}
              alt="Macro Craft Detail"
              className="w-full h-full object-cover object-center filter contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50" />
          </div>

          <div className="relative z-10 space-y-2 max-w-lg">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C0C0C0] font-mono block">
              SCREEN 02 // 10X MACRO PRECISION
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-white">
              The Geometry of Liquid Rhodium
            </h2>
            <p className="text-xs text-[#A0A0A0] font-light max-w-sm leading-relaxed">
              Every curve is hand-finished in our atelier. Inspected under 10x magnification to guarantee mirror-sheen reflection and registered S925 hallmark assaying.
            </p>
          </div>
        </section>

        {/* SCREEN 3: LIFESTYLE PHOTOGRAPHY ON MODEL */}
        <section className="relative w-full h-[100dvh] snap-start snap-always flex flex-col justify-end p-6 sm:p-10 pb-28 sm:pb-32 overflow-hidden bg-black">
          <div className="absolute inset-0 z-0">
            <img
              src={modelImg}
              alt="Editorial On Model"
              className="w-full h-full object-cover object-center filter grayscale contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
          </div>

          <div className="relative z-10 space-y-2 max-w-lg">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C0C0C0] font-mono block">
              SCREEN 03 // MILANESE SALON
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider text-white">
              Sculptural Presence
            </h2>
            <p className="text-xs text-[#A0A0A0] font-light max-w-sm leading-relaxed">
              Conceived for those who view adornment as self-sovereignty. Engineered with weighted ergonomic balance for seamless all-day tactile comfort.
            </p>
          </div>
        </section>

        {/* SCREEN 4: SPECIFICATIONS & SIZE MATRIX */}
        <section className="relative w-full h-[100dvh] snap-start snap-always flex flex-col justify-center p-6 sm:p-10 pb-28 sm:pb-32 overflow-hidden bg-[#070707]">
          <div className="max-w-md mx-auto w-full space-y-6">
            <div className="space-y-1 text-center">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#707070] font-mono block">
                SCREEN 04 // ATELIER SPECIFICATIONS
              </span>
              <h2 className="font-serif text-2xl uppercase tracking-wider text-white">
                Technical Specifications
              </h2>
            </div>

            {/* Sizing Matrix */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] uppercase tracking-wider text-[#808080]">
                  Select Sizing (US Ring Scale)
                </span>
                <span className="text-[10px] font-mono text-white">US {selectedSize} Selected</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`py-2.5 font-mono text-xs border rounded-sm transition-all cursor-pointer ${
                      selectedSize === s
                        ? 'border-white bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                        : 'border-white/15 bg-[#111111] text-[#A0A0A0] hover:border-white/30'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Material & Inclusions Specs */}
            <div className="p-4 bg-[#0E0E0E] border border-white/10 rounded-sm space-y-3 text-xs text-[#A0A0A0]">
              <div className="flex items-center justify-between">
                <span>Material Purity</span>
                <span className="text-white font-mono">Solid 925 Sterling Silver</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Surface Treatment</span>
                <span className="text-white font-mono">Liquid Rhodium Dip (Anti-Tarnish)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Presentation Case</span>
                <span className="text-white font-mono">Velvet Cosmic Box & Wax Seal</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Authenticity Certificate</span>
                <span className="text-white font-mono">Enclosed with Assay Card</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* 3. STICKY GLASSMORPHISM CTA (Floating permanently at bottom) */}
      <div className="fixed bottom-6 left-0 right-0 z-30 px-4 max-w-md mx-auto pointer-events-none">
        <div className="p-2 bg-black/75 border border-white/20 backdrop-blur-2xl rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex items-center gap-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors cursor-pointer shrink-0"
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-[#C0C0C0]'}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsBuyNowOpen(true)}
            className="flex-1 py-3.5 px-6 chrome-button text-xs uppercase tracking-[0.25em] font-bold text-black rounded-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(192,192,192,0.4)] cursor-pointer transition-all hover:scale-[1.02]"
          >
            <span>Buy Now • ₹{Number(product.price).toLocaleString('en-IN')}</span>
            <span>→</span>
          </button>
        </div>
      </div>

      {/* 4. IN-PLACE 75vh FLOATING GLASS BUY NOW DRAWER */}
      <FloatingBuyNowDrawer
        isOpen={isBuyNowOpen}
        onClose={() => setIsBuyNowOpen(false)}
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
      />
    </div>
  );
}
