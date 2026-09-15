import React, { useState } from 'react';
import cosmicEmblem from '../../assets/cosmic_emblem.png';

export default function EmailAuthScreen({
  email,
  setEmail,
  onSubmit,
  onSwitchToPhone,
  onClose,
  isLoading,
  error,
}) {
  const [localEmail, setLocalEmail] = useState(email || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!localEmail || !localEmail.includes('@')) return;
    setEmail(localEmail);
    onSubmit(localEmail);
  };

  const isValidEmail = localEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localEmail);

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col justify-between overflow-hidden bg-black text-white selection:bg-[#C0C0C0] selection:text-black">
      {/* Editorial Luxury Photography Background */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/assets/lunar_ring_hero.jpg"
          alt="Cosmic Fine Jewelry"
          className="w-full h-full object-cover object-center opacity-25 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black" />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center">
            {cosmicEmblem ? (
              <img src={cosmicEmblem} alt="Cosmic" className="w-4 h-4 object-contain filter invert opacity-90" />
            ) : (
              <span className="text-white text-xs">✦</span>
            )}
          </div>
          <div>
            <span className="font-serif tracking-[0.28em] text-xs uppercase text-white font-medium block">
              COSMIC
            </span>
            <span className="text-[8px] uppercase tracking-[0.3em] text-[#888888] block">
              Digital Atelier
            </span>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full border border-white/15 bg-black/40 hover:bg-white/10 flex items-center justify-center text-[#A0A0A0] hover:text-white transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Center Body */}
      <div className="relative z-10 px-6 sm:px-10 py-8 flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 backdrop-blur-md text-[9px] uppercase tracking-[0.3em] text-[#C0C0C0]">
            <span>✦</span>
            <span>Maison Patron Access</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-[0.15em] text-white font-light">
            Continue With Email
          </h2>
          <p className="text-xs text-[#909090] font-light leading-relaxed max-w-xs mx-auto">
            We will transmit an instant private authorization dispatch to your inbox.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] uppercase tracking-[0.25em] text-[#808080] font-medium ml-1 block">
              Patron Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={localEmail}
                onChange={(e) => setLocalEmail(e.target.value)}
                placeholder="patron@cosmic-maison.com"
                autoFocus
                className="w-full bg-black/70 border border-white/20 px-4 py-3.5 text-sm text-white placeholder-[#505050] font-light tracking-wide focus:border-[#C0C0C0] focus:shadow-[0_0_20px_rgba(255,255,255,0.12)] focus:outline-none transition-all"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-300 text-[11px] leading-relaxed tracking-wide text-left animate-fade-in flex items-start gap-2">
              <span className="text-red-400">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Primary CTA */}
          <button
            type="submit"
            disabled={isLoading || !isValidEmail}
            className="w-full py-4 chrome-button text-xs uppercase tracking-[0.25em] font-semibold text-black flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Transmitting Dispatch...</span>
              </span>
            ) : (
              <>
                <span>Continue</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative px-3 bg-black text-[9px] uppercase tracking-[0.3em] text-[#606060]">
            Or
          </span>
        </div>

        {/* Secondary: Use Phone Number Instead */}
        <button
          type="button"
          onClick={onSwitchToPhone}
          className="w-full py-3.5 border border-white/20 hover:border-white hover:bg-white/5 text-xs uppercase tracking-[0.2em] text-white font-medium transition-all cursor-pointer flex items-center justify-center gap-2 backdrop-blur-sm"
        >
          <svg className="w-4 h-4 text-[#A0A0A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span>Use Phone Number Instead</span>
        </button>
      </div>

      {/* Footer Assurance */}
      <div className="relative z-10 p-6 text-center border-t border-white/10 bg-black/40 backdrop-blur-sm">
        <span className="text-[9px] uppercase tracking-[0.25em] text-[#707070]">
          Private Encrypted Ledger • Maison Cosmic
        </span>
      </div>
    </div>
  );
}
