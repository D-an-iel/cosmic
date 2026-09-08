import Razorpay from 'razorpay';
import crypto from 'crypto';
import prisma from '../db.js';
import paymentRepository from '../repositories/paymentRepository.js';
import orderRepository from '../repositories/orderRepository.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder',
});

class PaymentService {
  async createPaymentOrder(orderId, userId) {
    // 1. Validate Order Existence and Ownership
    const order = await orderRepository.findOrderByIdAndUser(orderId, userId);
    if (!order) {
      throw new Error('Order not found or unauthorized');
    }

    // 2. Validate Order is not already paid
    if (order.paymentStatus === 'PAID') {
      throw new Error('Order is already paid');
    }

    // 3. Convert amount to paise (1 INR = 100 Paise)
    const amountInPaise = Math.round(Number(order.total) * 100);

    // 4. Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: order.orderNumber,
    });

    // 5. Create or Update Payment Record in Database
    const existingPayment = await paymentRepository.findByOrderId(order.id);

    if (existingPayment) {
      await paymentRepository.updatePayment(order.id, {
        razorpayOrderId: razorpayOrder['id'],
        status: 'PENDING',
      });
    } else {
      await paymentRepository.createPayment({
        orderId: order.id,
        razorpayOrderId: razorpayOrder['id'],
        amount: order.total,
        status: 'PENDING',
      });
    }

    return {
      success: true,
      orderId: order.id,
      razorpayOrderId: razorpayOrder['id'],
      amount: amountInPaise,
      currency: 'INR',
      razorpayKey: process.env.RAZORPAY_KEY_ID,
    };
  }

  async verifyPayment({ orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    // 1. Verify Signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      const error = new Error('Invalid payment signature');
      error.status = 400;
      throw error;
    }

    // 2. Atomic update of Payment and Order status
    return await prisma.$transaction(async (tx) => {
      // Update Payment record
      const payment = await tx.payment.update({
        where: { orderId },
        data: {
          razorpayPaymentId: razorpay_payment_id,
          status: 'PAID',
        },
      });

      // Update Order record
      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'PAID',
          status: 'PROCESSING', // Optional: move to processing when paid
        },
      });

      return payment;
    });
  }

  async getPaymentDetails(orderId, userId) {
    // Validate order ownership first
    const order = await orderRepository.findOrderByIdAndUser(orderId, userId);
    if (!order) {
      throw new Error('Order not found or unauthorized');
    }

    const payment = await paymentRepository.findByOrderId(orderId);
    if (!payment) {
      throw new Error('No payment record found for this order');
    }

    return payment;
  }
}

export default new PaymentService();
