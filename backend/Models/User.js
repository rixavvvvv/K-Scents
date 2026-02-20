// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['home', 'work', 'billing', 'shipping', 'other'],
    default: 'home'
  },
  street: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: 'United States'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // Don't include password by default in queries
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  profile: {
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    avatar: {
      type: String,
      default: function () {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=random&color=fff&size=200`;
      }
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say']
    },
    phoneNumber: {
      type: String,
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    bio: {
      type: String,
      maxLength: 500
    }
  },
  preferences: {
    newsletter: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    favoriteCategories: [{
      type: String,
      enum: ['perfumes', 'candles', 'diffusers', 'soaps', 'gift-sets', 'accessories']
    }],
    fragrancePreferences: {
      intensity: {
        type: String,
        enum: ['light', 'moderate', 'strong', 'intense']  
      },
      preferredNotes: [String],
      seasons: [{
        type: String,
        enum: ['spring', 'summer', 'autumn', 'winter']
      }],
      occasions: [{
        type: String,
        enum: ['casual', 'office', 'evening', 'special', 'date-night', 'party']
      }]
    },
    priceRange: {
      min: {
        type: Number,
        min: 0
      },
      max: {
        type: Number,
        min: 0
      }
    }
  },
  addresses: [addressSchema],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  orderHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  loyaltyPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  membershipTier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze'
  },
  accountStatus: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending-verification'],
    default: 'active'
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpiry: Date,
  passwordResetToken: String,
  passwordResetExpiry: Date,
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: Date,
  socialLogins: {
    google: {
      id: String,
      email: String
    },
    facebook: {
      id: String,
      email: String
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ 'profile.firstName': 1, 'profile.lastName': 1 });
userSchema.index({ membershipTier: 1 });
userSchema.index({ loyaltyPoints: -1 });
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ passwordResetToken: 1 });

// Virtual for full name
userSchema.virtual('fullName').get(function () {
  if (this.profile?.firstName && this.profile?.lastName) {
    return `${this.profile.firstName} ${this.profile.lastName}`;
  }
  return this.name;
});

// Virtual to check if account is locked
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update membership tier based on loyalty points
userSchema.pre('save', function (next) {
  if (this.isModified('loyaltyPoints')) {
    if (this.loyaltyPoints >= 10000) {
      this.membershipTier = 'platinum';
    } else if (this.loyaltyPoints >= 5000) {
      this.membershipTier = 'gold';
    } else if (this.loyaltyPoints >= 1000) {
      this.membershipTier = 'silver';
    } else {
      this.membershipTier = 'bronze';
    }
  }
  next();
});

// Update profile fields when name changes
userSchema.pre('save', function (next) {
  if (this.isModified('name') && this.name) {
    const nameParts = this.name.split(' ');
    if (!this.profile) this.profile = {};

    if (!this.profile.firstName) {
      this.profile.firstName = nameParts[0] || '';
    }
    if (!this.profile.lastName) {
      this.profile.lastName = nameParts.slice(1).join(' ') || '';
    }
  }
  next();
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to handle failed login attempts
userSchema.methods.incLoginAttempts = function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account after 5 failed attempts for 30 minutes
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 30 * 60 * 1000 }; // 30 minutes
  }

  return this.updateOne(updates);
};

// Method to reset login attempts on successful login
userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
    $set: { lastLogin: new Date() }
  });
};

// Method to add loyalty points
userSchema.methods.addLoyaltyPoints = function (points) {
  this.loyaltyPoints += points;
  return this.save();
};

// Method to add to wishlist
userSchema.methods.addToWishlist = function (productId) {
  if (!this.wishlist.includes(productId)) {
    this.wishlist.push(productId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove from wishlist
userSchema.methods.removeFromWishlist = function (productId) {
  this.wishlist = this.wishlist.filter(id => id.toString() !== productId.toString());
  return this.save();
};

// Method to get default address
userSchema.methods.getDefaultAddress = function () {
  return this.addresses.find(addr => addr.isDefault) || this.addresses[0];
};

// Method to set default address
userSchema.methods.setDefaultAddress = function (addressId) {
  // First, set all addresses to non-default
  this.addresses.forEach(addr => addr.isDefault = false);

  // Then set the specified address as default
  const address = this.addresses.id(addressId);
  if (address) {
    address.isDefault = true;
    return this.save();
  }

  throw new Error('Address not found');
};

// Static method to find user by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to create email verification token
userSchema.methods.createEmailVerificationToken = function () {
  const crypto = require('crypto');
  const token = crypto.randomBytes(20).toString('hex');

  this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return token;
};

// Static method to create password reset token
userSchema.methods.createPasswordResetToken = function () {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(20).toString('hex');

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);