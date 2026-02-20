// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'United States'
    }
  },
  paymentMethod: {
    type: String,
    enum: ['pending', 'credit_card', 'debit_card', 'paypal', 'stripe', 'cash_on_delivery'],
    default: 'pending'
  },
  paymentResult: {
    id: String,
    status: String,
    update_time: Date,
    email_address: String
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: Date,
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: Date,
  cancelledAt: Date,
  orderNotes: String,
  trackingNumber: String,
  shippingCost: {
    type: Number,
    default: 0,
    min: 0
  },
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  couponCode: String
}, {
  timestamps: true
});

// Indexes for better performance
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ trackingNumber: 1 });
orderSchema.index({ isPaid: 1 });
orderSchema.index({ createdAt: -1 });

// Virtual for calculating subtotal (before shipping and tax)
orderSchema.virtual('subtotal').get(function () {
  return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

// Virtual for total items count
orderSchema.virtual('totalItems').get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for checking if order can be cancelled
orderSchema.virtual('canBeCancelled').get(function () {
  return ['pending', 'processing'].includes(this.status);
});

// Pre-save middleware to calculate total amount
orderSchema.pre('save', function (next) {
  const subtotal = this.subtotal;
  this.totalAmount = subtotal + this.shippingCost + this.taxAmount - this.discountAmount;

  // Automatically mark as delivered when status is set to delivered
  if (this.status === 'delivered' && !this.deliveredAt) {
    this.deliveredAt = new Date();
    this.isDelivered = true;
  }

  next();
});

// Method to add tracking number
orderSchema.methods.addTrackingNumber = function (trackingNumber) {
  this.trackingNumber = trackingNumber;
  if (this.status === 'processing') {
    this.status = 'shipped';
  }
  return this.save();
};

// Method to cancel order
orderSchema.methods.cancelOrder = function (reason) {
  if (!this.canBeCancelled) {
    throw new Error('Order cannot be cancelled');
  }

  this.status = 'cancelled';
  this.cancelledAt = new Date();
  if (reason) {
    this.orderNotes = `Cancelled: ${reason}`;
  }

  return this.save();
};

// Static method to get orders by status
orderSchema.statics.getByStatus = function (status, limit = 10) {
  return this.find({ status })
    .populate('user', 'name email')
    .populate('items.product', 'name image')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get revenue statistics
orderSchema.statics.getRevenueStats = async function () {
  const stats = await this.aggregate([
    {
      $match: { status: { $ne: 'cancelled' }, isPaid: true }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        totalOrders: { $sum: 1 },
        averageOrderValue: { $avg: '$totalAmount' }
      }
    }
  ]);

  return stats[0] || { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0 };
};

// Static method to get monthly sales data
orderSchema.statics.getMonthlySales = function (year = new Date().getFullYear()) {
  return this.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lt: new Date(`${year + 1}-01-01`)
        },
        status: { $ne: 'cancelled' },
        isPaid: true
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        totalSales: { $sum: '$totalAmount' },
        orderCount: { $sum: 1 }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ]);
};

module.exports = mongoose.model('Order', orderSchema);