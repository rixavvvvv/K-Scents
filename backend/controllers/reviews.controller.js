// backend/controller/reviews.controller.js
const Product = require('../models/Product');
const Order = require('../models/Order');
const asyncHandler = require('express-async-handler');

// @desc    Add a review to a product
// @route   POST /api/products/:id/reviews
// @access  Private
const addReview = asyncHandler(async (req, res) => {
    try {
        const { rating, comment } = req.body;
        if (!rating || !comment) {
            return res.status(400).json({ message: 'Rating and comment are required' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Check if user has purchased this product
        const hasPurchased = await Order.findOne({
            user: req.user._id,
            'items.product': product._id,
            status: 'delivered'
        });

        const existingReview = product.reviews.find(
            r => r.user.toString() === req.user._id.toString()
        );
        if (existingReview) {
            existingReview.rating = rating;
            existingReview.comment = comment;
            existingReview.verified = !!hasPurchased;
        } else {
            product.reviews.push({
                user: req.user._id,
                name: req.user.name,
                rating,
                comment,
                verified: !!hasPurchased
            });
        }

        product.calculateAverageRating();
        await product.save();

        res.status(201).json({ message: 'Review added', rating: product.rating, numReviews: product.numReviews });
    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error: error.message });
    }
});

// @desc    Get reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).select('reviews rating numReviews');
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const { page = 1, limit = 10 } = req.query;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const reviews = product.reviews
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(startIndex, endIndex);

        res.json({
            reviews,
            rating: product.rating,
            numReviews: product.numReviews,
            currentPage: parseInt(page),
            totalPages: Math.ceil(product.reviews.length / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
});

// @desc    Delete a review (Admin or review owner)
// @route   DELETE /api/products/:id/reviews/:reviewId
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const review = product.reviews.id(req.params.reviewId);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        if (review.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        product.reviews.pull(req.params.reviewId);
        product.calculateAverageRating();
        await product.save();

        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
});

module.exports = { addReview, getProductReviews, deleteReview };
