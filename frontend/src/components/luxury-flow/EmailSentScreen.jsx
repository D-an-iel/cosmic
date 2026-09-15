import React from 'react';
import cosmicEmblem from '../../assets/cosmic_emblem.png';

export default function EmailSentScreen({
  email,
  onEnterCodeInstead,
  onSimulateEmailAuth,
  onBackToEmail,
  onClose,
}) {
  const handleOpenEmailApp = () => {
    window.location.href = `mailto:${email || ''}`;
  };

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col justify-between overflow-hidden bg-black text-white selection:bg-[#C0C0C0] selection:text-black">
      {/* Subtle Starfield & Celestial Ambient Ring */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-white/10 animate-[spin_60s_linear_infinite]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-dashed border-white/10 animate-[spin_40s_linear_infinite_reverse]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black" />
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/10 backdrop-blur-sm">
        <button
          type="button"
          onClick={onBackToEmail}
          className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#909090] hover:text-white transition-colors cursor-pointer"
        >
          <span>←</span>
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-serif tracking-[0.25em] text-xs uppercase text-white">COSMIC</span>
        </div>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full border border-white/15 bg-black/40 hover:bg-white/10 flex items-center justify-center text-[#A0A0A0] hover:text-white transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <div className="w-8" />
        )}
      </div>

      {/* Center Body */}
      <div className="relative z-10 px-6 sm:px-10 py-8 flex-1 flex flex-col justify-center items-center max-w-md mx-auto w-full text-center">
        {/* Glowing Cosmic Emblem */}
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[#C0C0C0]/30 animate-ping opacity-25" />
          <div className="w-16 h-16 rounded-full border border-white/30 bg-black/90 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            {cosmicEmblem ? (
              <img src={cosmicEmblem} alt="Cosmic" className="w-9 h-9 object-contain filter invert" />
            ) : (
              <span className="text-2xl text-white">✦</span>
            )}
          </div>
        </div>

        <span className="text-[10px] uppercase tracking-[0.35em] text-[#A0A0A0] block mb-2 font-medium">
          Dispatch Transmitted
        </span>

        <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-[0.15em] text-white font-light mb-3">
          Check Your Inbox
        </h2>

        <p className="text-xs text-[#909090] font-light leading-relaxed max-w-xs mb-8">
          A private authentication link has been dispatched to{' '}
          <span className="text-white font-medium break-all">{email || 'your email'}</span>.
          Tap the authorization link inside to proceed seamlessly.
        </p>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          {/* Primary CTA: Open Email App */}
          <button
            type="button"
            onClick={handleOpenEmailApp}
            className="w-full py-4 chrome-button text-xs uppercase tracking-[0.25em] font-semibold text-black flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Open Email App</span>
          </button>

          {/* Secondary CTA: Enter Code Instead */}
          <button
            type="button"
            onClick={onEnterCodeInstead}
            className="w-full py-3.5 border border-white/20 hover:border-white hover:bg-white/5 text-xs uppercase tracking-[0.2em] text-white font-medium transition-all cursor-pointer flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            <span>Enter Code Instead</span>
          </button>

          {/* Frictionless Demo Simulator Button */}
          {onSimulateEmailAuth && (
            <button
              type="button"
              onClick={onSimulateEmailAuth}
              className="w-full py-2.5 text-[10px] uppercase tracking-[0.25em] text-[#C0C0C0] hover:text-white transition-colors cursor-pointer"
            >
              ✦ Simulate Instant Magic Link (Demo)
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 p-6 text-center border-t border-white/10 bg-black/40 backdrop-blur-sm">
        <span className="text-[9px] uppercase tracking-[0.2em] text-[#606060]">
          Did not receive? Check spam folder or try another channel
        </span>
      </div>
    </div>
  );
}
