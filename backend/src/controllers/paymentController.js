import paymentService from '../services/paymentService.js';

class PaymentController {
  async createOrder(req, res, next) {
    try {
      const { orderId } = req.body;
      if (!orderId) {
        const error = new Error('Order ID is required');
        error.status = 400;
        throw error;
      }

      const result = await paymentService.createPaymentOrder(orderId, req.user.id);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyPayment(req, res, next) {
    try {
      const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        const error = new Error('Missing required payment verification fields');
        error.status = 400;
        throw error;
      }

      await paymentService.verifyPayment({
        orderId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getPayment(req, res, next) {
    try {
      const { orderId } = req.params;
      const payment = await paymentService.getPaymentDetails(orderId, req.user.id);
      res.status(200).json({
        success: true,
        data: payment,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PaymentController();
