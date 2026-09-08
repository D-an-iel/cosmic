import express from 'express';
import orderController from '../controllers/orderController.js';
import { orderValidator } from '../validators/orderValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All order routes are protected
router.use(protect);

router.post('/', orderValidator.validateCreate, orderController.create);
router.get('/', orderController.getAll);
router.get('/:id', orderController.getOne);
router.patch('/:id/cancel', orderController.cancel);

export default router;
