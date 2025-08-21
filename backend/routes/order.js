// backend/routes/orders.js
const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/', protect, async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;

        // Calculate total and validate items
        let totalAmount = 0;
        for (let item of items) {
            const product = await Product.findById(item.product);
            if (!product || product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}`
                });
            }
            totalAmount += product.price * item.quantity;

            // Update stock
            product.stock -= item.quantity;
            await product.save();
        }

        const order = new Order({
            user: req.user._id,
            items: items.map(item => ({
                product: item.product,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount,
            shippingAddress
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user orders
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'name image price');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all orders (Admin only)
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('items.product', 'name image price');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update order status (Admin only)
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;