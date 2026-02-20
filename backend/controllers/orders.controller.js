const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod = 'pending' } = req.body;

        // Validation
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items provided' });
        }

        if (!shippingAddress) {
            return res.status(400).json({ message: 'Shipping address is required' });
        }

        // Process order items and calculate total
        let orderItems = [];
        let totalAmount = 0;

        for (let item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(400).json({
                    message: `Product with ID ${item.product} not found`
                });
            }

            if (!product.isActive) {
                return res.status(400).json({
                    message: `Product ${product.name} is no longer available`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
                });
            }

            // Use the product's current price (or final price if there's a discount)
            const itemPrice = product.finalPrice || product.price;
            const itemTotal = itemPrice * item.quantity;

            orderItems.push({
                product: product._id,
                name: product.name,
                image: product.image,
                quantity: item.quantity,
                price: itemPrice
            });

            totalAmount += itemTotal;

            // Update product stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Create order
        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod,
            status: 'pending'
        });

        // Populate order with user and product details
        const populatedOrder = await Order.findById(order._id)
            .populate('user', 'name email')
            .populate('items.product', 'name image category');

        res.status(201).json({
            message: 'Order created successfully',
            order: populatedOrder
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error creating order',
            error: error.message
        });
    }
});

// @desc    Get user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        // Build query
        let query = { user: req.user._id };
        if (status) {
            query.status = status;
        }

        // Pagination
        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);
        const skip = (pageNumber - 1) * pageSize;

        const orders = await Order.find(query)
            .populate('items.product', 'name image category')
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(skip);

        const totalOrders = await Order.countDocuments(query);
        const totalPages = Math.ceil(totalOrders / pageSize);

        res.json({
            orders,
            currentPage: pageNumber,
            totalPages,
            totalOrders,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error fetching orders',
            error: error.message
        });
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email')
            .populate('items.product', 'name image category brand');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user owns this order or is admin
        if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.json(order);

    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(500).json({
            message: 'Error fetching order',
            error: error.message
        });
    }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
    try {
        const { status } = req.body;

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`
            });
        }

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Handle stock restoration if order is cancelled
        if (status === 'cancelled' && order.status !== 'cancelled') {
            for (let item of order.items) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                }
            }
        }

        order.status = status;
        if (status === 'delivered') {
            order.deliveredAt = new Date();
        }

        const updatedOrder = await order.save();

        res.json({
            message: 'Order status updated successfully',
            order: updatedOrder
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error updating order status',
            error: error.message
        });
    }
});

// @desc    Mark order as paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const markOrderPaid = asyncHandler(async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user owns this order
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this order' });
        }

        order.isPaid = true;
        order.paidAt = new Date();
        order.status = 'processing';
        order.paymentResult = {
            id: req.body.id || 'manual_payment',
            status: 'paid',
            update_time: new Date(),
            email_address: req.user.email
        };

        const updatedOrder = await order.save();

        res.json({
            message: 'Order marked as paid successfully',
            order: updatedOrder
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error updating payment status',
            error: error.message
        });
    }
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 10, status, userId } = req.query;

        // Build query
        let query = {};
        if (status) {
            query.status = status;
        }
        if (userId) {
            query.user = userId;
        }

        // Pagination
        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);
        const skip = (pageNumber - 1) * pageSize;

        const orders = await Order.find(query)
            .populate('user', 'name email')
            .populate('items.product', 'name image category')
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(skip);

        const totalOrders = await Order.countDocuments(query);
        const totalPages = Math.ceil(totalOrders / pageSize);

        // Calculate statistics
        const stats = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 },
                    pendingOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    },
                    completedOrders: {
                        $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
                    }
                }
            }
        ]);

        res.json({
            orders,
            currentPage: pageNumber,
            totalPages,
            totalOrders,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1,
            stats: stats[0] || {
                totalRevenue: 0,
                totalOrders: 0,
                pendingOrders: 0,
                completedOrders: 0
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error fetching orders',
            error: error.message
        });
    }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user owns this order or is admin
        if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized to cancel this order' });
        }

        if (order.status === 'delivered') {
            return res.status(400).json({ message: 'Cannot cancel delivered orders' });
        }

        if (order.status === 'cancelled') {
            return res.status(400).json({ message: 'Order is already cancelled' });
        }

        // Restore stock for all items
        for (let item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        order.status = 'cancelled';
        order.cancelledAt = new Date();

        const updatedOrder = await order.save();

        res.json({
            message: 'Order cancelled successfully',
            order: updatedOrder
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error cancelling order',
            error: error.message
        });
    }
});

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    markOrderPaid,
    getAllOrders,
    cancelOrder
};








