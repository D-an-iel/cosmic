import React, { useState, useEffect, useRef } from 'react';
import cosmicEmblem from '../../assets/cosmic_emblem.png';
import ChromeCosmicStar from '../luxury-mobile/ChromeCosmicStar.jsx';

export default function OtpVerificationScreen({
  fullPhone,
  onVerify,
  onResend,
  onBack,
  onClose,
  isLoading,
  error,
  devOtp,
}) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);
  const [isStarCheckmark, setIsStarCheckmark] = useState(false);
  const inputRefs = useRef([]);

  // Auto focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Pre-fill devOtp if available for frictionless testing
  useEffect(() => {
    if (devOtp && typeof devOtp === 'string' && devOtp.length === 6) {
      setDigits(devOtp.split(''));
    }
  }, [devOtp]);

  // Resend countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleDigitChange = (index, value) => {
    const cleaned = value.replace(/[^\d]/g, '');
    if (!cleaned) {
      const updated = [...digits];
      updated[index] = '';
      setDigits(updated);
      return;
    }

    const lastChar = cleaned.slice(-1);
    const updated = [...digits];
    updated[index] = lastChar;
    setDigits(updated);
    setPulseCount((prev) => prev + 1);

    // Auto-advance
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Upon final digit: Star expands, transforms into chrome checkmark. ~500ms transition.
    if (index === 5 && updated.every((d) => d !== '')) {
      setIsStarCheckmark(true);
      setTimeout(() => {
        onVerify(updated.join(''));
      }, 500);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^\d]/g, '').slice(0, 6);
    if (!pasted) return;
    const updated = [...digits];
    for (let i = 0; i < 6; i++) {
      updated[i] = pasted[i] || '';
    }
    setDigits(updated);
    setPulseCount((prev) => prev + 1);
    const nextEmptyIndex = updated.findIndex((d) => !d);
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
      setIsStarCheckmark(true);
      setTimeout(() => {
        onVerify(updated.join(''));
      }, 500);
    }
  };

  const handleResendClick = () => {
    if (!canResend) return;
    setTimer(30);
    setCanResend(false);
    onResend();
  };

  const otpCode = digits.join('');
  const isComplete = otpCode.length === 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isComplete) {
      setIsStarCheckmark(true);
      setTimeout(() => {
        onVerify(otpCode);
      }, 500);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col justify-between overflow-hidden bg-black text-white selection:bg-[#C0C0C0] selection:text-black">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.4)_0%,#000000_95%)]" />
      </div>

      {/* Header: Back, Brand, Close */}
      <div className="relative z-10 p-6 flex items-center justify-between border-b border-white/10 backdrop-blur-sm">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#909090] hover:text-white transition-colors cursor-pointer"
        >
          <span>←</span>
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center">
            {cosmicEmblem ? (
              <img src={cosmicEmblem} alt="Cosmic" className="w-3 h-3 object-contain filter invert opacity-90" />
            ) : (
              <span className="text-white text-[10px]">✦</span>
            )}
          </div>
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

      {/* Body: Star, Title, Phone display & 6 OTP Boxes */}
      <div className="relative z-10 px-6 sm:px-10 py-8 flex-1 flex flex-col justify-center max-w-md mx-auto w-full text-center">
        {/* Chrome Cosmic Star with live pulse & checkmark morph */}
        <div className="flex justify-center mb-6">
          <ChromeCosmicStar
            size={64}
            isRotating={false}
            pulseTrigger={pulseCount}
            isCheckmark={isStarCheckmark}
          />
        </div>

        <div className="space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-[0.15em] text-white font-light">
            Verify Your Device
          </h2>
          <div className="text-xs text-[#909090] font-light leading-relaxed flex items-center justify-center gap-2 flex-wrap">
            <span>6-digit passcode sent to</span>
            <span className="font-mono text-white font-medium">{fullPhone}</span>
            <button
              type="button"
              onClick={onBack}
              className="text-[#C0C0C0] hover:text-white underline underline-offset-4 cursor-pointer text-[11px]"
            >
              (Edit)
            </button>
          </div>
          {devOtp && (
            <div className="pt-1">
              <span className="text-[10px] font-mono text-[#A0A0A0] px-2 py-0.5 bg-white/5 border border-white/10 rounded">
                Development Test Code: {devOtp}
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/40 border border-red-500/30 text-red-200 text-xs rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2.5 sm:gap-3">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-11 h-13 sm:w-12 sm:h-14 bg-[#111111] border text-center text-lg font-mono text-white rounded-sm outline-none transition-all ${
                  digit ? 'border-[#C0C0C0] bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.15)]' : 'border-white/15 focus:border-[#C0C0C0]'
                }`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={!isComplete || isLoading}
            className="w-full py-4 chrome-button text-xs uppercase tracking-[0.25em] font-bold rounded-sm cursor-pointer disabled:opacity-40 transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? 'Authorizing...' : 'Authorize Access →'}
          </button>
        </form>

        <div className="pt-6 text-xs text-[#707070]">
          {timer > 0 ? (
            <span>Resend code in 00:{timer < 10 ? `0${timer}` : timer}</span>
          ) : (
            <button
              type="button"
              onClick={handleResendClick}
              className="text-white hover:text-[#C0C0C0] underline cursor-pointer"
            >
              Resend Code
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 p-6 text-center border-t border-white/5 text-[9px] uppercase tracking-[0.3em] text-[#606060] font-mono">
        Encrypted Atelier Authentication
      </div>
    </div>
  );
}
