import React from 'react';

const TRACKING_STAGES = [
  {
    id: 1,
    title: 'Order Placed',
    status: 'completed',
    date: 'Today, 02:44 AM',
    location: 'Maison Cosmic Digital Atelier',
    description: 'Commission authorized & reserved under verified signature hallmark.',
  },
  {
    id: 2,
    title: 'Packed & Hallmarked',
    status: 'current',
    date: 'In Progress • Expected Today',
    location: 'Milanese Goldsmith Atelier',
    description: 'Piece undergoes laser hallmark inspection and velvet monolith packaging.',
  },
  {
    id: 3,
    title: 'Shipped via Insured Courier',
    status: 'upcoming',
    date: 'Tomorrow, Morning Dispatch',
    location: 'Priority Hub',
    description: 'Armored carrier transit with comprehensive transit insurance policy.',
  },
  {
    id: 4,
    title: 'Out For Delivery',
    status: 'upcoming',
    date: 'Expected in 2–3 Days',
    location: 'Destination Facility',
    description: 'Personal courier dispatch for verified recipient handover.',
  },
  {
    id: 5,
    title: 'Delivered to Patron',
    status: 'upcoming',
    date: 'Estimated Delivery in 3 Days',
    location: 'Registered Residence',
    description: 'Direct contactless or signed physical handover.',
  },
];

export default function OrderTrackingTimeline({
  orderNumber = 'CSM-849204',
  onClose,
}) {
  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div>
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#A0A0A0] block font-medium">
            Live Atelier Dispatch
          </span>
          <h3 className="text-lg sm:text-xl font-serif uppercase tracking-[0.12em] text-white font-normal mt-0.5">
            Commission Tracking
          </h3>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close tracking"
            className="w-8 h-8 rounded-full border border-white/15 bg-black/40 hover:bg-white/10 flex items-center justify-center text-[#A0A0A0] hover:text-white transition-all cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tracking Metadata Header */}
      <div className="p-4 rounded-xl border border-white/15 bg-black/60 backdrop-blur-md grid grid-cols-2 gap-4 text-xs">
        <div>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#707070] block">
            Order Reference
          </span>
          <span className="font-mono text-sm text-white font-medium">{orderNumber}</span>
        </div>
        <div>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#707070] block">
            Courier Partner
          </span>
          <span className="text-white font-medium">BlueDart Priority Air</span>
        </div>
        <div>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#707070] block">
            Waybill AWB
          </span>
          <span className="font-mono text-xs text-[#C0C0C0]">CSM-AWB-984210</span>
        </div>
        <div>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#707070] block">
            Status
          </span>
          <span className="text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Atelier Preparation
          </span>
        </div>
      </div>

      {/* Visual Vertical Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-white before:via-white/40 before:to-white/10">
        {TRACKING_STAGES.map((stage) => {
          const isCompleted = stage.status === 'completed';
          const isCurrent = stage.status === 'current';

          return (
            <div key={stage.id} className="relative group">
              {/* Dot Icon */}
              <div
                className={`absolute -left-[27px] top-1 w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  isCompleted
                    ? 'border-white bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                    : isCurrent
                    ? 'border-emerald-400 bg-black text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.5)]'
                    : 'border-white/20 bg-black text-[#505050]'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-3 h-3 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : isCurrent ? (
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                )}
              </div>

              {/* Content */}
              <div className="space-y-1">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <h4 className={`text-sm font-medium ${isCurrent ? 'text-white font-semibold' : isCompleted ? 'text-white' : 'text-[#707070]'}`}>
                    {stage.title}
                  </h4>
                  <span className={`text-[10px] font-mono ${isCurrent ? 'text-emerald-400 font-medium' : 'text-[#808080]'}`}>
                    {stage.date}
                  </span>
                </div>
                <p className="text-xs text-[#909090] font-light leading-relaxed">
                  {stage.description}
                </p>
                <div className="text-[10px] uppercase tracking-wider text-[#606060]">
                  📍 {stage.location}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Concierge Help */}
      <div className="p-3.5 rounded-xl border border-white/10 bg-black/40 text-center text-xs text-[#808080]">
        Need assistance with your handover? Contact our concierge at{' '}
        <span className="text-[#C0C0C0] font-mono">concierge@cosmic-maison.com</span>
      </div>
    </div>
  );
}
