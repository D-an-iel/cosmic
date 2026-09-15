import React, { useState } from 'react';
import cosmicEmblem from '../../assets/cosmic_emblem.png';
import ChromeCosmicStar from '../luxury-mobile/ChromeCosmicStar.jsx';

const COUNTRY_CODES = [
  { code: '+91', country: 'IN', flag: '🇮🇳', label: 'India (+91)' },
  { code: '+1', country: 'US', flag: '🇺🇸', label: 'United States (+1)' },
  { code: '+44', country: 'GB', flag: '🇬🇧', label: 'United Kingdom (+44)' },
  { code: '+971', country: 'AE', flag: '🇦🇪', label: 'UAE (+971)' },
  { code: '+33', country: 'FR', flag: '🇫🇷', label: 'France (+33)' },
  { code: '+81', country: 'JP', flag: '🇯🇵', label: 'Japan (+81)' },
  { code: '+49', country: 'DE', flag: '🇩🇪', label: 'Germany (+49)' },
];

export default function PhoneAuthScreen({
  phone,
  setPhone,
  countryCode,
  setCountryCode,
  onSubmit,
  onSwitchToEmail,
  onClose,
  isLoading,
  error,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 7) return;
    onSubmit();
  };

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col justify-between overflow-hidden bg-black text-white selection:bg-[#C0C0C0] selection:text-black">
      {/* Editorial Luxury Background with Dark Vignette */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/assets/hero_editorial.jpg"
          alt="Cosmic Haute Joaillerie"
          className="w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2)_0%,#000000_90%)]" />
      </div>

      {/* Top Header: Branding & Close */}
      <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-white/20 bg-white/5 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]">
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
              Haute Joaillerie
            </span>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full border border-white/15 bg-black/40 hover:bg-white/10 hover:border-white/40 flex items-center justify-center text-[#A0A0A0] hover:text-white transition-all cursor-pointer backdrop-blur-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Center Body: Floating Chrome Star & Input */}
      <div className="relative z-10 px-6 sm:px-10 py-8 flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        {/* Top Center: Floating Chrome Cosmic Star */}
        <div className="flex justify-center mb-6">
          <ChromeCosmicStar size={56} isRotating={true} />
        </div>

        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-[0.15em] text-white font-light">
            Enter Phone Number
          </h2>
          <p className="text-xs text-[#909090] font-light leading-relaxed max-w-xs mx-auto">
            Provide your mobile number to authorize commission reservation & secure checkout.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] uppercase tracking-[0.25em] text-[#808080] font-medium ml-1 block">
              Mobile Number
            </label>

            {/* Combined Country Selector + Phone Input */}
            <div className="relative flex items-center border border-white/20 bg-black/70 backdrop-blur-xl hover:border-white/40 focus-within:border-[#C0C0C0] focus-within:shadow-[0_0_20px_rgba(255,255,255,0.12)] transition-all">
              {/* Country Code Trigger */}
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-3.5 py-3.5 flex items-center gap-2 border-r border-white/15 text-xs text-white font-mono hover:bg-white/5 transition-colors cursor-pointer shrink-0"
              >
                <span>{selectedCountry.flag}</span>
                <span>{selectedCountry.code}</span>
                <svg className={`w-3 h-3 text-[#707070] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Number Input */}
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ''))}
                placeholder="98765 43210"
                maxLength={15}
                autoFocus
                className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder-[#505050] font-mono tracking-wider focus:outline-none"
              />

              {/* Country Dropdown Popover */}
              {isDropdownOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 max-h-48 overflow-y-auto bg-[#0a0a0a] border border-white/20 shadow-2xl z-30 divide-y divide-white/5 backdrop-blur-2xl">
                  {COUNTRY_CODES.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setCountryCode(item.code);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-3.5 py-2.5 text-left text-xs text-white hover:bg-white/10 flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span>{item.flag}</span>
                        <span>{item.country}</span>
                      </span>
                      <span className="font-mono text-[#888888]">{item.code}</span>
                    </button>
                  ))}
                </div>
              )}
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
            disabled={isLoading || !phone || phone.trim().length < 7}
            className="w-full py-4 chrome-button text-xs uppercase tracking-[0.25em] font-semibold text-black flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Requesting Code...</span>
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

        {/* Secondary: Continue with Email */}
        <button
          type="button"
          onClick={onSwitchToEmail}
          className="w-full py-3.5 border border-white/20 hover:border-white hover:bg-white/5 text-xs uppercase tracking-[0.2em] text-white font-medium transition-all cursor-pointer flex items-center justify-center gap-2 backdrop-blur-sm"
        >
          <svg className="w-4 h-4 text-[#A0A0A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Continue with Email</span>
        </button>
      </div>

      {/* Footer Assurance */}
      <div className="relative z-10 p-6 text-center border-t border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-4 text-[9px] uppercase tracking-[0.2em] text-[#707070]">
          <span className="flex items-center gap-1">
            <span className="text-emerald-400">●</span> 256-Bit SSL
          </span>
          <span>•</span>
          <span>Verified Concierge</span>
          <span>•</span>
          <span>Zero Spam</span>
        </div>
      </div>
    </div>
  );
}
