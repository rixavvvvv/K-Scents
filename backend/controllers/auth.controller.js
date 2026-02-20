const User = require('../models/User');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Please provide all required fields: name, email, password'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }

        if (confirmPassword && password !== confirmPassword) {
            return res.status(400).json({
                message: 'Passwords do not match'
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return res.status(400).json({
                message: 'User with this email already exists'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            profile: {
                firstName: name.split(' ')[0],
                lastName: name.split(' ').slice(1).join(' ') || ''
            }
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                profile: user.profile,
                createdAt: user.createdAt
            },
            token
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error registering user',
            error: error.message
        });
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                message: 'Please provide email and password'
            });
        }

        // Find user and include password for comparison
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordValid = await user.matchPassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        res.json({
            message: 'Login successful',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                profile: user.profile,
                lastLogin: user.lastLogin
            },
            token
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error logging in',
            error: error.message
        });
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                profile: user.profile,
                preferences: user.preferences,
                addresses: user.addresses,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error fetching profile',
            error: error.message
        });
    }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update basic info
        if (req.body.name) user.name = req.body.name;
        if (req.body.email) {
            const emailExists = await User.findOne({
                email: req.body.email.toLowerCase(),
                _id: { $ne: user._id }
            });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            user.email = req.body.email.toLowerCase();
        }

        // Update profile info
        if (req.body.profile) {
            user.profile = { ...user.profile, ...req.body.profile };
        }

        // Update preferences
        if (req.body.preferences) {
            user.preferences = { ...user.preferences, ...req.body.preferences };
        }

        const updatedUser = await user.save();

        res.json({
            message: 'Profile updated successfully',
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                profile: updatedUser.profile,
                preferences: updatedUser.preferences
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error updating profile',
            error: error.message
        });
    }
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: 'Please provide current and new password'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: 'New password must be at least 6 characters long'
            });
        }

        if (confirmNewPassword && newPassword !== confirmNewPassword) {
            return res.status(400).json({
                message: 'New passwords do not match'
            });
        }

        const user = await User.findById(req.user._id).select('+password');

        // Verify current password
        const isCurrentPasswordValid = await user.matchPassword(currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            message: 'Password changed successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error changing password',
            error: error.message
        });
    }
});

// @desc    Add address to user profile
// @route   POST /api/auth/addresses
// @access  Private
const addAddress = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const { type, street, city, state, zipCode, country, isDefault } = req.body;

        if (!street || !city || !state || !zipCode || !country) {
            return res.status(400).json({
                message: 'Please provide all address fields'
            });
        }

        const newAddress = {
            type: type || 'home',
            street,
            city,
            state,
            zipCode,
            country,
            isDefault: isDefault || false
        };

        // If this is set as default, make others non-default
        if (newAddress.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses.push(newAddress);
        await user.save();

        res.status(201).json({
            message: 'Address added successfully',
            addresses: user.addresses
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error adding address',
            error: error.message
        });
    }
});

// @desc    Update address
// @route   PUT /api/auth/addresses/:addressId
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const addressId = req.params.addressId;

        const address = user.addresses.id(addressId);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Update address fields
        Object.keys(req.body).forEach(key => {
            address[key] = req.body[key];
        });

        // If this is set as default, make others non-default
        if (req.body.isDefault) {
            user.addresses.forEach(addr => {
                if (addr._id.toString() !== addressId) {
                    addr.isDefault = false;
                }
            });
        }

        await user.save();

        res.json({
            message: 'Address updated successfully',
            addresses: user.addresses
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error updating address',
            error: error.message
        });
    }
});

// @desc    Delete address
// @route   DELETE /api/auth/addresses/:addressId
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const addressId = req.params.addressId;

        const address = user.addresses.id(addressId);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        user.addresses.pull(addressId);
        await user.save();

        res.json({
            message: 'Address deleted successfully',
            addresses: user.addresses
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error deleting address',
            error: error.message
        });
    }
});

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;

        // Build query
        let query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Pagination
        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);
        const skip = (pageNumber - 1) * pageSize;

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(skip);

        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / pageSize);

        res.json({
            users,
            currentPage: pageNumber,
            totalPages,
            totalUsers,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error fetching users',
            error: error.message
        });
    }
});

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    getAllUsers
};