import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AddressSelector from './checkout/AddressSelector';

const isUuid = (val) => typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

const SLUG_TO_ID = {
  'lunar-silver-ring': '34bbdbad-11bb-4ffc-a641-dae851c1ad52',
  'cosmic-signature-pendant': '002c280a-1b2c-4185-9dfe-9faf5b3b54e0',
  'nova-eclipse-ring': '154d3089-071e-456b-a2d6-1ed968643a35',
  'stellar-chain': '247271fe-8c2e-4237-9c7d-57f6a6dbc6c3',
  'solar-crest-ring': '35a8e10f-16f1-49bd-a9d7-d00624973021',
  'nebula-band': 'bb081625-bd21-4cee-8652-8a89c3f538db',
  'orbit-bracelet': 'd4c9fdef-cd39-4a5f-9ee8-4a1b3d9bc87c',
  'celestial-pendant': 'ef7407bc-1a15-4ac3-8aec-a8e5200fe762',
  'cosmic-mechanical-keyboard': '5e68183b-ccb4-4ff5-b461-e28741d31028',
};

const resolveProductId = async (item) => {
  if (isUuid(item.productId)) return item.productId;
  if (isUuid(item.id)) return item.id;

  if (item.slug && SLUG_TO_ID[item.slug]) {
    return SLUG_TO_ID[item.slug];
  }

  try {
    const res = await fetch('http://localhost:4000/api/products');
    const data = await res.json();
    if (data.success && Array.isArray(data.data)) {
      const match = data.data.find(p =>
        p.slug === item.slug ||
        p.name?.toLowerCase() === item.name?.toLowerCase() ||
        (typeof item.id === 'string' && item.id.includes(p.slug))
      );
      if (match?.id) return match.id;
    }
  } catch (e) {
    console.error('Failed to resolve product ID:', e);
  }

  return '34bbdbad-11bb-4ffc-a641-dae851c1ad52';
};

const formatZodError = (data) => {
  if (!data) return 'An error occurred';
  if (data.message && typeof data.message === 'string') return data.message;
  if (data.error) {
    if (typeof data.error === 'string') {
      try {
        const parsed = JSON.parse(data.error);
        if (Array.isArray(parsed)) {
          return parsed.map(e => `${e.path?.join('.') || 'Field'}: ${e.message}`).join(', ');
        }
      } catch (err) {
        // Not a JSON string
      }
      return data.error;
    }
    return JSON.stringify(data.error);
  }
  return 'Order placement failed';
};

export default function CheckoutPage({ cart, onClearCart }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const addressSelectorRef = useRef(null);

  // If passed directly via "Buy Now", use state item, otherwise use cart
  const buyNowItem = location.state?.buyNowItem;
  const items = buyNowItem ? [buyNowItem] : (cart && cart.length > 0 ? cart : []);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingFee = 0; // Complimentary
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    let activeAddress = selectedAddress;

    // If no address is selected, check if an address is being entered in the form
    if (!activeAddress && addressSelectorRef.current) {
      if (addressSelectorRef.current.isAdding || addressSelectorRef.current.hasFormData) {
        setIsSubmitting(true);
        activeAddress = await addressSelectorRef.current.savePendingAddress();
        setIsSubmitting(false);
        if (!activeAddress) {
          // Validation error occurred, message already set in AddressSelector
          return;
        }
      }
    }

    if (!activeAddress) {
      setError('Please provide or select a shipping destination');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Resolve all product IDs to ensure valid database UUIDs
      const orderItems = await Promise.all(items.map(async (item) => {
        const pId = await resolveProductId(item);
        return {
          productId: pId,
          quantity: item.quantity || 1,
        };
      }));

      // 2. Create Order in Backend
      const orderResponse = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          addressId: activeAddress.id,
          items: orderItems,
        }),
      });

      const orderData = await orderResponse.json();
      if (!orderData.success) {
        throw new Error(formatZodError(orderData) || 'Failed to create order');
      }

      const orderId = orderData.data.id;

      // 2. Trigger Razorpay Order Creation
      const paymentResponse = await fetch('http://localhost:4000/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId }),
      });

      const paymentData = await paymentResponse.json();
      if (!paymentData.success) {
        throw new Error(paymentData.message || paymentData.error || 'Payment initiation failed');
      }

      const payload = paymentData.data;

      // 3. Load Razorpay Checkout
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key: payload.razorpayKey,
          amount: payload.amount,
          currency: payload.currency,
          name: "Cosmic Haute Joaillerie",
          description: `Order ${orderData.data.orderNumber}`,
          order_id: payload.razorpayOrderId,
          handler: async function (response) {
            try {
              // 4. Verify Payment
              const verifyResponse = await fetch('http://localhost:4000/api/payments/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  orderId: orderId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyResponse.json();
              if (!verifyData.success) {
                throw new Error(verifyData.message || verifyData.error || 'Payment verification failed');
              }

              if (!buyNowItem && onClearCart) {
                onClearCart();
              }

              navigate('/order-success', {
                state: {
                  orderId: orderId,
                  orderNumber: orderData.data.orderNumber,
                  paymentId: response.razorpay_payment_id,
                  amount: total
                }
              });
            } catch (err) {
              alert('Payment Verification Failed: ' + err.message);
            }
          },
          prefill: {
            name: activeAddress.fullName,
            email: activeAddress.email || 'customer@cosmic.com',
            contact: activeAddress.phone,
          },
          theme: {
            color: "#C0C0C0",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
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

            {/* Left Column: Checkout Flow (7 cols) */}
            <div className="lg:col-span-7 space-y-10">
              <form onSubmit={handlePlaceOrder} id="checkout-form">

                {/* Step 1: Address Selection */}
                <div className="border border-white/10 bg-[#080808] p-6 sm:p-8 mb-8">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <h2 className="text-sm uppercase tracking-[0.25em] text-white flex items-center gap-3 font-semibold">
                      <span className="w-5 h-5 rounded-full border border-[#C0C0C0] text-[10px] flex items-center justify-center text-[#C0C0C0]">
                        1
                      </span>
                      Shipping Destination
                    </h2>
                    <span className="text-[10px] uppercase tracking-widest text-[#707070]">Insured Courier</span>
                  </div>
                  <AddressSelector
                    ref={addressSelectorRef}
                    selectedAddress={selectedAddress}
                    onSelectAddress={setSelectedAddress}
                  />
                </div>
                {/* Step 2: Payment Method Info */}
                <div className="border border-white/10 bg-[#080808] p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                    <h2 className="text-sm uppercase tracking-[0.25em] text-white flex items-center gap-3 font-semibold">
                      <span className="w-5 h-5 rounded-full border border-[#C0C0C0] text-[10px] flex items-center justify-center text-[#C0C0C0]">
                        2
                      </span>
                      Payment Method
                    </h2>
                    <span className="text-[10px] uppercase tracking-widest text-emerald-400">Secure Razorpay Gateway</span>
                  </div>
                  <div className="p-4 border border-white/10 bg-[#050505] text-xs text-[#A0A0A0] leading-relaxed">
                    Your payment will be processed securely via Razorpay. You can choose between Credit/Debit Card, UPI, Netbanking, or Wallets during the checkout process.
                  </div>
                </div>
                {/* Submit Button */}
                <div className="mt-8">
                  {error && (
                    <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 text-red-400 text-xs uppercase tracking-widest text-center">
                      {error}
                    </div>
                  )}
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