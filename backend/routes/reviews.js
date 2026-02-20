// backend/routes/reviews.js
const express = require('express');
const { addReview, getProductReviews, deleteReview } = require('../controllers/reviews.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', protect, addReview);
router.delete('/:id/reviews/:reviewId', protect, deleteReview);

module.exports = router;
