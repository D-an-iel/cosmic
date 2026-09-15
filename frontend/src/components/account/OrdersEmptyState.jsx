import React from 'react';
import { Link } from 'react-router-dom';
import cosmicEmblem from '../../assets/cosmic_emblem.png';

export default function OrdersEmptyState() {
  return (
    <div className="py-20 px-6 text-center border border-white/10 rounded-2xl bg-black/60 backdrop-blur-xl relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-fade-in max-w-xl mx-auto">
      {/* Ambient background glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      {/* Cosmic Emblem with subtle pulse */}
      <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border border-white/20 bg-white/5 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          {cosmicEmblem ? (
            <img src={cosmicEmblem} alt="Cosmic" className="w-7 h-7 object-contain filter invert opacity-80" />
          ) : (
            <span className="text-xl text-white">✦</span>
          )}
        </div>
      </div>

      <span className="text-[9px] uppercase tracking-[0.35em] text-[#808080] block mb-2 font-medium">
        Atelier Acquisition Archive
      </span>

      <h3 className="text-2xl sm:text-3xl font-serif uppercase tracking-[0.15em] text-white font-light mb-3">
        No creations acquired yet.
      </h3>

      <p className="text-xs text-[#888888] font-light leading-relaxed max-w-sm mx-auto mb-8">
        Your bespoke commissions, hallmarked jewelry, and order journeys with Maison Cosmic will be preserved here for eternity.
      </p>

      <Link
        to="/#shop"
        className="inline-block px-8 py-4 chrome-button text-xs uppercase tracking-[0.25em] font-semibold text-black shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all cursor-pointer"
      >
        Explore Collections
      </Link>
    </div>
  );
}
