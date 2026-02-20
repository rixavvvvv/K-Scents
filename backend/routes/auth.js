// backend/routes/auth.js
const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  getAllUsers
} = require('../controllers/auth.controller');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', registerUser);          // POST /api/auth/register
router.post('/login', loginUser);                // POST /api/auth/login

// Private routes
router.get('/profile', protect, getUserProfile);           // GET /api/auth/profile
router.put('/profile', protect, updateUserProfile);        // PUT /api/auth/profile
router.put('/change-password', protect, changePassword);   // PUT /api/auth/change-password

// Address management
router.post('/addresses', protect, addAddress);            // POST /api/auth/addresses
router.put('/addresses/:addressId', protect, updateAddress); // PUT /api/auth/addresses/:addressId
router.delete('/addresses/:addressId', protect, deleteAddress); // DELETE /api/auth/addresses/:addressId

// Admin routes
router.get('/users', protect, admin, getAllUsers);         // GET /api/auth/users

module.exports = router;