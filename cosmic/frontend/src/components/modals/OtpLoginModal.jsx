import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const OtpLoginModal = ({ isOpen, onClose, onLoginSuccess, purchaseIntent }) => {
  const { login } = useAuth();
  const [step, setStep] = useState('welcome'); // 'welcome' | 'phone' | 'otp' | 'email'
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    setIsLoading(true);
    setError('');
    setDevOtp('');
    try {
      const response = await fetch('http://localhost:4000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to send OTP');

      // Dev mode: capture OTP from response
      if (data.otp) {
        setDevOtp(data.otp);
      }

      setStep('otp');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:4000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Invalid OTP');

      login(data.user, data.token);
      onLoginSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/20 p-8 shadow-2xl text-center space-y-8 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#888888] hover:text-white transition-colors p-1 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {step === 'welcome' && (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-2">
              <h2 className="text-2xl uppercase tracking-[0.3em] text-white font-serif">
                Welcome to Cosmic
              </h2>
              <p className="text-xs uppercase tracking-widest text-[#888888]">
                Continue your journey
              </p>
            </div >

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setStep('phone')}
                className="py-4 border border-white/20 text-xs uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                Continue with Phone
              </button>
              <button
                onClick={() => setStep('email')}
                className="py-4 border border-white/20 text-xs uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                Continue with Email
              </button>
            </div >
          </div >
        )}

        {step === 'phone' && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-left">
              <label className="text-[10px] uppercase tracking-widest text-[#A0A0A0] block mb-2 ml-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 00000 00000"
                className="w-full bg-black border border-white/20 px-4 py-3 text-sm text-white placeholder-[#444444] focus:border-white focus:outline-none transition-colors"
              />
            </div >
            <button
              onClick={handleSendOtp}
              disabled={isLoading || !phone}
              className="w-full py-3 chrome-button text-xs uppercase tracking-[0.25em] font-semibold disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Sending...' : 'Request OTP'}
            </button>
            <button
              onClick={() => setStep('welcome')}
              className="w-full py-2 text-[10px] uppercase tracking-widest text-[#888888] hover:text-white transition-colors cursor-pointer"
            >
              Back
            </button>
          </div >
        )}

        {step === 'otp' && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-left">
              <label className="text-[10px] uppercase tracking-widest text-[#A0A0A0] block mb-2 ml-1">
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                maxLength={6}
                className="w-full bg-black border border-white/20 px-4 py-3 text-sm text-white placeholder-[#444444] focus:border-white focus:outline-none transition-colors text-center tracking-[0.5em] font-mono"
              />
            </div >

            {devOtp && (
              <div className="p-3 bg-emerald-900/20 border border-emerald-500/30 text-emerald-400 text-[10px] uppercase tracking-widest font-mono">
                OTP Generated: {devOtp}
              </div>
            )}

            <button
              onClick={handleVerifyOtp}
              disabled={isLoading || otp.length < 6}
              className="w-full py-3 chrome-button text-xs uppercase tracking-[0.25em] font-semibold disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </button>
            <button
              onClick={() => setStep('phone')}
              className="w-full py-2 text-[10px] uppercase tracking-widest text-[#888888] hover:text-white transition-colors cursor-pointer"
            >
              Change Phone Number
            </button>
          </div >
        )}

        {step === 'email' && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-left">
              <label className="text-[10px] uppercase tracking-widest text-[#A0A0A0] block mb-2 ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patron@cosmic.com"
                className="w-full bg-black border border-white/20 px-4 py-3 text-sm text-white placeholder-[#444444] focus:border-white focus:outline-none transition-colors"
              />
            </div >
            <button
              disabled
              className="w-full py-3 bg-white/5 text-xs uppercase tracking-[0.25em] text-[#555555] cursor-not-allowed"
            >
              Email Access Coming Soon
            </button>
            <button
              onClick={() => setStep('welcome')}
              className="w-full py-2 text-[10px] uppercase tracking-widest text-[#888888] hover:text-white transition-colors cursor-pointer"
            >
              Back
            </button>
          </div >
        )}

        {error && (
          <div className="p-3 bg-red-900/20 border border-red-500/50 text-red-400 text-[10px] uppercase tracking-widest animate-shake">
            {error}
          </div >
        )}
      </div >
    </div >
  );
};

export default OtpLoginModal;
