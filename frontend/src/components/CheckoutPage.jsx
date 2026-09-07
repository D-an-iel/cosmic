import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function CheckoutPage({ cart, onClearCart }) {
  const navigate = useNavigate();
  const location = useLocation();

  // If passed directly via "Buy Now", use state item, otherwise use cart
  const buyNowItem = location.state?.buyNowItem;
  const items = buyNowItem ? [buyNowItem] : (cart && cart.length > 0 ? cart : []);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: 'Alexander Vance',
    email: 'alexander.vance@cosmic-maison.com',
    phone: '+91 98765 43210',
    address: 'Penthouse 4B, Celestial Towers, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '•••• •••• •••• 9250',
    cardName: 'ALEXANDER VANCE',
    expiry: '09/29',
    cvv: '•••'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingFee = 0; // Complimentary
  const total = subtotal + shippingFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = `CSM-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderData = {
        orderId,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        items,
        total,
        shippingInfo,
        paymentMethod
      };

      if (!buyNowItem && onClearCart) {
        onClearCart();
      }

      setIsSubmitting(false);
      navigate('/order-success', { state: { orderData } });
    }, 900);
  };

  return (
    <div className="bg-[#000000] text-white min-h-screen font-sans selection:bg-[#C0C0C0] selection:text-black">
      {/* Top Header Breadcrumb */}
      <div className="border-b border-white/10 bg-black/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-white hover:text-[#C0C0C0] transition-colors">
            <span className="text-xl font-aileron font-light tracking-[0.25em] chrome-gradient-text uppercase">
              Cosmic
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-[#707070] pl-3 border-l border-white/15">
              Secure Checkout
            </span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-[#909090] tracking-wider">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            256-Bit SSL Encrypted
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {items.length === 0 ? (
          <div className="text-center py-24 border border-white/10 bg-[#070707] max-w-xl mx-auto p-10">
            <h2 className="text-2xl font-aileron uppercase tracking-[0.2em] mb-4 text-white">Your Bag is Empty</h2>
            <p className="text-sm text-[#888888] mb-8 font-light leading-relaxed">
              Explore our curated creations and elevate your silhouette with solid 925 silver craftsmanship.
            </p>
            <Link
              to="/#shop"
              className="inline-block px-8 py-3.5 chrome-button text-xs uppercase tracking-[0.25em] font-semibold"
            >
              Explore Creations
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Form (7 cols) */}
            <div className="lg:col-span-7 space-y-10">
              <form onSubmit={handlePlaceOrder} id="checkout-form">
                
                {/* Step 1: Customer & Shipping Address */}
                <div className="border border-white/10 bg-[#080808] p-6 sm:p-8 mb-8">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <h2 className="text-sm uppercase tracking-[0.25em] text-white flex items-center gap-3 font-semibold">
                      <span className="w-5 h-5 rounded-full border border-[#C0C0C0] text-[10px] flex items-center justify-center text-[#C0C0C0]">
                        1
                      </span>
                      Shipping & Delivery Address
                    </h2>
                    <span className="text-[10px] uppercase tracking-widest text-[#707070]">Insured Courier</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] uppercase tracking-widest text-[#909090] mb-2">
                        Full Recipient Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={shippingInfo.fullName}
                        onChange={handleInputChange}
                        className="w-full bg-[#030303] border border-white/15 px-4 py-3 text-white focus:border-[#C0C0C0] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#909090] mb-2">
                        Email Address (For Invoicing)
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        className="w-full bg-[#030303] border border-white/15 px-4 py-3 text-white focus:border-[#C0C0C0] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#909090] mb-2">
                        Phone Number (SMS Updates)
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        className="w-full bg-[#030303] border border-white/15 px-4 py-3 text-white focus:border-[#C0C0C0] focus:outline-none transition-colors"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] uppercase tracking-widest text-[#909090] mb-2">
                        Street Address / Suite / Landmark
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={shippingInfo.address}
                        onChange={handleInputChange}
                        className="w-full bg-[#030303] border border-white/15 px-4 py-3 text-white focus:border-[#C0C0C0] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#909090] mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        className="w-full bg-[#030303] border border-white/15 px-4 py-3 text-white focus:border-[#C0C0C0] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-[#909090] mb-2">
                        Postal Code / Pincode
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        required
                        value={shippingInfo.pincode}
                        onChange={handleInputChange}
                        className="w-full bg-[#030303] border border-white/15 px-4 py-3 text-white focus:border-[#C0C0C0] focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Delivery Guarantee Pill */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3 text-[11px] text-[#A0A0A0]">
                    <svg className="w-4 h-4 text-[#C0C0C0] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Complimentary Express Air Courier • Handcrafted velvet packaging included</span>
                  </div>
                </div>

                {/* Step 2: Payment Selection */}
                <div className="border border-white/10 bg-[#080808] p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <h2 className="text-sm uppercase tracking-[0.25em] text-white flex items-center gap-3 font-semibold">
                      <span className="w-5 h-5 rounded-full border border-[#C0C0C0] text-[10px] flex items-center justify-center text-[#C0C0C0]">
                        2
                      </span>
                      Payment Method
                    </h2>
                    <span className="text-[10px] uppercase tracking-widest text-emerald-400">Zero Gateway Fees</span>
                  </div>

                  {/* Method Selectors */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { id: 'card', name: 'Credit / Debit', icon: '💳' },
                      { id: 'upi', name: 'UPI / QR', icon: '⚡' },
                      { id: 'cod', name: 'Concierge COD', icon: '📦' }
                    ].map(method => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-3 text-left border transition-all cursor-pointer ${
                          paymentMethod === method.id
                            ? 'border-white bg-white/5 text-white'
                            : 'border-white/15 text-[#888888] hover:border-white/30'
                        }`}
                      >
                        <div className="text-lg mb-1">{method.icon}</div>
                        <div className="text-[10px] uppercase tracking-widest font-medium">{method.name}</div>
                      </button>
                    ))}
                  </div>

                  {/* Metallic Credit Card Mockup */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div className="relative p-6 rounded-none border border-white/20 bg-gradient-to-br from-[#1c1c1c] via-[#0d0d0d] to-[#000000] shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
                        <div className="flex justify-between items-start mb-8">
                          <span className="text-xs uppercase tracking-[0.3em] text-[#C0C0C0]">Cosmic Reserve</span>
                          <span className="font-mono text-xs text-[#808080]">925 PLATINUM</span>
                        </div>
                        <div className="font-mono text-lg tracking-[0.25em] text-white mb-6">
                          {cardDetails.cardNumber}
                        </div>
                        <div className="flex justify-between text-[10px] tracking-wider text-[#A0A0A0] uppercase">
                          <div>
                            <div className="text-[8px] text-[#606060]">Cardholder</div>
                            <div>{cardDetails.cardName}</div>
                          </div>
                          <div>
                            <div className="text-[8px] text-[#606060]">Expires</div>
                            <div>{cardDetails.expiry}</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-1">Expiry Date</label>
                          <input
                            type="text"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                            className="w-full bg-[#030303] border border-white/15 px-3 py-2 text-white text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-[#888888] mb-1">Security CVV</label>
                          <input
                            type="password"
                            maxLength="4"
                            defaultValue="789"
                            className="w-full bg-[#030303] border border-white/15 px-3 py-2 text-white text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <div className="p-4 border border-white/10 bg-[#050505] text-xs space-y-3">
                      <p className="text-[#A0A0A0]">Enter your Virtual Payment Address (VPA) or scan QR on next step:</p>
                      <input
                        type="text"
                        placeholder="username@okhdfcbank"
                        defaultValue="alexander@upi"
                        className="w-full bg-[#020202] border border-white/20 px-3 py-2 text-white text-xs font-mono"
                      />
                      <div className="text-[10px] text-[#707070]">Supported: Google Pay, PhonePe, Paytm, Cred, BHIM</div>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="p-4 border border-white/10 bg-[#050505] text-xs text-[#A0A0A0] leading-relaxed">
                      White-glove Cash on Delivery is enabled for this order. An automated OTP verification call will confirm dispatch within 1 hour.
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 chrome-button text-xs uppercase tracking-[0.3em] font-semibold flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_30px_rgba(255,255,255,0.15)] disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                        <span>Securing Atelier Dispatch...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Order • ₹{total.toLocaleString('en-IN')}</span>
                        <span>→</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              <div className="border border-white/10 bg-[#080808] p-6 sm:p-8">
                <h3 className="text-xs uppercase tracking-[0.25em] text-white font-semibold mb-6 pb-3 border-b border-white/10">
                  Order Summary ({items.length} {items.length === 1 ? 'Creation' : 'Creations'})
                </h3>

                {/* Items List */}
                <div className="divide-y divide-white/10 max-h-[380px] overflow-y-auto pr-2 space-y-4 mb-6">
                  {items.map((item, idx) => (
                    <div key={idx} className="pt-4 first:pt-0 flex gap-4 items-center">
                      <div className="w-16 h-16 bg-[#040404] border border-white/15 overflow-hidden shrink-0 relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 bg-black/90 text-[9px] px-1 text-[#C0C0C0] font-mono border-t border-l border-white/15">
                          ×{item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-serif uppercase tracking-wider text-white truncate">
                          {item.name}
                        </h4>
                        <div className="flex flex-wrap gap-2 text-[10px] text-[#888888] mt-1">
                          {item.color && (
                            <span className="border border-white/10 px-1.5 py-0.5 bg-white/5">
                              {item.color}
                            </span>
                          )}
                          {item.size && (
                            <span className="border border-white/10 px-1.5 py-0.5 bg-white/5">
                              Size {item.size}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right font-mono text-xs text-white">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing Table */}
                <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                  <div className="flex justify-between text-[#A0A0A0]">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-[#A0A0A0]">
                    <span>Luxury Velvet Packaging</span>
                    <span className="text-white uppercase text-[10px] tracking-wider">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-[#A0A0A0]">
                    <span>Insured Courier Dispatch</span>
                    <span className="text-emerald-400 uppercase text-[10px] tracking-wider">Free (₹0)</span>
                  </div>
                  <div className="pt-4 border-t border-white/15 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm uppercase tracking-[0.2em] font-semibold text-white">Total Due</span>
                      <div className="text-[10px] text-[#707070]">Includes all atelier taxes</div>
                    </div>
                    <span className="font-mono text-xl font-bold text-white chrome-gradient-text">
                      ₹{total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Maison Guarantees Card */}
              <div className="border border-white/10 bg-[#050505] p-5 text-[11px] text-[#888888] space-y-3">
                <div className="flex items-center gap-2.5 text-white font-medium">
                  <span className="text-[#C0C0C0]">✦</span>
                  <span className="uppercase tracking-widest text-[10px]">The Cosmic Atelier Guarantee</span>
                </div>
                <p className="leading-relaxed font-light">
                  Every order is individually inspected and hallmarked prior to departure. Accompanied by a certificate of authenticity and 30-day effortless return window.
                </p>
              </div>

              <div className="text-center">
                <Link
                  to="/#shop"
                  className="text-[10px] uppercase tracking-[0.25em] text-[#808080] hover:text-white transition-colors"
                >
                  ← Return To Boutique Catalog
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
