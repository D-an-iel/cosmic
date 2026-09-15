import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import adminController from '../controllers/adminController.js';

const router = express.Router();

// Test route
router.get('/test', protect, isAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin access granted',
    user: req.user,
  });
});

// Telemetry & Metrics
router.get('/metrics', protect, isAdmin, adminController.getMetrics);

// Order Management
router.get('/orders', protect, isAdmin, adminController.getOrders);
router.get('/orders/:id', protect, isAdmin, adminController.getOrderById);
router.patch('/orders/:id/status', protect, isAdmin, adminController.updateOrderStatus);
router.patch('/orders/:id/tracking', protect, isAdmin, adminController.updateOrderTracking);

// Catalog & Inventory Vault
router.get('/products', protect, isAdmin, adminController.getProducts);
router.patch('/products/:id/stock', protect, isAdmin, adminController.updateProductStock);
router.put('/products/:id', protect, isAdmin, adminController.updateProduct);

// Customer & VIP Directory
router.get('/customers', protect, isAdmin, adminController.getCustomers);
router.get('/customers/:id', protect, isAdmin, adminController.getCustomerById);

export default router;
