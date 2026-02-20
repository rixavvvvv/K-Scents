// backend/models/Product.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  description: {
    type: String,
    required: true,
    maxLength: 1000
  },
  shortDescription: {
    type: String,
    maxLength: 200
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  finalPrice: {
    type: Number,
    min: 0
  },
  discount_percentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['perfumes', 'candles', 'diffusers', 'soaps', 'gift-sets', 'accessories']
  },
  subCategory: {
    type: String,
    enum: ['eau-de-parfum', 'eau-de-toilette', 'cologne', 'scented-candles', 'pillar-candles', 'tea-lights', 'reed-diffusers', 'electric-diffusers', 'bath-soap', 'hand-soap', 'luxury-sets', 'travel-sets']
  },
  brand: {
    type: String,
    default: 'K-Scents'
  },
  image: {
    type: String,
    required: true,
    default: 'https://via.placeholder.com/400x400?text=No+Image'
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 5
  },
  size: {
    volume: Number, // in ml
    weight: Number, // in grams
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    }
  },
  fragrance_notes: {
    top: [String], // Top notes
    middle: [String], // Heart/middle notes
    base: [String] // Base notes
  },
  intensity: {
    type: String,
    enum: ['light', 'moderate', 'strong', 'intense'],
    default: 'moderate'
  },
  longevity: {
    type: String,
    enum: ['2-4 hours', '4-6 hours', '6-8 hours', '8+ hours'],
    default: '4-6 hours'
  },
  sillage: {
    type: String,
    enum: ['intimate', 'moderate', 'strong', 'enormous'],
    default: 'moderate'
  },
  season: [{
    type: String,
    enum: ['spring', 'summer', 'autumn', 'winter']
  }],
  occasion: [{
    type: String,
    enum: ['casual', 'office', 'evening', 'special', 'date-night', 'party']
  }],
  gender: {
    type: String,
    enum: ['unisex', 'men', 'women'],
    default: 'unisex'
  },
  ingredients: [String],
  careInstructions: String,
  burnTime: Number, // for candles, in hours
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  saleStartDate: Date,
  saleEndDate: Date,
  tags: [String],
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  barcode: String,
  reviews: [reviewSchema],
  numReviews: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  views: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],
    slug: {
      type: String,
      unique: true,
      sparse: true
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  deletedAt: Date
}, {
  timestamps: true
});

// Create indexes for better performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text', 'fragrance_notes.top': 'text', 'fragrance_notes.middle': 'text', 'fragrance_notes.base': 'text' });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
// seo.slug already indexed via unique:true in schema

// Virtual for determining if product is low in stock
productSchema.virtual('isLowStock').get(function () {
  return this.stock <= this.lowStockThreshold;
});

// Virtual for determining if product is currently on sale
productSchema.virtual('isCurrentlyOnSale').get(function () {
  if (!this.isOnSale) return false;
  const now = new Date();
  if (this.saleStartDate && now < this.saleStartDate) return false;
  if (this.saleEndDate && now > this.saleEndDate) return false;
  return true;
});

// Pre-save middleware to calculate finalPrice
productSchema.pre('save', function (next) {
  if (this.discount_percentage > 0) {
    this.finalPrice = this.price * (1 - this.discount_percentage / 100);
  } else {
    this.finalPrice = this.price;
  }

  // Generate SKU if not provided
  if (!this.sku) {
    const categoryCode = this.category.substring(0, 3).toUpperCase();
    const randomNum = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.sku = `${categoryCode}-${randomNum}`;
  }

  // Generate slug if not provided
  if (!this.seo?.slug) {
    const slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim('-'); // Remove leading/trailing hyphens

    if (!this.seo) this.seo = {};
    this.seo.slug = `${slug}-${this._id}`;
  }

  next();
});

// Method to calculate average rating
productSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
    return;
  }

  const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.rating = Math.round((totalRating / this.reviews.length) * 10) / 10; // Round to 1 decimal
  this.numReviews = this.reviews.length;
};

// Method to add a review
productSchema.methods.addReview = function (userId, userName, rating, comment) {
  // Check if user already reviewed this product
  const existingReview = this.reviews.find(review => review.user.toString() === userId.toString());

  if (existingReview) {
    // Update existing review
    existingReview.rating = rating;
    existingReview.comment = comment;
  } else {
    // Add new review
    this.reviews.push({
      user: userId,
      name: userName,
      rating,
      comment
    });
  }

  this.calculateAverageRating();
  return this.save();
};

// Static method to get featured products
productSchema.statics.getFeaturedProducts = function (limit = 8) {
  return this.find({
    isFeatured: true,
    isActive: true
  })
    .sort({ rating: -1, createdAt: -1 })
    .limit(limit);
};

// Static method to get products by category
productSchema.statics.getByCategory = function (category, limit = 10) {
  return this.find({
    category: category.toLowerCase(),
    isActive: true
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method for advanced search
productSchema.statics.advancedSearch = function (searchParams) {
  const {
    search,
    category,
    subCategory,
    minPrice,
    maxPrice,
    brand,
    gender,
    intensity,
    season,
    occasion,
    rating,
    inStock
  } = searchParams;

  let query = { isActive: true };

  if (search) {
    query.$text = { $search: search };
  }

  if (category) query.category = category;
  if (subCategory) query.subCategory = subCategory;
  if (brand) query.brand = { $regex: brand, $options: 'i' };
  if (gender) query.gender = gender;
  if (intensity) query.intensity = intensity;
  if (season) query.season = { $in: [season] };
  if (occasion) query.occasion = { $in: [occasion] };
  if (rating) query.rating = { $gte: rating };
  if (inStock) query.stock = { $gt: 0 };

  if (minPrice || maxPrice) {
    query.finalPrice = {};
    if (minPrice) query.finalPrice.$gte = minPrice;
    if (maxPrice) query.finalPrice.$lte = maxPrice;
  }

  return this.find(query);
};

module.exports = mongoose.model('Product', productSchema);