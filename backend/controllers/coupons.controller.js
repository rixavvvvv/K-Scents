// backend/controller/coupons.controller.js
const Coupon = require('../models/Coupon');
const asyncHandler = require('express-async-handler');

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = asyncHandler(async (req, res) => {
    try {
        const { code, orderAmount } = req.body;
        if (!code) return res.status(400).json({ message: 'Coupon code is required' });

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
        if (!coupon.isValid) return res.status(400).json({ message: 'This coupon has expired or is no longer active' });
        if (!coupon.canBeUsedBy(req.user._id)) return res.status(400).json({ message: 'You have already used this coupon' });
        if (orderAmount < coupon.minOrderAmount) {
            return res.status(400).json({ message: `Minimum order amount of ₹${coupon.minOrderAmount} required` });
        }

        const discount = coupon.calculateDiscount(orderAmount);

        res.json({
            valid: true,
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            discount,
            description: coupon.description
        });
    } catch (error) {
        res.status(500).json({ message: 'Error validating coupon', error: error.message });
    }
});

// @desc    Create a coupon (Admin)
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
    try {
        const coupon = await Coupon.create({ ...req.body, createdBy: req.user._id });
        res.status(201).json({ message: 'Coupon created successfully', coupon });
    } catch (error) {
        res.status(500).json({ message: 'Error creating coupon', error: error.message });
    }
});

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Private/Admin
const getAllCoupons = asyncHandler(async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching coupons', error: error.message });
    }
});

// @desc    Update coupon (Admin)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = asyncHandler(async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.json({ message: 'Coupon updated', coupon });
    } catch (error) {
        res.status(500).json({ message: 'Error updating coupon', error: error.message });
    }
});

// @desc    Delete coupon (Admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.json({ message: 'Coupon deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting coupon', error: error.message });
    }
});

module.exports = { validateCoupon, createCoupon, getAllCoupons, updateCoupon, deleteCoupon };
