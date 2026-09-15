import React, { useState } from 'react';

const PAYMENT_METHODS = [
  {
    id: 'upi',
    title: 'UPI Instant Transfer',
    subtitle: 'Google Pay, PhonePe, Paytm, BHIM & Any UPI App',
    badge: 'Recommended • Fast',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'card',
    title: 'Credit / Debit Card',
    subtitle: 'Visa, Mastercard, American Express, Diners & RuPay',
    badge: '256-Bit Tokenized',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    id: 'netbanking',
    title: 'Net Banking',
    subtitle: 'HDFC, ICICI, SBI, Axis, Kotak & 50+ Premier Banks',
    badge: 'Direct Bank Wire',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 'cod',
    title: 'Cash On Delivery / Concierge',
    subtitle: 'Pay cash or card upon verified white-glove handover',
    badge: 'Insured Courier',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
];

export default function PaymentMethodScreen({
  selectedMethod = 'upi',
  onSelectMethod,
  onProceedToSummary,
  onBack,
}) {
  const [method, setMethod] = useState(selectedMethod);

  const handleSelect = (id) => {
    setMethod(id);
    onSelectMethod(id);
  };

  const handleProceed = () => {
    onProceedToSummary(method);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Editorial Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#A0A0A0] block font-medium">
            Step 02 • Settlement Protocol
          </span>
          <h2 className="text-xl sm:text-2xl font-serif uppercase tracking-[0.12em] text-white font-normal mt-0.5">
            Payment Method
          </h2>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-[10px] uppercase tracking-[0.2em] text-[#888888] hover:text-white cursor-pointer"
        >
          ← Edit Address
        </button>
      </div>

      <p className="text-xs text-[#909090] font-light leading-relaxed">
        Select your preferred settlement gateway. All online transactions are processed with bank-grade 256-bit encryption through Razorpay.
      </p>

      {/* Methods List */}
      <div className="space-y-3">
        {PAYMENT_METHODS.map((pm) => {
          const isSelected = method === pm.id;
          return (
            <div
              key={pm.id}
              onClick={() => handleSelect(pm.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                isSelected
                  ? 'border-[#C0C0C0] bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.12)]'
                  : 'border-white/15 bg-black/60 hover:border-white/30 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3.5 pr-4">
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'border-white bg-white text-black' : 'border-white/20 bg-white/5 text-[#A0A0A0]'
                }`}>
                  {pm.icon}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{pm.title}</span>
                    <span className="px-2 py-0.5 rounded-full border border-white/15 text-[8px] uppercase tracking-widest text-[#A0A0A0]">
                      {pm.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#808080] line-clamp-1">{pm.subtitle}</p>
                </div>
              </div>

              {/* Radio Circle */}
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                isSelected ? 'border-white bg-white text-black' : 'border-white/30'
              }`}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Gateway Assurance */}
      <div className="p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between text-xs text-[#707070]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Secured via Razorpay Payment Gateway</span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-[#909090]">SSL 256-Bit</span>
      </div>

      {/* CTA Button */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-1/3 py-4 border border-white/20 hover:border-white text-xs uppercase tracking-[0.2em] text-[#A0A0A0] hover:text-white transition-colors cursor-pointer text-center"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleProceed}
          className="w-full sm:w-2/3 py-4 chrome-button text-xs uppercase tracking-[0.25em] font-semibold text-black flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all cursor-pointer"
        >
          <span>Review Commission</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
