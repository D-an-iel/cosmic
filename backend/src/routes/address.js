import express from 'express';
import addressController from '../controllers/addressController.js';
import { addressValidator } from '../validators/addressValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All address routes are protected
router.use(protect);

router.post('/', addressValidator.validate, addressController.create);
router.get('/', addressController.getAll);
router.get('/:id', addressController.getOne);
router.put('/:id', addressValidator.validateUpdate, addressController.update);
router.delete('/:id', addressController.delete);

export default router;
