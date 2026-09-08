import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import cosmicEmblem from '../assets/cosmic_emblem.png';

export default function OrderSuccessPage() {
  const location = useLocation();
  const orderData = location.state?.orderData || {
    orderNumber: 'CSM-000000',
    paymentId: 'PAY-000000',
    amount: 0,
    items: [],
    shippingInfo: {
      fullName: 'Esteemed Patron',
    }
  };

  return (
    <div className="bg-[#000000] text-white min-h-screen font-sans selection:bg-[#C0C0C0] selection:text-black py-16 px-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Success Crest Card */}
        <div className="border border-white/15 bg-[#080808] p-8 sm:p-14 text-center relative overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.05)]">
          {/* Subtle Ambient Radial Backlight */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          {/* Cosmic Star Logo Animated */}
          <div className="relative w-20 h-20 mx-auto mb-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-[#C0C0C0]/30 animate-ping opacity-25" />
            <div className="w-16 h-16 rounded-full border border-white/40 bg-black/80 flex items-center justify-center shadow-[0_0_20px_rgba(192,192,192,0.3)]">
              {cosmicEmblem ? (
                <img src={cosmicEmblem} alt="Cosmic Emblem" className="w-10 h-10 object-contain filter invert" />
              ) : (
                <span className="text-2xl text-white">✦</span>
              )}
            </div>
          </div>

          <span className="text-[11px] uppercase tracking-[0.4em] text-[#A0A0A0] block mb-3 font-medium">
            Maison Cosmic • Atelier Acquisition
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif uppercase tracking-[0.18em] text-white mb-4 chrome-gradient-text">
            Order Confirmed
          </h1>

          <p className="text-sm sm:text-base text-[#B0B0B0] font-light max-w-lg mx-auto leading-relaxed mb-8">
            Thank you, {orderData.shippingInfo?.fullName || 'Esteemed Patron'}. Your commission has been received and queued for bespoke packaging at our atelier.
          </p>

          {/* Order Details Badge Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#030303] border border-white/10 text-left mb-10">
            <div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#707070] block">Order Ref</span>
              <span className="font-mono text-xs text-white font-medium">{orderData.orderNumber}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#707070] block">Payment ID</span>
              <span className="text-xs text-white font-medium">{orderData.paymentId}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#707070] block">Total</span>
              <span className="font-mono text-xs text-white font-medium">₹{orderData.amount?.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#707070] block">Delivery</span>
              <span className="text-xs text-emerald-400 font-medium">2–4 Days Insured</span>
            </div>
          </div>

          {/* Fulfillment Timeline */}
          <div className="mb-10 text-left">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#808080] mb-4">
              Atelier Fulfillment Journey
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 border border-white/20 bg-white/5">
                <div className="text-[#C0C0C0] font-mono text-[10px] mb-1">01 • CONFIRMED</div>
                <div className="text-white font-medium">Order Logged</div>
              </div>
              <div className="p-3 border border-white/10 bg-[#050505]">
                <div className="text-[#606060] font-mono text-[10px] mb-1">02 • INSPECTION</div>
                <div className="text-[#999999]">Hallmark Verified</div>
              </div>
              <div className="p-3 border border-white/10 bg-[#050505]">
                <div className="text-[#606060] font-mono text-[10px] mb-1">03 • DISPATCH</div>
                <div className="text-[#999999]">Insured Courier</div>
              </div>
              <div className="p-3 border border-white/10 bg-[#050505]">
                <div className="text-[#606060] font-mono text-[10px] mb-1">04 • ARRIVAL</div>
                <div className="text-[#999999]">Secure Handover</div>
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="text-left border-t border-white/10 pt-8 mb-10">
            <h3 className="text-xs uppercase tracking-[0.25em] text-white font-semibold mb-4">
              Acquisition Summary
            </h3>
            <div className="space-y-3">
              {orderData.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 text-xs border-b border-white/5">
                  <div>
                    <span className="text-white font-medium">{item.name}</span>
                    <span className="text-[#707070] ml-2">
                      ({item.color || 'Silver'}, Size {item.size || 'Standard'}) × {item.quantity}
                    </span>
                  </div>
                  <span className="font-mono text-white">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/#shop"
              className="w-full sm:w-auto px-8 py-4 chrome-button text-xs uppercase tracking-[0.25em] font-semibold text-center"
            >
              Continue Exploring Catalog
            </Link>
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-8 py-4 border border-white/20 hover:border-white text-xs uppercase tracking-[0.25em] text-[#C0C0C0] hover:text-white transition-colors text-center cursor-pointer"
            >
              Print Receipt
            </button>
          </div>

        </div>

        {/* Support Footer Note */}
        <div className="mt-8 text-center text-xs text-[#707070] tracking-wider">
          Questions regarding your commission? Contact our Milanese concierge at{' '}
          <a href="mailto:concierge@cosmic-maison.com" className="text-[#C0C0C0] hover:underline">
            concierge@cosmic-maison.com
          </a>
        </div>

      </div>
    </div>
  );
}
