import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SmoothScrollProvider from '../experimental/SmoothScrollProvider.jsx';
import DeconstructedCampaignHero from './DeconstructedCampaignHero.jsx';
import FloatingArcExhibition from './FloatingArcExhibition.jsx';
import { useWishlist } from '../../context/WishlistContext.jsx';
import { ArrowLeft, Heart, Sparkles, Orbit, Layers } from 'lucide-react';

export default function CampaignExperiencePage() {
  const navigate = useNavigate();
  const { wishlistCount } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-black text-white font-sans selection:bg-[#C0C0C0] selection:text-black antialiased relative">
        
        {/* 1. TOP EXPERIMENTAL COMPARISON BAR */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/95 backdrop-blur-2xl border-b border-white/10 px-4 py-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#A0A0A0] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-semibold">EXPERIMENTAL // AAKAR HOUSE SPLIT HERO</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/cinematic"
              className="text-[#C0C0C0] hover:text-white flex items-center gap-1 transition-colors"
              title="Compare with 3D Three.js Orbit"
            >
              <Orbit className="w-3 h-3 text-[#A0A0A0]" />
              <span className="hidden sm:inline">3D Orbit</span>
            </Link>
            <Link
              to="/"
              className="text-[#C0C0C0] hover:text-white underline underline-offset-4 flex items-center gap-1 transition-colors"
              title="Return to Production Baseline"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Classic Storefront</span>
            </Link>
          </div>
        </div>

        {/* 2. MINIMAL BRAND ACCENT ON HERO */}
        <div className="fixed top-10 left-6 z-40 pointer-events-none">
          <span className="font-serif text-lg tracking-[0.3em] font-light chrome-gradient-text">
            COSMIC
          </span>
        </div>

        {/* 3. TOP RIGHT PRIVATE VAULT LINK */}
        <div className="fixed top-10 right-6 z-40">
          <Link
            to="/wishlist"
            className="p-2 rounded-full bg-black/60 border border-white/15 hover:border-white/40 text-white backdrop-blur-xl flex items-center gap-1.5 transition-all shadow-lg"
            title="Private Vault"
          >
            <Heart className="w-3.5 h-3.5 text-[#C0C0C0]" />
            {wishlistCount > 0 && (
              <span className="bg-white text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
        </div>

        {/* 4. PINNED SPLIT-IMAGE CAMPAIGN HERO (100% Storytelling, 5 Architectural Panels, Subtle Beacons) */}
        <DeconstructedCampaignHero />

        {/* 5. DOWNSTREAM FLOATING ARC EXHIBITION (Pure floating photography, curved spatial arc, zero cards) */}
        <FloatingArcExhibition />

        {/* 5. DOWNSTREAM ATELIER CRAFTSMANSHIP MANIFESTO */}
        <section className="py-28 px-6 bg-[#040404] border-t border-white/10 text-center space-y-8 relative z-20">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] uppercase tracking-[0.45em] text-[#707070] font-mono block">
              MILANESE ATELIER PHILOSOPHY
            </span>
            <h3 className="font-serif text-3xl sm:text-5xl uppercase tracking-tight text-white font-light">
              Architectural Sovereignty
            </h3>
            <p className="text-xs sm:text-sm text-[#909090] font-light leading-relaxed max-w-lg mx-auto pt-2">
              Every creation featured in the campaign is individually cast in solid 925 sterling silver, hand-beveled, and immersion-dipped in liquid rhodium for permanent mirror luster.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/#shop"
              className="px-8 py-3.5 chrome-button text-xs uppercase tracking-[0.25em] font-bold rounded-sm shadow-[0_0_20px_rgba(192,192,192,0.35)] transition-all hover:scale-105"
            >
              View Full Catalog →
            </Link>
            <Link
              to="/cinematic"
              className="px-8 py-3.5 border border-white/25 hover:border-white text-xs uppercase tracking-[0.25em] text-[#C0C0C0] hover:text-white rounded-sm transition-all"
            >
              Experience 3D Orbit
            </Link>
          </div>
        </section>

        {/* 6. SIDE-BY-SIDE FLOATING COMPARISON SWITCHER BAR */}
        <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2">
          <Link
            to="/"
            className="px-4 py-2.5 rounded-full bg-black/90 hover:bg-black border border-white/30 hover:border-white/60 text-[10px] uppercase tracking-[0.2em] text-[#C0C0C0] hover:text-white backdrop-blur-2xl transition-all shadow-[0_10px_35px_rgba(0,0,0,0.9)] flex items-center gap-2 group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-white" />
            <span>Classic Storefront</span>
          </Link>

          <Link
            to="/cinematic"
            className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 hover:border-white/50 text-[10px] uppercase tracking-[0.2em] text-[#E0E0E0] hover:text-white backdrop-blur-2xl transition-all shadow-lg flex items-center gap-1.5"
          >
            <Orbit className="w-3.5 h-3.5 text-white" />
            <span>3D Orbit</span>
          </Link>
        </div>

      </div>
    </SmoothScrollProvider>
  );
}
