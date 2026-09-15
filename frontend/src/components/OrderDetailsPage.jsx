import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OrderTimeline from './account/OrderTimeline';
import cosmicEmblem from '../assets/cosmic_emblem.png';

export default function OrderDetailsPage({ onAddToCart, onOpenCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    const fetchOrderAndPayment = async () => {
      setIsLoading(true);
      setError('');
      try {
        // 1. Fetch Order Details
        const orderRes = await fetch(`http://localhost:4000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const orderData = await orderRes.json();
        if (!orderData.success) {
          throw new Error(orderData.message || 'Acquisition record not found');
        }
        setOrder(orderData.data);

        // 2. Fetch Payment Details if available
        try {
          const payRes = await fetch(`http://localhost:4000/api/payments/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const payData = await payRes.json();
          if (payData.success && payData.data) {
            setPayment(payData.data);
          }
        } catch (payErr) {
          console.warn('Payment record note:', payErr.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id && token) {
      fetchOrderAndPayment();
    }
  }, [id, token]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you wish to cancel this commission?')) return;
    setIsCancelling(true);
    setActionMessage('');
    try {
      const res = await fetch(`http://localhost:4000/api/orders/${id}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setOrder((prev) => ({ ...prev, status: 'CANCELLED' }));
        setActionMessage('Commission cancelled successfully. Inventory restored.');
      } else {
        throw new Error(data.message || 'Failed to cancel order');
      }
    } catch (err) {
      alert('Cancellation error: ' + err.message);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleReorder = (item) => {
    if (onAddToCart && item) {
      onAddToCart(item.product || item);
      if (onOpenCart) {
        onOpenCart();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C0C0C0] block">
            Accessing Maison Vault...
          </span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-white/15 rounded-2xl bg-black/80 p-8 text-center space-y-6">
          <h2 className="text-2xl font-serif uppercase tracking-widest text-white">Registry Record Not Found</h2>
          <p className="text-xs text-[#808080] leading-relaxed">
            {error || 'This order could not be located in your client archives.'}
          </p>
          <Link
            to="/account/orders"
            className="inline-block px-8 py-3.5 chrome-button text-xs uppercase tracking-[0.25em] font-semibold text-black"
          >
            ← Return to Orders
          </Link>
        </div>
      </div>
    );
  }

  const status = (order.status || 'PENDING').toUpperCase();
  const isDelivered = status === 'DELIVERED';
  const canCancel = status === 'PENDING' || status === 'PROCESSING';
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent';

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#C0C0C0] selection:text-black pb-24 text-left">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-2xl px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/account/orders" className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#A0A0A0] hover:text-white transition-colors">
            <span>←</span>
            <span>All Orders</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-widest text-[#707070] font-mono hidden sm:inline">
              Ref: {order.orderNumber}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full border text-[9px] uppercase tracking-widest font-medium ${
              status === 'DELIVERED'
                ? 'border-emerald-500/40 text-emerald-300 bg-emerald-950/30'
                : status === 'CANCELLED'
                ? 'border-red-500/40 text-red-300 bg-red-950/20'
                : 'border-white/30 text-white bg-white/10'
            }`}>
              {status}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 space-y-10">
        {actionMessage && (
          <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 text-emerald-300 text-xs">
            {actionMessage}
          </div>
        )}

        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-white/10 pb-6 gap-4">
          <div>
            <span className="text-[9px] uppercase tracking-[0.35em] text-[#808080] font-medium block">
              Bespoke Commission Document
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif uppercase tracking-[0.12em] text-white font-light mt-1">
              Order Details
            </h1>
            <p className="text-xs text-[#707070] font-mono mt-1">
              Commission Logged: {orderDate}
            </p>
          </div>

          {/* Quick Track Order Link */}
          <button
            type="button"
            onClick={() => navigate(`/account/orders/${order.id}/tracking`)}
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl border border-white/30 hover:border-white text-xs uppercase tracking-[0.2em] text-white hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Track Order Journey</span>
            <span>→</span>
          </button>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column (7 cols): Products & Timeline */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* FEATURE 3: PRODUCT INFORMATION */}
            <div className="border border-white/15 rounded-2xl bg-black/60 backdrop-blur-xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#808080] font-medium">
                  Acquired Creations ({order.orderItems?.length || 0})
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#606060]">
                  Solid 925 Hallmark
                </span>
              </div>

              <div className="divide-y divide-white/10">
                {order.orderItems?.map((item, idx) => {
                  const prod = item.product || {};
                  let img = '/assets/lunar_ring_hero.jpg';
                  if (Array.isArray(prod.images) && prod.images.length > 0) {
                    img = typeof prod.images[0] === 'string' ? prod.images[0] : (prod.images[0]?.src || img);
                  } else if (prod.image) {
                    img = prod.image;
                  }

                  return (
                    <div key={idx} className="py-5 first:pt-0 last:pb-0 flex items-center gap-5">
                      {/* Image */}
                      <div className="w-20 h-24 rounded-xl bg-[#090909] border border-white/15 overflow-hidden shrink-0">
                        <img src={img} alt={prod.name} className="w-full h-full object-cover" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-sm sm:text-base font-serif uppercase tracking-wide text-white truncate font-normal">
                          {prod.name}
                        </h4>
                        <p className="text-xs text-[#808080] font-light">
                          Category: <span className="text-white">{prod.category || 'Fine Jewelry'}</span>
                        </p>
                        <div className="flex items-center gap-3 text-xs text-[#A0A0A0]">
                          <span>Quantity: <strong className="text-white font-mono">{item.quantity}</strong></span>
                          <span>•</span>
                          <span>Unit: <strong className="text-white font-mono">₹{Number(item.price).toLocaleString('en-IN')}</strong></span>
                        </div>
                      </div>

                      {/* Subtotal & Reorder */}
                      <div className="text-right shrink-0 space-y-2">
                        <span className="text-sm sm:text-base font-mono text-white font-medium block">
                          ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {isDelivered && (
                          <button
                            type="button"
                            onClick={() => handleReorder(item)}
                            className="text-[9px] uppercase tracking-widest text-emerald-400 hover:text-white underline underline-offset-4 cursor-pointer"
                          >
                            Order Again
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FEATURE 4: ORDER TIMELINE */}
            <div className="border border-white/15 rounded-2xl bg-black/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
              <OrderTimeline order={order} />
            </div>
          </div>

          {/* Right Column (5 cols): Shipping, Payment, Financial Summary */}
          <div className="lg:col-span-5 space-y-6">

            {/* FEATURE 3: SHIPPING INFORMATION */}
            <div className="border border-white/15 rounded-2xl bg-black/60 backdrop-blur-xl p-6 space-y-3 shadow-xl">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#808080] block border-b border-white/10 pb-2">
                Delivery Coordinates
              </span>
              {order.address ? (
                <div className="text-xs text-[#B0B0B0] leading-relaxed space-y-1 pt-1">
                  <p className="text-sm text-white font-medium uppercase tracking-wider">
                    {order.address.fullName}
                  </p>
                  <p>{order.address.addressLine1}</p>
                  {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                  <p>{order.address.city}, {order.address.state} — <span className="font-mono text-white">{order.address.pincode}</span></p>
                  <p className="text-[11px] font-mono text-[#888888] pt-1">
                    Contact: {order.address.phone}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-[#666666]">Standard Atelier Address</p>
              )}
            </div>

            {/* FEATURE 3: PAYMENT INFORMATION */}
            <div className="border border-white/15 rounded-2xl bg-black/60 backdrop-blur-xl p-6 space-y-3 shadow-xl">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#808080] block border-b border-white/10 pb-2">
                Settlement Record
              </span>
              <div className="space-y-2 text-xs text-[#A0A0A0]">
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="text-white font-medium">Razorpay 256-Bit SSL / Online</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-medium ${order.paymentStatus === 'PAID' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                    {order.paymentStatus || 'VERIFIED'}
                  </span>
                </div>
                {payment?.razorpayPaymentId && (
                  <div className="flex justify-between items-baseline gap-2">
                    <span>Transaction ID:</span>
                    <span className="font-mono text-[10px] text-[#C0C0C0] truncate">{payment.razorpayPaymentId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* FEATURE 3: ORDER SUMMARY */}
            <div className="border border-white/15 rounded-2xl bg-black/60 backdrop-blur-xl p-6 space-y-4 shadow-xl">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#808080] block border-b border-white/10 pb-2">
                Financial Summary
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#909090]">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#909090]">
                  <span>White-Glove Insured Delivery</span>
                  <span className="text-emerald-400 uppercase tracking-widest text-[10px]">Complimentary</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between items-baseline">
                  <span className="text-xs uppercase tracking-widest font-semibold text-white">Total Settled</span>
                  <span className="text-xl font-mono font-bold text-white chrome-gradient-text">
                    ₹{Number(order.total).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Cancel Order Action if Pending/Processing */}
            {canCancel && (
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="w-full py-3.5 rounded-xl border border-red-500/30 hover:border-red-500/60 bg-red-950/20 text-xs uppercase tracking-[0.2em] text-red-300 hover:text-red-200 transition-colors cursor-pointer"
              >
                {isCancelling ? 'Cancelling Commission...' : 'Cancel Commission'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
