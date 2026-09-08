import React, { useState, useEffect } from 'react';

const PaymentTestPage = () => {
  const [status, setStatus] = useState('idle'); // idle | processing | success | error
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, []);

  const handleQuickLogin = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@cosmic.com',
          password: 'password123',
        }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        alert('Logged in as test user!');
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (err) {
      alert('Quick Login Failed: ' + err.message);
    }
  };

  const handleTestPayment = async () => {
    if (!token) {
      setErrorMessage('You must be logged in to test payments.');
      setStatus('error');
      return;
    }

    setStatus('processing');
    setErrorMessage('');
    setPaymentDetails(null);

    // Debugging logs for authentication flow
    console.log('--- Payment Request Debug ---');
    console.log('Token exists:', !!token);
    console.log('Token length:', token ? token.length : 0);
    console.log('Authorization Header:', token ? 'Bearer ' + token.substring(0, 10) + '...' : 'NONE');
    console.log('-----------------------------');

    try {
      const orderId = prompt("Please enter a valid Order ID from your database:");
      if (!orderId) {
        throw new Error("Order ID is required for testing.");
      }

      const response = await fetch('http://localhost:4000/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to create Razorpay order");
      }

      const { data: payload } = data;

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
          description: "Test Payment for Order " + payload.orderId,
          order_id: payload.razorpayOrderId,
          handler: async function (response) {
            try {
              setStatus('processing');

              const verifyResponse = await fetch('http://localhost:4000/api/payments/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                  orderId: payload.orderId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyResponse.json();
              if (!verifyData.success) {
                throw new Error(verifyData.error || "Payment verification failed");
              }

              setPaymentDetails({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              });
              setStatus('success');
            } catch (err) {
              setErrorMessage(err.message);
              setStatus('error');
            }
          },
          prefill: {
            name: "Test User",
            email: "test@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#C0C0C0",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch (err) {
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-aileron">
      <div className="max-w-md w-full bg-[#0a0a0a] border border-white/10 p-8 shadow-2xl text-center space-y-8">
        <div className="relative">
          <h1 className="text-2xl uppercase tracking-[0.3em] chrome-gradient-text mb-2">Payment Lab</h1>
          <p className="text-xs text-[#888888] uppercase tracking-widest">Integration Testing Suite</p>

          {!token && (
            <button
              onClick={handleQuickLogin}
              className="absolute -top-2 -right-2 bg-red-600 text-white text-[8px] px-2 py-1 rounded-full uppercase font-bold hover:bg-red-500 transition-colors cursor-pointer"
            >
              Quick Login
            </button>
          )}
        </div>

        <div className="py-8 px-4 border-y border-white/5 space-y-6">
          {status === 'idle' && (
            <div className="space-y-4">
              {!token && (
                <p className="text-red-400 text-[10px] uppercase tracking-widest animate-pulse">
                  ⚠️ You are not logged in. Please use Quick Login.
                </p>
              )}
              <button
                onClick={handleTestPayment}
                disabled={!token}
                className={`w-full py-4 text-xs uppercase tracking-[0.25em] font-semibold text-center transition-all ${
                  token
                  ? "chrome-button cursor-pointer"
                  : "bg-[#222222] text-[#666666] cursor-not-allowed"
                }`}
              >
                Initiate Test Payment
              </button>
            </div>
          )}

          {status === 'processing' && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span className="text-xs uppercase tracking-widest text-[#A0A0A0]">Processing Transaction...</span>
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-400 text-xs uppercase tracking-widest">
              {errorMessage}
              <button
                onClick={() => setStatus('idle')}
                className="block w-full mt-4 text-white underline underline-offset-4"
              >
                Try Again
              </button>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-emerald-400 text-sm uppercase tracking-[0.2em] font-bold">
                ✓ Transaction Verified
              </div>
              <div className="text-left space-y-3 text-xs font-mono p-4 bg-black border border-white/10">
                <div className="flex justify-between">
                  <span className="text-[#666666]">Payment ID:</span>
                  <span className="text-white">{paymentDetails?.paymentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Order ID:</span>
                  <span className="text-white">{paymentDetails?.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#666666]">Status:</span>
                  <span className="text-emerald-400 uppercase">Paid</span>
                </div>
              </div>
              <button
                onClick={() => setStatus('idle')}
                className="w-full py-3 border border-white/20 text-xs uppercase tracking-widest text-[#C0C0C0] hover:text-white transition-colors cursor-pointer"
              >
                Run Another Test
              </button>
            </div>
          )}
        </div>

        <div className="text-[10px] uppercase tracking-widest text-[#444444]">
          Local Dev Mode Only • Razorpay Test Environment
        </div>
      </div>
    </div>
  );
};

export default PaymentTestPage;
