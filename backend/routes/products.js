// backend/routes/products.js
const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getFeaturedProducts,
  updateProductStock
} = require('../controllers/products.controller');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getProducts);                    // GET /api/products
router.get('/featured', getFeaturedProducts);    // GET /api/products/featured
router.get('/category/:category', getProductsByCategory); // GET /api/products/category/:category
router.get('/:id', getProductById);             // GET /api/products/:id

// Admin routes
router.post('/', protect, admin, createProduct);           // POST /api/products
router.put('/:id', protect, admin, updateProduct);         // PUT /api/products/:id
router.delete('/:id', protect, admin, deleteProduct);      // DELETE /api/products/:id
router.patch('/:id/stock', protect, admin, updateProductStock); // PATCH /api/products/:id/stock

module.exports = router;