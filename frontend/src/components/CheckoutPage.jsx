import React from 'react';
import LuxuryCheckout from './luxury-flow/LuxuryCheckout';

export default function CheckoutPage({ cart, onClearCart }) {
  return <LuxuryCheckout cart={cart} onClearCart={onClearCart} />;
}