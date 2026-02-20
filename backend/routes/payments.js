// backend/routes/payments.js

const express = require('express');
const { protect } = require('../middleware/auth');
const Payment = require('../models/Payment');
const Order = require('../models/Order');

const router = express.Router();

// Validate Stripe secret key early with a clear error
if (!process.env.STRIPE_SECRET_KEY) {
  // Throwing during module load fails fast and makes the issue obvious
  throw new Error('Missing STRIPE_SECRET_KEY in environment. Please set it in .env');
}

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

console.log("Stripe Key in payments.js:", process.env.STRIPE_SECRET_KEY ? "Loaded ✅" : "Not Loaded ❌");

// @desc    Get Stripe publishable key
// @route   GET /api/payments/config
// @access  Public
router.get('/config', (req, res) => {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    return res.status(500).json({ message: 'Missing STRIPE_PUBLISHABLE_KEY in environment. Please set it in .env' });
  }
  res.json({ publishableKey });
});

// @desc    Create payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
router.post('/create-payment-intent', protect, async (req, res) => {
  try {
    const { orderId } = req.body;

    // Get order details
    const order = await Order.findById(orderId).populate('user');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Convert to cents
      currency: 'inr',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString()
      }
    });

    // Create payment record
    await Payment.create({
      order: order._id,
      user: req.user._id,
      stripePaymentIntentId: paymentIntent.id,
      amount: order.totalAmount,
      currency: 'inr'
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Payment Intent Error:', error);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
});

// @desc    Confirm payment
// @route   POST /api/payments/confirm
// @access  Private
router.post('/confirm', protect, async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update payment status
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntentId },
        {
          status: 'succeeded',
          paymentMethod: paymentIntent.payment_method_types[0],
          receiptUrl: paymentIntent.charges.data[0]?.receipt_url
        }
      );

      // Update order status
      await Order.findOneAndUpdate(
        { _id: paymentIntent.metadata.orderId },
        { status: 'processing' }
      );

      res.json({ message: 'Payment confirmed successfully' });
    } else {
      res.status(400).json({ message: 'Payment not completed' });
    }

  } catch (error) {
    console.error('Payment Confirmation Error:', error);
    res.status(500).json({ message: 'Error confirming payment' });
  }
});

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('order')
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;