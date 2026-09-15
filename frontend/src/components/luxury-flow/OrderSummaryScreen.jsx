import React from 'react';

export default function OrderSummaryScreen({
  items = [],
  address,
  paymentMethod,
  onEditAddress,
  onEditPayment,
  onPayNow,
  isSubmitting,
}) {
  const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * (item.quantity || 1)), 0);
  const shippingFee = 0; // Complimentary Insured Delivery
  const total = subtotal + shippingFee;

  const paymentLabels = {
    upi: 'UPI Instant (GPay / PhonePe / QR)',
    card: 'Credit / Debit Card (256-Bit SSL)',
    netbanking: 'Net Banking (Direct Wire)',
    cod: 'Cash On Delivery / Concierge Handover',
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Editorial Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#A0A0A0] block font-medium">
            Step 03 • Final Commission Review
          </span>
          <h2 className="text-xl sm:text-2xl font-serif uppercase tracking-[0.12em] text-white font-normal mt-0.5">
            Acquisition Summary
          </h2>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-mono">
          Ready for Dispatch
        </div>
      </div>

      {/* Items Review Card */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#808080] block">
          Selected Creations ({items.length})
        </span>

        <div className="border border-white/15 rounded-xl bg-black/60 backdrop-blur-md divide-y divide-white/10 overflow-hidden shadow-2xl">
          {items.map((item, idx) => (
            <div key={idx} className="p-4 flex items-center gap-4">
              {/* Thumbnail */}
              <div className="w-16 h-20 bg-[#0c0c0c] border border-white/15 rounded-lg overflow-hidden shrink-0">
                <img
                  src={item.image || '/assets/lunar_ring_hero.jpg'}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Item Info */}
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-sm font-serif uppercase tracking-wide text-white font-normal truncate">
                  {item.name}
                </h4>
                <div className="flex items-center gap-3 text-xs text-[#888888]">
                  {item.size && (
                    <span>Size: <span className="text-white font-mono">{item.size}</span></span>
                  )}
                  {item.color && (
                    <span>• {item.color}</span>
                  )}
                  <span>Qty: <span className="text-white font-mono">{item.quantity || 1}</span></span>
                </div>
                <div className="text-xs text-[#A0A0A0] font-light">
                  Solid 925 Sterling Silver • Liquid Rhodium
                </div>
              </div>

              {/* Item Total */}
              <div className="text-right shrink-0">
                <span className="text-sm font-mono text-white font-medium">
                  ₹{(Number(item.price) * (item.quantity || 1)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipient & Shipping Destination Card */}
      <div className="border border-white/15 rounded-xl p-4 bg-black/60 backdrop-blur-md space-y-2">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#808080]">
            Shipping Destination
          </span>
          <button
            type="button"
            onClick={onEditAddress}
            className="text-[10px] uppercase tracking-[0.2em] text-[#C0C0C0] hover:text-white underline underline-offset-4 cursor-pointer"
          >
            Edit Address
          </button>
        </div>

        {address ? (
          <div className="text-xs text-[#B0B0B0] leading-relaxed pt-1">
            <p className="font-medium text-white">{address.fullName} • <span className="font-mono">{address.phone}</span></p>
            <p>{address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}</p>
            <p>{address.city}, {address.state} • <span className="font-mono text-white">{address.pincode}</span></p>
          </div>
        ) : (
          <p className="text-xs text-red-400">No destination configured</p>
        )}
      </div>

      {/* Settlement Protocol Card */}
      <div className="border border-white/15 rounded-xl p-4 bg-black/60 backdrop-blur-md space-y-2">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#808080]">
            Settlement Method
          </span>
          <button
            type="button"
            onClick={onEditPayment}
            className="text-[10px] uppercase tracking-[0.2em] text-[#C0C0C0] hover:text-white underline underline-offset-4 cursor-pointer"
          >
            Change
          </button>
        </div>
        <p className="text-xs text-white pt-1 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{paymentLabels[paymentMethod] || 'UPI / Online Payment'}</span>
        </p>
      </div>

      {/* Price Breakdown */}
      <div className="p-4 rounded-xl border border-white/15 bg-white/5 space-y-2 text-xs">
        <div className="flex justify-between text-[#888888]">
          <span>Subtotal</span>
          <span className="font-mono text-white">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-[#888888]">
          <span>White-Glove Insured Courier</span>
          <span className="text-emerald-400 uppercase tracking-wider text-[10px] font-medium">Complimentary</span>
        </div>
        <div className="flex justify-between text-[#888888]">
          <span>Atelier Hallmarking & Certificate</span>
          <span className="text-emerald-400 uppercase tracking-wider text-[10px] font-medium">Included</span>
        </div>
        <div className="border-t border-white/15 pt-2 flex justify-between items-baseline text-sm">
          <span className="text-xs uppercase tracking-[0.2em] text-white font-medium">Grand Total</span>
          <span className="text-lg sm:text-xl font-mono text-white font-semibold chrome-gradient-text">
            ₹{total.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Primary Pay Now Action */}
      <div className="pt-2 space-y-3">
        <button
          type="button"
          onClick={onPayNow}
          disabled={isSubmitting || !address || items.length === 0}
          className="w-full py-4 chrome-button text-xs uppercase tracking-[0.25em] font-semibold text-black flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              <span>Connecting Secure Gateway...</span>
            </span>
          ) : (
            <>
              <span>Pay Now • ₹{total.toLocaleString('en-IN')}</span>
              <span>→</span>
            </>
          )}
        </button>

        <p className="text-[9px] uppercase tracking-[0.2em] text-[#606060] text-center">
          By placing your order, you agree to the Maison Cosmic Terms & Bespoke Care Policies.
        </p>
      </div>
    </div>
  );
}
