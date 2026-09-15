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
        
        {/* 1. UNIFIED LUXURY CAMPAIGN TOP BAR */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-2xl border-b border-white/10 px-6 py-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] select-none">
          {/* Brand Mark */}
          <div className="flex items-center gap-3">
            <Link to="/" className="font-serif text-lg tracking-[0.25em] font-light text-white hover:text-[#C0C0C0] transition-colors">
              COSMIC
            </Link>
            <span className="hidden md:inline-block w-px h-3 bg-white/20" />
            <span className="hidden md:inline-block text-[#808080] text-[9px] tracking-[0.3em]">
              MMXXVI CAMPAIGN
            </span>
          </div>

          {/* Center Story Indicator */}
          <div className="hidden lg:flex items-center gap-2 text-[#909090]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] tracking-[0.25em]">ARCHITECTURAL DECONSTRUCTION</span>
          </div>

          {/* Right Navigation Hub */}
          <div className="flex items-center gap-5">
            <Link
              to="/cinematic"
              className="text-[#B0B0B0] hover:text-white flex items-center gap-1.5 transition-colors"
              title="Compare with 3D Orbit"
            >
              <Orbit className="w-3.5 h-3.5 text-[#808080]" />
              <span className="hidden sm:inline">3D Orbit</span>
            </Link>

            <Link
              to="/wishlist"
              className="text-[#B0B0B0] hover:text-white flex items-center gap-1.5 transition-colors"
              title="Private Vault"
            >
              <Heart className="w-3.5 h-3.5 text-[#808080]" />
              <span className="hidden sm:inline">Vault</span>
              {wishlistCount > 0 && (
                <span className="bg-white text-black font-bold text-[9px] px-1.5 py-0.2 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/"
              className="text-white/80 hover:text-white flex items-center gap-1 transition-colors pl-2 border-l border-white/15"
              title="Return to Classic Storefront"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="hidden sm:inline">Classic</span>
            </Link>
          </div>
        </header>

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

        {/* 6. MINIMAL EDITORIAL ATELIER FOOTER */}
        <footer className="py-12 px-6 bg-[#020202] border-t border-white/5 text-center select-none">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#606060] font-mono">
            COSMIC HAUTE JOAILLERIE S.P.A. • MILANESE ATELIER MMXXVI
          </p>
        </footer>

      </div>
    </SmoothScrollProvider>
  );
}
