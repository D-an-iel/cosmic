import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OrderHistory = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('http://localhost:4000/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success) {
          setOrders(data.data);
        } else {
          throw new Error(data.message || 'Failed to retrieve acquisitions');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  if (isLoading) {
    return (
      <div className="py-20 text-center text-xs uppercase tracking-widest text-[#666666] animate-pulse-subtle">
        Archiving Acquisition History...
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-serif uppercase tracking-wider text-white">Acquisition Archive</h2>
          <p className="text-[10px] uppercase tracking-widest text-[#808080] mt-1">
            A chronological record of your commissions with Maison Cosmic.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-900/20 border border-red-500/30 text-red-400 text-[10px] uppercase tracking-widest text-center">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/10 bg-white/[0.02]">
          <p className="text-xs uppercase tracking-widest text-[#666666]">
            No acquisitions recorded in your registry.
          </p>
        </div>
      ) : (
        <div className="space-y-0">
          {orders.map((order, idx) => (
            <div
              key={order.id}
              className="group relative py-8 border-b border-white/10 hover:bg-white/[0.02] transition-all duration-500 cursor-pointer"
              onClick={() => navigate(`/account/order/${order.id}`)}
            >
              {/* Cinematic Background Order ID */}
              <div className="absolute right-0 top-0 text-6xl md:text-8xl font-serif opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none chrome-gradient-text uppercase">
                {order.orderNumber.split('-')[1] || '000'}
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-white font-medium uppercase tracking-widest">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-[#666666] font-mono">
                      — {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      order.paymentStatus === 'PAID' ? 'bg-emerald-400' : 'bg-yellow-400'
                    }`} />
                    <span className="text-[10px] uppercase tracking-widest text-[#A0A0A0]">
                      {order.paymentStatus} {order.status === 'SHIPPED' ? '• Dispatched' : `• ${order.status}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-8">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest text-[#666666] block">Total Acquisition</span>
                    <span className="font-mono text-sm text-white">₹{Number(order.total).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="text-white text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    Details →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
