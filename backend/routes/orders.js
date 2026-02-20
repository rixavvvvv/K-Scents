// backend/routes/orders.js
const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  markOrderPaid,
  getAllOrders,
  cancelOrder
} = require('../controllers/orders.controller');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Private routes (authenticated users)
router.post('/', protect, createOrder);                    // POST /api/orders
router.get('/myorders', protect, getMyOrders);             // GET /api/orders/myorders
router.get('/:id', protect, getOrderById);                 // GET /api/orders/:id
router.put('/:id/pay', protect, markOrderPaid);            // PUT /api/orders/:id/pay
router.put('/:id/cancel', protect, cancelOrder);           // PUT /api/orders/:id/cancel

// Admin routes
router.get('/', protect, admin, getAllOrders);             // GET /api/orders (admin only)
router.put('/:id/status', protect, admin, updateOrderStatus); // PUT /api/orders/:id/status

module.exports = router; 