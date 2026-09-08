import express from 'express';
import { authentication, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Example protected route
router.get('/profile', authentication, authorize(['user']), (req, res) => {
  res.json({ user: req.user });
});

export default router;
