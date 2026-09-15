import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function OrderCard({ order, onReorder }) {
  const navigate = useNavigate();

  if (!order) return null;

  const orderItems = order.orderItems || [];
  const primaryItem = orderItems[0];
  const product = primaryItem?.product;

  // Resolve image safely
  let imgUrl = '/assets/lunar_ring_hero.jpg';
  if (product) {
    if (Array.isArray(product.images) && product.images.length > 0) {
      imgUrl = typeof product.images[0] === 'string' ? product.images[0] : (product.images[0]?.src || imgUrl);
    } else if (product.image) {
      imgUrl = product.image;
    }
  }

  // Format date
  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Recent Acquisition';

  // Status mapping
  const status = (order.status || 'PENDING').toUpperCase();
  const isDelivered = status === 'DELIVERED';

  const statusConfig = {
    PENDING: { label: 'Order Logged', badgeClass: 'border-yellow-500/40 text-yellow-300 bg-yellow-950/20' },
    PROCESSING: { label: 'Processing • Atelier Care', badgeClass: 'border-white/30 text-white bg-white/10' },
    CONFIRMED: { label: 'Confirmed', badgeClass: 'border-white/40 text-white bg-white/15' },
    PACKED: { label: 'Packed & Hallmarked', badgeClass: 'border-white/40 text-[#E0E0E0] bg-white/10' },
    SHIPPED: { label: 'Shipped • In Transit', badgeClass: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/20' },
    DELIVERED: { label: 'Delivered', badgeClass: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30' },
    CANCELLED: { label: 'Cancelled', badgeClass: 'border-red-500/40 text-red-300 bg-red-950/20' },
  };

  const currentStatusConfig = statusConfig[status] || statusConfig.PENDING;

  const handleCardClick = () => {
    navigate(`/account/orders/${order.id}`);
  };

  const handleReorderClick = (e) => {
    e.stopPropagation();
    if (onReorder && primaryItem) {
      onReorder(product || primaryItem);
    }
  };

  const handleTrackClick = (e) => {
    e.stopPropagation();
    navigate(`/account/orders/${order.id}/tracking`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative p-5 sm:p-7 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-xl hover:border-white/40 hover:bg-white/[0.03] transition-all duration-300 cursor-pointer shadow-2xl text-left overflow-hidden space-y-5"
    >
      {/* Background Watermark Order Number */}
      <div className="absolute right-4 -top-3 text-7xl sm:text-8xl font-serif text-white/[0.03] select-none pointer-events-none group-hover:text-white/[0.06] transition-colors">
        {order.orderNumber?.split('-')?.[1] || 'CSM'}
      </div>

      {/* Card Header: Status & Order ID */}
      <div className="flex items-center justify-between flex-wrap gap-2 relative z-10 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#A0A0A0] uppercase tracking-widest">
            {order.orderNumber}
          </span>
          <span className="text-[#404040]">•</span>
          <span className="text-[10px] uppercase tracking-widest text-[#707070]">
            {formattedDate}
          </span>
        </div>

        {/* Status Badge */}
        <div className={`px-2.5 py-1 rounded-full border text-[9px] uppercase tracking-[0.2em] font-medium flex items-center gap-1.5 ${currentStatusConfig.badgeClass}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          <span>{currentStatusConfig.label}</span>
        </div>
      </div>

      {/* Main Content: Thumbnail & Details */}
      <div className="flex items-center gap-4 sm:gap-6 relative z-10">
        {/* Product Image */}
        <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl bg-[#0a0a0a] border border-white/15 overflow-hidden shrink-0 group-hover:border-white/40 transition-colors">
          <img
            src={imgUrl}
            alt={product?.name || 'Cosmic Creation'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Product Meta */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <h4 className="text-base sm:text-lg font-serif uppercase tracking-wide text-white truncate font-normal group-hover:text-[#E0E0E0]">
            {product?.name || 'Bespoke Cosmic Creation'}
          </h4>

          {orderItems.length > 1 && (
            <p className="text-xs text-[#808080] font-light">
              + {orderItems.length - 1} additional creation{orderItems.length > 2 ? 's' : ''}
            </p>
          )}

          <div className="text-xs text-[#A0A0A0] font-light flex items-center gap-3">
            <span>Qty: <strong className="text-white font-mono">{primaryItem?.quantity || 1}</strong></span>
            <span>•</span>
            <span className="text-emerald-400">Insured Delivery</span>
          </div>

          <div className="pt-1">
            <span className="text-[9px] uppercase tracking-widest text-[#707070] block">Grand Total</span>
            <span className="text-lg sm:text-xl font-mono text-white font-medium chrome-gradient-text">
              ₹{Number(order.total).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10 relative z-10 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          {/* Track Order CTA */}
          <button
            type="button"
            onClick={handleTrackClick}
            className="px-3.5 py-1.5 rounded-lg border border-white/20 hover:border-white text-[10px] uppercase tracking-[0.2em] text-[#C0C0C0] hover:text-white transition-colors cursor-pointer"
          >
            Track Order
          </button>

          {/* Reorder Button if Delivered */}
          {isDelivered && (
            <button
              type="button"
              onClick={handleReorderClick}
              className="px-3.5 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/20 hover:bg-emerald-900/30 text-[10px] uppercase tracking-[0.2em] text-emerald-300 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>↻</span>
              <span>Order Again</span>
            </button>
          )}
        </div>

        <div className="text-xs uppercase tracking-[0.2em] text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <span>View Details</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
}
