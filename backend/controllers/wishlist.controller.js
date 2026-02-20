// backend/controller/wishlist.controller.js
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate({
            path: 'wishlist',
            select: 'name price finalPrice image category rating numReviews stock discount_percentage'
        });
        res.json(user.wishlist || []);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
    }
});

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user.wishlist.includes(req.params.productId)) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }
        user.wishlist.push(req.params.productId);
        await user.save();
        res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
    }
});

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.productId);
        await user.save();
        res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
    }
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
