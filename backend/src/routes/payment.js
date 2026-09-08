import express from 'express';
import paymentController from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All payment routes require authentication
router.use(protect);

router.post('/create-order', paymentController.createOrder);
router.post('/verify', paymentController.verifyPayment);
router.get('/:orderId', paymentController.getPayment);

export default router;
