import React from 'react';
import cosmicEmblem from '../../assets/cosmic_emblem.png';

export default function ProcessingOverlay({
  message = 'Processing Payment',
  submessage = 'Securing allocation & communicating with verified settlement gateway...',
}) {
  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-6 text-white text-center selection:bg-[#C0C0C0] selection:text-black animate-fade-in">
      {/* Background Celestial Ring Graphic */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[500px] h-[500px] rounded-full border border-white/5 animate-[spin_40s_linear_infinite]" />
        <div className="w-[360px] h-[360px] rounded-full border border-dashed border-white/10 animate-[spin_25s_linear_infinite_reverse]" />
        <div className="w-[240px] h-[240px] bg-white/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 max-w-sm mx-auto space-y-6">
        {/* Animated Concentric Orbiting Ring */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-white/10 border-t-white animate-spin" />
          
          {/* Inner Counter-Rotating Ring */}
          <div className="absolute inset-2 rounded-full border border-white/20 border-b-white/80 animate-[spin_2s_linear_infinite_reverse]" />

          {/* Central Pulsing Emblem */}
          <div className="w-12 h-12 rounded-full border border-white/30 bg-black/80 flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.25)]">
            {cosmicEmblem ? (
              <img src={cosmicEmblem} alt="Cosmic" className="w-6 h-6 object-contain filter invert opacity-90 animate-pulse" />
            ) : (
              <span className="text-white text-base">✦</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#A0A0A0] block font-medium">
            Maison Cosmic • Secure Gateway
          </span>
          <h2 className="text-2xl font-serif uppercase tracking-[0.18em] text-white font-light chrome-gradient-text">
            {message}
          </h2>
          <p className="text-xs text-[#808080] font-light leading-relaxed max-w-xs mx-auto">
            {submessage}
          </p>
        </div>

        {/* Pulsing Status Bar */}
        <div className="w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />
        </div>

        <div className="flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.25em] text-[#606060]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Do not refresh or navigate away</span>
        </div>
      </div>
    </div>
  );
}
