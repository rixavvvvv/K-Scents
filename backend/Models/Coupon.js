// backend/models/Coupon.js
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0
    },
    minOrderAmount: {
        type: Number,
        default: 0,
        min: 0
    },
    maxDiscountAmount: {
        type: Number,
        default: null
    },
    usageLimit: {
        type: Number,
        default: null
    },
    usedCount: {
        type: Number,
        default: 0
    },
    perUserLimit: {
        type: Number,
        default: 1
    },
    usedBy: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        usedAt: { type: Date, default: Date.now },
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }
    }],
    validFrom: {
        type: Date,
        required: true,
        default: Date.now
    },
    validUntil: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    applicableCategories: [{
        type: String,
        enum: ['perfumes', 'candles', 'diffusers', 'soaps', 'gift-sets', 'accessories']
    }],
    applicableProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// code already indexed via unique:true in schema
couponSchema.index({ validFrom: 1, validUntil: 1 });

couponSchema.virtual('isValid').get(function () {
    const now = new Date();
    return this.isActive &&
        now >= this.validFrom &&
        now <= this.validUntil &&
        (this.usageLimit === null || this.usedCount < this.usageLimit);
});

couponSchema.methods.calculateDiscount = function (orderAmount) {
    if (!this.isValid) return 0;
    if (orderAmount < this.minOrderAmount) return 0;

    let discount = 0;
    if (this.discountType === 'percentage') {
        discount = (orderAmount * this.discountValue) / 100;
        if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
            discount = this.maxDiscountAmount;
        }
    } else {
        discount = this.discountValue;
    }

    return Math.min(discount, orderAmount);
};

couponSchema.methods.canBeUsedBy = function (userId) {
    if (!this.isValid) return false;
    const userUsageCount = this.usedBy.filter(
        u => u.user.toString() === userId.toString()
    ).length;
    return userUsageCount < this.perUserLimit;
};

module.exports = mongoose.model('Coupon', couponSchema);
