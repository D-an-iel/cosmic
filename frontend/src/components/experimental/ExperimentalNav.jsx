import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext.jsx';

export default function ExperimentalNav() {
  const { wishlistCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 140);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* 1. TOP EXPERIMENTAL COMPARISON BAR */}
      <div className="bg-[#0c0c0c] border-b border-white/10 px-4 py-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#A0A0A0] z-50 relative font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white font-semibold">STAGE 1 // EXPERIMENTAL BRANCH</span>
        </div>
        <Link
          to="/"
          className="text-[#C0C0C0] hover:text-white underline underline-offset-4 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Exit to Classic Production Storefront</span>
        </Link>
      </div>

      {/* 2. TRANSLUCENT GLASS NAVIGATION BAR (Scroll-driven reveal) */}
      <header
        className={`sticky top-0 z-40 bg-black/85 backdrop-blur-2xl border-b border-white/10 transition-all duration-500 font-sans ${
          scrolled ? 'translate-y-0 opacity-100' : 'max-md:-translate-y-full max-md:opacity-0 pointer-events-none md:pointer-events-auto md:opacity-100'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Classic Exit Link */}
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.25em] text-[#808080] hover:text-white transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Classic Storefront</span>
          </Link>

          {/* Center Brand Identity */}
          <Link to="/cinematic" className="flex flex-col items-center">
            <span className="font-serif text-xl tracking-[0.25em] font-light chrome-gradient-text">
              COSMIC
            </span>
            <span className="text-[8px] tracking-[0.35em] text-[#606060] -mt-1 font-mono uppercase">
              Experimental Atelier
            </span>
          </Link>

          {/* Right Actions: Wishlist Vault */}
          <div className="flex items-center gap-4">
            <Link
              to="/wishlist"
              className="relative p-2 text-[#C0C0C0] hover:text-white transition-colors flex items-center gap-1.5 group"
              title="Private Vault"
            >
              <span className="text-xs tracking-wider uppercase font-mono hidden sm:inline text-[#808080] group-hover:text-white">
                Vault
              </span>
              <div className="relative">
                <Heart className="w-4 h-4 transition-transform group-hover:scale-110" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-white text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
