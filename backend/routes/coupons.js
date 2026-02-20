// backend/routes/coupons.js
const express = require('express');
const { validateCoupon, createCoupon, getAllCoupons, updateCoupon, deleteCoupon } = require('../controllers/coupons.controller');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.post('/validate', protect, validateCoupon);
router.get('/', protect, admin, getAllCoupons);
router.post('/', protect, admin, createCoupon);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

module.exports = router;
