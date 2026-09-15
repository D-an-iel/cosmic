import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import OrderCard from './OrderCard';
import OrdersEmptyState from './OrdersEmptyState';

export default function OrderHistory({ onAddToCart, onOpenCart }) {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('http://localhost:4000/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setOrders(data.data);
        } else {
          throw new Error(data.message || 'Failed to retrieve acquisition archive');
        }
      } catch (err) {
        console.warn('Orders fetch note:', err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const handleReorder = (product) => {
    if (onAddToCart && product) {
      onAddToCart(product);
      if (onOpenCart) {
        onOpenCart();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
        <span className="text-[10px] uppercase tracking-[0.35em] text-[#C0C0C0] block">
          Archiving Acquisition Registry...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 flex-wrap gap-2">
        <div>
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#808080] font-medium block">
            Maison Cosmic Ledger
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif uppercase tracking-[0.12em] text-white font-normal mt-0.5">
            Acquisition Archive
          </h2>
        </div>
        {orders.length > 0 && (
          <div className="text-[10px] uppercase tracking-widest text-[#A0A0A0] font-mono">
            {orders.length} Commission{orders.length > 1 ? 's' : ''} Recorded
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/40 text-red-300 text-xs">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <OrdersEmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onReorder={handleReorder}
            />
          ))}
        </div>
      )}
    </div>
  );
}
