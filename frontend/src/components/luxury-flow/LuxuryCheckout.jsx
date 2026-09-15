import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import MobileAddressScreen from './MobileAddressScreen';
import PaymentMethodScreen from './PaymentMethodScreen';
import OrderSummaryScreen from './OrderSummaryScreen';
import ProcessingOverlay from './ProcessingOverlay';
import LuxuryConfirmation from './LuxuryConfirmation';
import cosmicEmblem from '../../assets/cosmic_emblem.png';

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
      const match = data.data.find(
        (p) =>
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

export default function LuxuryCheckout({ cart = [], onClearCart }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();

  // Buy Now item or global Cart
  const buyNowItem = location.state?.buyNowItem;
  const items = buyNowItem ? [buyNowItem] : (cart && cart.length > 0 ? cart : []);

  // Step state: 'address' | 'payment' | 'summary' | 'confirmed'
  const [currentStep, setCurrentStep] = useState('address');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('Processing Payment');
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [error, setError] = useState('');

  // Load Saved Addresses for logged-in Patron
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!token) return;
      try {
        const res = await fetch('http://localhost:4000/api/addresses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setSavedAddresses(data.data);
          const defaultAddr = data.data.find((a) => a.isDefault) || data.data[0];
          if (defaultAddr) setSelectedAddress(defaultAddr);
        }
      } catch (err) {
        console.warn('Could not fetch saved addresses:', err.message);
      }
    };

    fetchAddresses();
  }, [token]);

  // Save new address via backend API
  const handleSaveNewAddress = async (formData) => {
    setIsSubmitting(true);
    setError('');

    try {
      if (token) {
        const res = await fetch('http://localhost:4000/api/addresses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            phone: formData.phone,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2 || '',
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            country: 'India',
            isDefault: formData.isDefault,
          }),
        });

        const data = await res.json();
        if (data.success && data.data) {
          setSavedAddresses((prev) => [data.data, ...prev]);
          setSelectedAddress(data.data);
          return data.data;
        }
      }

      // Fallback local address if guest or offline
      const localAddress = {
        id: `local-${Date.now()}`,
        ...formData,
        country: 'India',
      };
      setSelectedAddress(localAddress);
      return localAddress;
    } catch (err) {
      console.error('Failed to save address:', err);
      const fallback = { id: `local-${Date.now()}`, ...formData, country: 'India' };
      setSelectedAddress(fallback);
      return fallback;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Place Order & Trigger Razorpay
  const handlePayNow = async () => {
    if (!selectedAddress) {
      setError('Please specify a shipping destination');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setProcessingMessage('Securing Maison Commission...');

    try {
      // 1. Resolve product IDs
      const orderItems = await Promise.all(
        items.map(async (item) => {
          const pId = await resolveProductId(item);
          return {
            productId: pId,
            quantity: item.quantity || 1,
          };
        })
      );

      // 2. Create Order in backend
      const orderRes = await fetch('http://localhost:4000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          addressId: selectedAddress.id,
          items: orderItems,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create commission order');
      }

      const orderId = orderData.data.id;
      const orderNumber = orderData.data.orderNumber;
      const totalAmount = items.reduce((acc, item) => acc + (Number(item.price) * (item.quantity || 1)), 0);

      // Handle Cash On Delivery
      if (paymentMethod === 'cod') {
        setTimeout(() => {
          setIsSubmitting(false);
          if (!buyNowItem && onClearCart) onClearCart();
          setConfirmedOrder({
            orderNumber,
            paymentId: 'COD-VERIFIED-ATELIER',
            amount: totalAmount,
            items,
            shippingInfo: selectedAddress,
          });
          setCurrentStep('confirmed');
        }, 1200);
        return;
      }

      // Handle Online Payment (Razorpay)
      setProcessingMessage('Processing Payment via Razorpay...');
      const payRes = await fetch('http://localhost:4000/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      const payData = await payRes.json();
      if (!payData.success) {
        throw new Error(payData.message || 'Payment initiation failed');
      }

      const payload = payData.data;

      // Load Razorpay
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        setIsSubmitting(false); // Hide overlay while Razorpay is open

        const options = {
          key: payload.razorpayKey,
          amount: payload.amount,
          currency: payload.currency,
          name: 'Cosmic Haute Joaillerie',
          description: `Order ${orderNumber}`,
          order_id: payload.razorpayOrderId,
          handler: async function (response) {
            setIsSubmitting(true);
            setProcessingMessage('Verifying Cryptographic Signature...');

            try {
              const verifyRes = await fetch('http://localhost:4000/api/payments/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  orderId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();
              if (!verifyData.success) {
                throw new Error(verifyData.message || 'Signature verification failed');
              }

              if (!buyNowItem && onClearCart) onClearCart();

              setConfirmedOrder({
                orderNumber,
                paymentId: response.razorpay_payment_id,
                amount: totalAmount,
                items,
                shippingInfo: selectedAddress,
              });
              setCurrentStep('confirmed');
            } catch (verErr) {
              alert('Payment Verification Error: ' + verErr.message);
            } finally {
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: selectedAddress.fullName,
            email: user?.email || selectedAddress.email || 'patron@cosmic.com',
            contact: selectedAddress.phone,
          },
          theme: {
            color: '#C0C0C0',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (resp) {
          setError(resp.error.description || 'Payment transaction failed.');
          setIsSubmitting(false);
        });
        rzp.open();
      };
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && currentStep !== 'confirmed') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-white/15 rounded-2xl bg-black/80 backdrop-blur-xl p-8 text-center space-y-6">
          <div className="w-12 h-12 rounded-full border border-white/20 mx-auto flex items-center justify-center">
            ✦
          </div>
          <h2 className="text-2xl font-serif uppercase tracking-widest text-white">
            Your Bag is Empty
          </h2>
          <p className="text-xs text-[#888888] leading-relaxed">
            Select a piece from our fine jewelry atelier to experience the bespoke checkout journey.
          </p>
          <Link
            to="/#shop"
            className="inline-block px-8 py-3.5 chrome-button text-xs uppercase tracking-[0.25em] font-semibold text-black"
          >
            Explore Creations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#C0C0C0] selection:text-black pb-20">
      {/* Processing Overlay */}
      {isSubmitting && <ProcessingOverlay message={processingMessage} />}

      {/* Top Luxury Navigation Bar */}
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

          {/* Stepper indicators on mobile */}
          {currentStep !== 'confirmed' && (
            <div className="flex items-center gap-1 sm:gap-2 text-[9px] sm:text-[10px] uppercase tracking-widest text-[#707070]">
              <span className={currentStep === 'address' ? 'text-white font-medium' : ''}>01 Address</span>
              <span>•</span>
              <span className={currentStep === 'payment' ? 'text-white font-medium' : ''}>02 Payment</span>
              <span>•</span>
              <span className={currentStep === 'summary' ? 'text-white font-medium' : ''}>03 Summary</span>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#909090]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>256-Bit SSL</span>
          </div>
        </div>
      </header>

      {/* Returning User Welcome Notification (Requirement 12) */}
      {user && currentStep !== 'confirmed' && (
        <div className="border-b border-white/10 bg-white/5 px-6 py-2.5">
          <div className="max-w-4xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#C0C0C0]">
              <span>✦</span>
              <span>Welcome back, <strong className="text-white font-medium">{user.fullName || user.phone || 'Patron'}</strong></span>
            </div>
            <Link to="/#shop" className="text-[10px] uppercase tracking-wider text-[#909090] hover:text-white">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}

      {/* Main Container: Mobile First, Max-W-2xl on Desktop */}
      <main className="max-w-xl sm:max-w-2xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs leading-relaxed flex items-start gap-2">
            <span className="text-red-400">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Step 1: Mobile Address */}
        {currentStep === 'address' && (
          <MobileAddressScreen
            savedAddresses={savedAddresses}
            selectedAddress={selectedAddress}
            onSelectAddress={setSelectedAddress}
            onSaveNewAddress={handleSaveNewAddress}
            onContinueToPayment={(addr) => {
              setSelectedAddress(addr);
              setCurrentStep('payment');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            isSubmitting={isSubmitting}
            user={user}
          />
        )}

        {/* Step 2: Payment Method Selection */}
        {currentStep === 'payment' && (
          <PaymentMethodScreen
            selectedMethod={paymentMethod}
            onSelectMethod={setPaymentMethod}
            onProceedToSummary={(chosenMethod) => {
              setPaymentMethod(chosenMethod);
              setCurrentStep('summary');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBack={() => {
              setCurrentStep('address');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Step 3: Order Summary Review */}
        {currentStep === 'summary' && (
          <OrderSummaryScreen
            items={items}
            address={selectedAddress}
            paymentMethod={paymentMethod}
            onEditAddress={() => {
              setCurrentStep('address');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onEditPayment={() => {
              setCurrentStep('payment');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPayNow={handlePayNow}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Step 4: Order Confirmed */}
        {currentStep === 'confirmed' && confirmedOrder && (
          <LuxuryConfirmation
            orderNumber={confirmedOrder.orderNumber}
            paymentId={confirmedOrder.paymentId}
            amount={confirmedOrder.amount}
            items={confirmedOrder.items}
            shippingInfo={confirmedOrder.shippingInfo}
            onContinueShopping={() => navigate('/#shop')}
          />
        )}
      </main>
    </div>
  );
}
