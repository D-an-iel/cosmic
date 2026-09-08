import express from 'express';
import authController from '../controllers/authController.js';
import { authValidator } from '../validators/authValidator.js';
import { protect } from '../middleware/authMiddleware.js';
import { otpLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes
router.post('/register', authValidator.register, authController.register);
router.post('/login', authValidator.login, authController.login);
router.post('/send-otp', otpLimiter, authController.sendOtp);
router.post('/verify-otp', otpLimiter, authController.verifyOtp);

// Protected routes
router.get('/me', protect, authController.getMe);

export default router;
