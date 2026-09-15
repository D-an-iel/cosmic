import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import ChromeCosmicStar from './ChromeCosmicStar.jsx';
import MercuryPaymentTransition from './MercuryPaymentTransition.jsx';
import { X, ArrowRight, ShieldCheck, MapPin, CheckCircle2 } from 'lucide-react';

export default function FloatingBuyNowDrawer({
  isOpen,
  onClose,
  product,
  selectedSize = '8',
  selectedColor = 'Chrome',
  quantity = 1,
}) {
  const navigate = useNavigate();
  const { user, token, login } = useAuth();

  // Stages: 'PHONE' | 'OTP' | 'ADDRESS' | 'PAYMENT' | 'TRANSITION' | 'CONFIRMED'
  const [stage, setStage] = useState('PHONE');

  // Phone & OTP state
  const [phone, setPhone] = useState(user?.phone || '');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [pulseCount, setPulseCount] = useState(0);
  const [isStarCheckmark, setIsStarCheckmark] = useState(false);
  const [devOtp, setDevOtp] = useState('');
  const [timer, setTimer] = useState(30);

  // Address state
  const [fullName, setFullName] = useState(user?.name || '');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('Mumbai');
  const [stateName, setStateName] = useState('Maharashtra');
  const [pincode, setPincode] = useState('400034');

  // Loading & Error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const otpInputs = useRef([]);

  // Determine initial stage based on user login state
  useEffect(() => {
    if (isOpen) {
      if (user && token) {
        setStage('ADDRESS');
      } else {
        setStage('PHONE');
      }
      setError('');
      setIsStarCheckmark(false);
    }
  }, [isOpen, user, token]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (stage === 'OTP' && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [stage, timer]);

  if (!isOpen) return null;

  const itemPrice = Number(product?.price || 799);
  const totalAmount = itemPrice * quantity;

  // 1. Send OTP
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!phone || phone.trim().length < 8) {
      setError('Please enter a valid mobile number');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const cleanPhone = phone.startsWith('+') ? phone : `+91 ${phone.trim()}`;
      const response = await fetch('http://localhost:4000/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Failed to dispatch verification code');

      if (data.otp) {
        setDevOtp(data.otp);
      }
      setTimer(30);
      setStage('OTP');
    } catch (err) {
      setError(err.message || 'Error communicating with Atelier Auth protocol');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle OTP digit entry
  const handleOtpChange = (index, value) => {
    const cleaned = value.replace(/[^\d]/g, '').slice(-1);
    const updated = [...otpDigits];
    updated[index] = cleaned;
    setOtpDigits(updated);

    if (cleaned) {
      setPulseCount((prev) => prev + 1);
      if (index < 5 && otpInputs.current[index + 1]) {
        otpInputs.current[index + 1].focus();
      }
    }

    // If 6th digit entered, auto submit
    if (cleaned && index === 5 && updated.every((d) => d !== '')) {
      handleVerifyOtp(updated.join(''));
    }
  };

  // 3. Verify OTP
  const handleVerifyOtp = async (code) => {
    setLoading(true);
    setError('');
    const cleanPhone = phone.startsWith('+') ? phone : `+91 ${phone.trim()}`;

    try {
      const response = await fetch('http://localhost:4000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, code: code || otpDigits.join('') }),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message || 'Invalid verification code');

      // Login user
      login(data.user, data.token);

      // Trigger 500ms Checkmark Morphing
      setIsStarCheckmark(true);
      setTimeout(() => {
        setStage('ADDRESS');
        setLoading(false);
      }, 550);
    } catch (err) {
      setError(err.message || 'Verification failed. Please re-enter code.');
      setLoading(false);
    }
  };

  // 4. Create Address & Submit Order (Pay Now)
  const handlePayNow = async (e) => {
    e?.preventDefault();
    if (!addressLine1 || !city || !pincode) {
      setError('Please complete delivery address parameters');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // Create address
      const addrRes = await fetch('http://localhost:4000/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: fullName || user?.name || 'Cosmic Patron',
          phone: phone || user?.phone,
          addressLine1,
          city,
          state: stateName,
          country: 'India',
          pincode,
          isDefault: true,
        }),
      });
      const addrData = await addrRes.json();
      const addressId = addrData.data?.id;

      if (!addressId) throw new Error('Failed to register delivery destination');

      // Create Order
      const orderRes = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          addressId,
          items: [
            {
              productId: product.id,
              quantity,
              price: itemPrice,
            },
          ],
          paymentMethod: 'RAZORPAY_DEMO',
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.message || 'Order registration failed');

      setConfirmedOrder(orderData.data);
      // Trigger signature liquid mercury transition
      setStage('TRANSITION');
    } catch (err) {
      setError(err.message || 'Settlement initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Liquid Mercury Payment Transition Screen */}
      {stage === 'TRANSITION' && (
        <MercuryPaymentTransition
          onComplete={() => {
            setStage('CONFIRMED');
          }}
        />
      )}

      {/* Floating 75vh Translucent Glass Bottom Drawer */}
      <div className="fixed inset-0 z-50 overflow-hidden flex flex-col justify-end animate-fadeIn">
        {/* Background Gaussian Blur */}
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-xl transition-opacity duration-500"
        />

        {/* 75% Viewport Glass Panel with 32px Radius */}
        <div className="relative w-full max-w-xl mx-auto h-[78vh] bg-[#070707]/95 border-t border-x border-[#C0C0C0]/30 rounded-t-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-[0_-20px_60px_rgba(0,0,0,0.95)] z-10 overflow-y-auto">
          {/* Top Notch & Header Bar */}
          <div>
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#707070] block font-mono">
                  Maison Cosmic • Commande Express
                </span>
                <h2 className="font-serif text-lg tracking-wider text-white">
                  {product?.name || 'Lunar Silver Ring'}
                </h2>
                <span className="text-[11px] font-mono text-[#C0C0C0]">
                  Size: {selectedSize} • {selectedColor} • ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-[#707070] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 text-red-200 text-xs rounded-sm">
                {error}
              </div>
            )}

            {/* STAGE 1: PHONE NUMBER AUTH SCREEN */}
            {stage === 'PHONE' && (
              <div className="space-y-6 text-center py-4">
                <div className="flex justify-center">
                  <ChromeCosmicStar size={56} isRotating={true} />
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-2xl uppercase tracking-wider text-white">
                    Enter Phone Number
                  </h3>
                  <p className="text-xs text-[#808080] max-w-xs mx-auto">
                    Secure concierge access and complimentary express delivery tracking
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4 max-w-sm mx-auto">
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98201 99882"
                      className="w-full bg-[#111111] border border-white/20 focus:border-[#C0C0C0] px-4 py-3.5 text-center text-sm font-mono text-white tracking-widest rounded-sm outline-none transition-colors"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 chrome-button text-xs uppercase tracking-[0.25em] font-bold rounded-sm cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? 'Transmitting Code...' : 'Continue →'}
                  </button>
                </form>
              </div>
            )}

            {/* STAGE 2: OTP VERIFICATION SCREEN */}
            {stage === 'OTP' && (
              <div className="space-y-6 text-center py-4">
                <div className="flex justify-center">
                  <ChromeCosmicStar
                    size={64}
                    isRotating={false}
                    pulseTrigger={pulseCount}
                    isCheckmark={isStarCheckmark}
                  />
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-2xl uppercase tracking-wider text-white">
                    Verification Code
                  </h3>
                  <p className="text-xs text-[#808080]">
                    Transmitted to <span className="font-mono text-white">{phone}</span>
                  </p>
                  {devOtp && (
                    <span className="text-[10px] font-mono text-[#A0A0A0] block">
                      (Development Code: {devOtp})
                    </span>
                  )}
                </div>

                {/* 6 Centered Boxes */}
                <div className="flex justify-center gap-2.5 sm:gap-3">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-11 h-13 sm:w-12 sm:h-14 bg-[#111111] border border-white/20 focus:border-[#C0C0C0] text-center text-lg font-mono text-white rounded-sm outline-none transition-all"
                    />
                  ))}
                </div>

                <div className="text-xs text-[#707070]">
                  {timer > 0 ? (
                    <span>Resend available in 00:{timer < 10 ? `0${timer}` : timer}</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-white underline cursor-pointer hover:text-[#C0C0C0]"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STAGE 3: SINGLE-PAGE MINIMAL ADDRESS SCREEN */}
            {stage === 'ADDRESS' && (
              <div className="space-y-5 py-2">
                <div className="border-b border-white/10 pb-3">
                  <h3 className="font-serif text-xl uppercase tracking-wider text-white">
                    Delivery Destination
                  </h3>
                  <p className="text-xs text-[#808080]">
                    Complimentary Express Air Courier • Hand delivered
                  </p>
                </div>

                <form onSubmit={handlePayNow} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#808080] mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Vikramaditya Sharma"
                      className="w-full bg-[#111111] border border-white/15 focus:border-[#C0C0C0] px-3.5 py-2.5 text-white rounded-sm outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#808080] mb-1">
                      Street Address & Residence
                    </label>
                    <input
                      type="text"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="Flat 42B, Tower 3, The Imperial, Tardeo"
                      className="w-full bg-[#111111] border border-white/15 focus:border-[#C0C0C0] px-3.5 py-2.5 text-white rounded-sm outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#808080] mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#111111] border border-white/15 focus:border-[#C0C0C0] px-3.5 py-2.5 text-white rounded-sm outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-[#808080] mb-1">
                        Pincode
                      </label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full bg-[#111111] border border-white/15 focus:border-[#C0C0C0] px-3.5 py-2.5 text-white font-mono rounded-sm outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#808080] mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="w-full bg-[#111111] border border-white/15 focus:border-[#C0C0C0] px-3.5 py-2.5 text-white rounded-sm outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 mt-2 chrome-button text-xs uppercase tracking-[0.25em] font-bold rounded-sm cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Pay Now • ₹{totalAmount.toLocaleString('en-IN')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* STAGE 5: ORDER CONFIRMED SCREEN */}
            {stage === 'CONFIRMED' && (
              <div className="text-center space-y-6 py-6 animate-fadeIn">
                <div className="flex justify-center">
                  <ChromeCosmicStar size={72} isRotating={false} pulseTrigger={1} />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#808080] block">
                    Commande Confirmed • #{confirmedOrder?.orderNumber || 'ORD-9824'}
                  </span>
                  <h3 className="font-serif text-3xl uppercase tracking-wider text-white">
                    Order Confirmed
                  </h3>
                  <p className="text-xs text-[#A0A0A0] max-w-sm mx-auto leading-relaxed">
                    Your piece has entered our Milanese atelier for final inspection.
                    Complimentary express air courier tracking will be dispatched to your phone.
                  </p>
                </div>

                <div className="pt-4 flex flex-col gap-3 max-w-xs mx-auto">
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/account/orders');
                    }}
                    className="w-full py-3.5 chrome-button text-xs uppercase tracking-wider font-bold rounded-sm cursor-pointer"
                  >
                    Track Commande →
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 text-xs text-[#808080] hover:text-white uppercase tracking-widest cursor-pointer"
                  >
                    Continue Exploring
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Bottom Guarantee */}
          <div className="pt-4 border-t border-white/5 text-center text-[10px] uppercase tracking-[0.25em] text-[#606060]">
            Solid 925 Sterling Silver • Liquid Rhodium Dip • Insured Transit
          </div>
        </div>
      </div>
    </>
  );
}
