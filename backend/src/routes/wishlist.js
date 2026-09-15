import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import wishlistController from '../controllers/wishlistController.js';

const router = express.Router();

router.use(protect); // All wishlist routes require authentication

router.post('/', wishlistController.add);
router.get('/', wishlistController.get);
router.delete('/:productId', wishlistController.remove);

export default router;
