import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OrderDetailsPage = () => {
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
        const response = await fetch(`http://localhost:4000/api/orders/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setOrder(data.data);
        } else {
          throw new Error(data.message || 'Failed to retrieve order details');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id, token]);

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C0C0C0]">
            Retrieving Acquisition Details...
          </span>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <h2 className="text-2xl font-serif uppercase tracking-wider text-white">Registry Error</h2>
          <p className="text-sm text-[#808080] font-light leading-relaxed">
            {error || 'The requested acquisition record could not be found in our archives.'}
          </p>
          <Link to="/account" className="inline-block px-8 py-3 chrome-button text-xs uppercase tracking-widest font-bold">
            Return To Registry
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#000000] text-white min-h-screen font-sans selection:bg-[#C0C0C0] selection:text-black">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/account" className="flex items-center gap-3 text-white hover:text-[#C0C0C0] transition-colors">
            <span className="text-xs uppercase tracking-widest text-[#707070] hover:text-white transition-colors">
              ← Back to Registry
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-widest text-[#A0A0A0] font-mono">
              Order {order.orderNumber}
            </span>
            <span className={`px-2 py-0.5 text-[9px] uppercase tracking-widest border ${
              order.paymentStatus === 'PAID' ? 'border-emerald-500/50 text-emerald-400' : 'border-yellow-500/50 text-yellow-400'
            }`}>
              {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left: Order Summary & Timeline (7 cols) */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-[#707070] block">
                Commission Summary
              </span>
              <h1 className="text-4xl font-serif uppercase tracking-tight text-white">
                Acquisition Details
              </h1>
              <div className="w-12 h-px bg-white/30" />
            </div>

            {/* Order Items Gallery */}
            <div className="space-y-6">
              <h3 className="text-xs uppercase tracking-[0.25em] text-white font-semibold border-b border-white/10 pb-2">
                Curated Pieces
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="group relative p-4 border border-white/10 bg-white/[0.02] flex gap-4 items-center hover:border-white/30 transition-all">
                    <div className="w-20 h-20 bg-black border border-white/10 shrink-0 overflow-hidden">
                      <img
                        src={item.product.images?.[0]?.src || item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs uppercase tracking-wider text-white truncate">{item.product.name}</h4>
                      <p className="text-[10px] text-[#808080] uppercase tracking-widest mt-1">
                        Qty: {item.quantity} • ₹{item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fulfillment Journey */}
            <div className="space-y-8 pt-12">
              <h3 className="text-xs uppercase tracking-[0.25em] text-white font-semibold border-b border-white/10 pb-2">
                Atelier Journey
              </h3>
              <div className="space-y-6">
                {[
                  { label: 'Order Confirmed', status: order.status === 'PENDING' ? 'Active' : 'Complete', icon: '01' },
                  { label: 'Hallmark Inspection', status: order.status === 'PROCESSING' ? 'Active' : order.status === 'PENDING' ? 'Pending' : 'Complete', icon: '02' },
                  { label: 'Insured Dispatch', status: order.status === 'SHIPPED' ? 'Active' : order.status === 'PROCESSING' ? 'Pending' : order.status === 'PENDING' ? 'Pending' : 'Complete', icon: '03' },
                  { label: 'Secure Handover', status: order.status === 'DELIVERED' ? 'Active' : 'Pending', icon: '04' },
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-6 group">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-mono transition-all ${
                      step.status === 'Complete' ? 'border-white text-white bg-white/10' :
                      step.status === 'Active' ? 'border-emerald-400 text-emerald-400 animate-pulse-subtle' : 'border-white/20 text-[#505050]'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <span className={`text-xs uppercase tracking-widest ${step.status === 'Active' ? 'text-white' : 'text-[#808080]'}`}>
                        {step.label}
                      </span>
                      <span className={`text-[10px] font-mono ${step.status === 'Complete' ? 'text-emerald-400' : 'text-[#505050]'}`}>
                        {step.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Financials & Shipping (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 space-y-6">
              <h3 className="text-xs uppercase tracking-[0.25em] text-white font-semibold border-b border-white/10 pb-4">
                Financial Registry
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-[#A0A0A0]">
                  <span>Subtotal Acquisition</span>
                  <span className="font-mono text-white">₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-[#A0A0A0]">
                  <span>Insured Courier Dispatch</span>
                  <span className="text-emerald-400 uppercase tracking-wider">Complimentary</span>
                </div>
                <div className="pt-4 border-t border-white/15 flex justify-between items-baseline">
                  <span className="text-sm uppercase tracking-[0.2em] font-semibold text-white">Grand Total</span>
                  <span className="font-mono text-xl font-bold text-white chrome-gradient-text">
                    ₹{Number(order.total).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 space-y-4">
              <h3 className="text-xs uppercase tracking-[0.25em] text-white font-semibold border-b border-white/10 pb-4">
                Delivery Coordinates
              </h3>
              <div className="text-xs text-[#A0A0A0] font-light leading-relaxed space-y-2">
                <p className="text-white font-medium uppercase tracking-wider">{order.address.fullName}</p>
                <p>{order.address.addressLine1}</p>
                {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                <p>{order.address.city}, {order.address.state} — {order.address.pincode}</p>
                <p className="uppercase tracking-widest text-[#666666]">{order.address.country}</p>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/account"
                className="inline-block px-8 py-3 border border-white/20 text-xs uppercase tracking-widest text-[#C0C0C0] hover:text-white hover:border-white transition-all cursor-pointer"
              >
                Return To Registry
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
