import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import cosmicEmblem from '../../assets/cosmic_emblem.png';
import OrderTrackingTimeline from './OrderTrackingTimeline';
import ChromeCosmicStar from '../luxury-mobile/ChromeCosmicStar.jsx';

export default function LuxuryConfirmation({
  orderNumber = 'CSM-849204',
  paymentId = 'PAY-892410',
  amount = 799,
  items = [],
  shippingInfo,
  onContinueShopping,
}) {
  const [showTracking, setShowTracking] = useState(false);

  return (
    <div className="relative w-full max-w-2xl mx-auto text-white text-center selection:bg-[#C0C0C0] selection:text-black animate-fade-in">
      {/* Background Ambience */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <div className="border border-white/15 rounded-2xl bg-black/80 backdrop-blur-2xl p-6 sm:p-10 shadow-[0_0_80px_rgba(0,0,0,0.9)] overflow-hidden text-left relative">
        {/* If Tracking is Open, show the tracking view */}
        {showTracking ? (
          <div className="space-y-6">
            <button
              type="button"
              onClick={() => setShowTracking(false)}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#A0A0A0] hover:text-white cursor-pointer"
            >
              <span>←</span>
              <span>Back to Confirmation</span>
            </button>
            <OrderTrackingTimeline
              orderNumber={orderNumber}
              onClose={() => setShowTracking(false)}
            />
          </div>
        ) : (
          <div className="space-y-8 text-center">
            {/* Confirmation Visual: Large Chrome Cosmic Star with subtle metallic particle halo */}
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-20" />
              <ChromeCosmicStar size={80} isRotating={false} pulseTrigger={1} />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#A0A0A0] block font-medium">
                Maison Cosmic • Commission Recorded
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif uppercase tracking-[0.15em] text-white font-light chrome-gradient-text">
                Order Confirmed
              </h1>
              <p className="text-xs sm:text-sm text-[#909090] font-light leading-relaxed max-w-md mx-auto">
                Thank you{shippingInfo?.fullName ? `, ${shippingInfo.fullName}` : ''}. Your commission has been authorized and queued for bespoke packaging at our atelier.
              </p>
            </div>

            {/* Quick Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border border-white/10 bg-white/5 text-left text-xs">
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#707070] block">Order Ref</span>
                <span className="font-mono text-white font-medium">{orderNumber}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#707070] block">Payment ID</span>
                <span className="font-mono text-white text-[11px] truncate block">{paymentId}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#707070] block">Total Settled</span>
                <span className="font-mono text-white font-medium">₹{Number(amount).toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#707070] block">Handover</span>
                <span className="text-emerald-400 font-medium">Insured Priority</span>
              </div>
            </div>

            {/* Primary Action Buttons: Track Order & Continue Shopping */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowTracking(true)}
                className="w-full sm:w-1/2 py-4 chrome-button text-xs uppercase tracking-[0.25em] font-semibold text-black flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all cursor-pointer"
              >
                <span>Track Order</span>
                <span>→</span>
              </button>

              <Link
                to="/#shop"
                onClick={onContinueShopping}
                className="w-full sm:w-1/2 py-4 border border-white/20 hover:border-white hover:bg-white/5 text-xs uppercase tracking-[0.2em] text-white font-medium transition-all text-center cursor-pointer"
              >
                <span>Continue Shopping</span>
              </Link>
            </div>

            {/* Secondary Print Receipt */}
            <div>
              <button
                type="button"
                onClick={() => window.print()}
                className="text-[10px] uppercase tracking-[0.2em] text-[#707070] hover:text-white underline underline-offset-4 cursor-pointer transition-colors"
              >
                Print Certificate of Acquisition
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Concierge Hotline */}
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#606060] mt-6">
        Questions regarding your commission? Concierge line available 24/7.
      </p>
    </div>
  );
}
