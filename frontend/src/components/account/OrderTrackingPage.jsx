import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import OrderTimeline from './OrderTimeline';
import cosmicEmblem from '../../assets/cosmic_emblem.png';

export default function OrderTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:4000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
        } else {
          throw new Error(data.message || 'Tracking document not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (id && token) {
      fetchOrder();
    }
  }, [id, token]);

  if (isLoading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#C0C0C0] block">
            Connecting Carrier Satellite...
          </span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-white/15 rounded-2xl bg-black/80 p-8 text-center space-y-6">
          <h2 className="text-2xl font-serif uppercase tracking-widest text-white">Tracking Unavailable</h2>
          <p className="text-xs text-[#808080] leading-relaxed">
            {error || 'Unable to load courier dispatch telemetry for this order.'}
          </p>
          <Link
            to="/account/orders"
            className="inline-block px-8 py-3.5 chrome-button text-xs uppercase tracking-[0.25em] font-semibold text-black"
          >
            Return to Orders
          </Link>
        </div>
      </div>
    );
  }

  const awbCode = `CSM-AWB-${order.id.slice(0, 8).toUpperCase()}`;
  const status = (order.status || 'PENDING').toUpperCase();

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#C0C0C0] selection:text-black pb-24 text-left">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-2xl px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to={`/account/orders/${order.id}`}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#A0A0A0] hover:text-white transition-colors"
          >
            <span>←</span>
            <span>Order Details</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-serif tracking-[0.25em] text-xs uppercase text-white">COSMIC</span>
          </div>

          <span className="text-[10px] font-mono text-[#707070] hidden sm:inline">
            {awbCode}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 space-y-8">
        {/* Title */}
        <div className="border-b border-white/10 pb-6 space-y-2">
          <span className="text-[9px] uppercase tracking-[0.35em] text-[#808080] font-medium block">
            Live Atelier Dispatch Telemetry
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif uppercase tracking-[0.12em] text-white font-light">
            Track Order
          </h1>
          <p className="text-xs text-[#808080] font-light">
            Real-time fulfillment milestone monitoring for commission <strong className="text-white font-mono">{order.orderNumber}</strong>.
          </p>
        </div>

        {/* Courier & Telemetry Overview Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-xl shadow-2xl text-xs">
          <div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#707070] block">Order Ref</span>
            <span className="font-mono text-white font-medium text-xs sm:text-sm">{order.orderNumber}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#707070] block">Carrier Partner</span>
            <span className="text-white font-medium">BlueDart Priority Air</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#707070] block">Tracking AWB</span>
            <span className="font-mono text-[#C0C0C0] text-[11px] truncate block">{awbCode}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#707070] block">Fulfillment State</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {status}
            </span>
          </div>
        </div>

        {/* Timeline Component */}
        <div className="border border-white/15 rounded-2xl bg-black/60 backdrop-blur-xl p-6 sm:p-10 shadow-2xl">
          <OrderTimeline order={order} />
        </div>

        {/* Destination Recap */}
        {order.address && (
          <div className="p-5 rounded-xl border border-white/10 bg-black/40 text-xs space-y-1">
            <span className="text-[9px] uppercase tracking-widest text-[#707070] block">
              Handover Coordinates
            </span>
            <p className="text-white font-medium">{order.address.fullName} • {order.address.phone}</p>
            <p className="text-[#909090]">{order.address.addressLine1}, {order.address.city}, {order.address.state} — {order.address.pincode}</p>
          </div>
        )}

        {/* Concierge Support Card */}
        <div className="p-6 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl text-center space-y-3">
          <h4 className="text-xs uppercase tracking-[0.25em] text-white font-medium">
            Dedicated Courier Escort Assistance
          </h4>
          <p className="text-xs text-[#808080] font-light max-w-md mx-auto leading-relaxed">
            Every Cosmic fine jewelry piece is transported under armed carrier transit insurance. For urgent address amendments or delivery windows, contact our concierge line.
          </p>
          <a
            href="mailto:concierge@cosmic-maison.com"
            className="inline-block px-6 py-2.5 rounded-xl border border-white/20 hover:border-white text-xs uppercase tracking-[0.2em] text-[#C0C0C0] hover:text-white transition-colors"
          >
            Contact Concierge
          </a>
        </div>
      </main>
    </div>
  );
}
