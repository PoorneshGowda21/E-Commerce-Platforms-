import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Customer endpoints
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);

// Admin-specific endpoints
router.get('/stats/dashboard', protect, adminOnly, getDashboardStats);
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

// Order detail endpoint
router.get('/:id', protect, getOrderById);

export default router;

