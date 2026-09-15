import React from 'react';

const DEFAULT_STAGES = [
  {
    key: 'placed',
    title: 'Order Placed',
    subtitle: 'Commission logged and reserved in private registry',
    dateLabel: 'Recorded',
  },
  {
    key: 'confirmed',
    title: 'Confirmed',
    subtitle: 'Payment settled & allocation verified by concierge',
    dateLabel: 'Verified',
  },
  {
    key: 'packed',
    title: 'Packed',
    subtitle: 'Laser hallmark inspection & velvet monolith packaging',
    dateLabel: 'Atelier',
  },
  {
    key: 'shipped',
    title: 'Shipped',
    subtitle: 'Dispatched via insured armored courier priority air',
    dateLabel: 'Transit',
  },
  {
    key: 'delivered',
    title: 'Delivered',
    subtitle: 'Verified contactless or personal recipient handover',
    dateLabel: 'Complete',
  },
];

export default function OrderTimeline({ order, createdAt }) {
  if (!order) return null;

  const status = (order.status || 'PENDING').toUpperCase();
  const paymentStatus = (order.paymentStatus || 'PENDING').toUpperCase();
  const isCancelled = status === 'CANCELLED';

  // Map order status to stage index (0 to 4)
  const getActiveStageIndex = () => {
    if (isCancelled) return -1;
    if (status === 'DELIVERED') return 4;
    if (status === 'SHIPPED') return 3;
    if (status === 'PROCESSING' || paymentStatus === 'PAID') return 2;
    if (status === 'CONFIRMED') return 1;
    return 0; // PENDING
  };

  const activeIndex = getActiveStageIndex();
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today';

  if (isCancelled) {
    return (
      <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-left space-y-2 animate-fade-in">
        <div className="flex items-center gap-2 text-red-400 text-xs uppercase tracking-widest font-semibold">
          <span>✕</span>
          <span>Order Cancelled</span>
        </div>
        <p className="text-xs text-[#A0A0A0] leading-relaxed">
          This commission has been cancelled. Any reserved allocations have been returned to inventory and payments processed per policy.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#808080] font-medium">
          Atelier Fulfillment Timeline
        </span>
        <span className="text-[10px] font-mono text-emerald-400 font-medium flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {status === 'DELIVERED' ? 'Delivered' : status === 'SHIPPED' ? 'In Transit' : 'Atelier Care'}
        </span>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 space-y-7 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-white before:via-white/40 before:to-white/10">
        {DEFAULT_STAGES.map((stage, idx) => {
          const isCompleted = idx < activeIndex || (idx === 4 && activeIndex === 4);
          const isCurrent = idx === activeIndex && activeIndex !== 4;
          const isUpcoming = idx > activeIndex;

          return (
            <div key={stage.key} className="relative group">
              {/* Dot indicator */}
              <div
                className={`absolute -left-[27px] top-0.5 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${
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

              {/* Text content */}
              <div className="space-y-0.5">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <h4
                    className={`text-xs uppercase tracking-widest font-medium ${
                      isCurrent ? 'text-white font-semibold' : isCompleted ? 'text-white' : 'text-[#606060]'
                    }`}
                  >
                    {stage.title}
                  </h4>
                  <span
                    className={`text-[10px] font-mono ${
                      isCurrent
                        ? 'text-emerald-400 font-medium'
                        : isCompleted
                        ? 'text-[#808080]'
                        : 'text-[#505050]'
                    }`}
                  >
                    {idx === 0 ? orderDate : isCurrent ? 'Active Stage' : stage.dateLabel}
                  </span>
                </div>
                <p className="text-[11px] text-[#808080] font-light leading-relaxed">
                  {stage.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
