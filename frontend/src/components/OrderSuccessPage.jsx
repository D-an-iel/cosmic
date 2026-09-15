import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import LuxuryConfirmation from './luxury-flow/LuxuryConfirmation';
import cosmicEmblem from '../assets/cosmic_emblem.png';

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const stateData = location.state || {};
  const orderNumber = stateData.orderNumber || stateData.orderId || 'CSM-849204';
  const paymentId = stateData.paymentId || 'PAY-VERIFIED';
  const amount = stateData.amount || 799;
  const items = stateData.items || [];
  const shippingInfo = stateData.shippingInfo || { fullName: 'Esteemed Patron' };

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-[#C0C0C0] selection:text-black pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-2xl px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-white hover:text-[#C0C0C0] transition-colors">
            <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center">
              {cosmicEmblem ? (
                <img src={cosmicEmblem} alt="Cosmic" className="w-3.5 h-3.5 object-contain filter invert" />
              ) : (
                <span className="text-white text-xs">✦</span>
              )}
            </div>
            <span className="font-serif text-lg tracking-[0.25em] uppercase chrome-gradient-text">
              Cosmic
            </span>
          </Link>

          <span className="text-[10px] uppercase tracking-[0.25em] text-[#808080]">
            Acquisition Record
          </span>
        </div>
      </header>

      <main className="max-w-xl sm:max-w-2xl mx-auto px-4 sm:px-6 pt-10">
        <LuxuryConfirmation
          orderNumber={orderNumber}
          paymentId={paymentId}
          amount={amount}
          items={items}
          shippingInfo={shippingInfo}
          onContinueShopping={() => navigate('/#shop')}
        />
      </main>
    </div>
  );
}
