const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    try {
        const { category, search, sort, page = 1, limit = 10 } = req.query;

        // Build query object
        let query = { isActive: true };

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        // Search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        let sortObj = { createdAt: -1 }; // default sort
        if (sort) {
            switch (sort) {
                case 'price-low':
                    sortObj = { price: 1 };
                    break;
                case 'price-high':
                    sortObj = { price: -1 };
                    break;
                case 'name-asc':
                    sortObj = { name: 1 };
                    break;
                case 'name-desc':
                    sortObj = { name: -1 };
                    break;
                case 'rating':
                    sortObj = { rating: -1 };
                    break;
                case 'newest':
                    sortObj = { createdAt: -1 };
                    break;
                case 'oldest':
                    sortObj = { createdAt: 1 };
                    break;
            }
        }

        // Pagination
        const pageNumber = parseInt(page);
        const pageSize = parseInt(limit);
        const skip = (pageNumber - 1) * pageSize;

        // Execute query with pagination
        const products = await Product.find(query)
            .sort(sortObj)
            .limit(pageSize)
            .skip(skip);

        // Get total count for pagination
        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / pageSize);

        res.json({
            products,
            currentPage: pageNumber,
            totalPages,
            totalProducts,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching products',
            error: error.message
        });
    }
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!product.isActive) {
            return res.status(404).json({ message: 'Product is not available' });
        }

        // Increment view count
        product.views = (product.views || 0) + 1;
        await product.save();

        res.json(product);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(500).json({
            message: 'Error fetching product',
            error: error.message
        });
    }
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            image,
            stock,
            brand,
            fragrance_notes,
            size,
            discount_percentage
        } = req.body;

        // Validation
        if (!name || !description || !price || !category) {
            return res.status(400).json({
                message: 'Please provide all required fields: name, description, price, category'
            });
        }

        // Check if product with same name already exists
        const existingProduct = await Product.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product with this name already exists' });
        }

        // Calculate final price if there's a discount
        let finalPrice = price;
        if (discount_percentage && discount_percentage > 0) {
            finalPrice = price * (1 - discount_percentage / 100);
        }

        const product = new Product({
            name,
            description,
            price,
            finalPrice,
            category,
            image: image || 'https://via.placeholder.com/400x400?text=No+Image',
            stock: stock || 0,
            brand,
            fragrance_notes,
            size,
            discount_percentage: discount_percentage || 0,
            createdBy: req.user._id
        });

        const savedProduct = await product.save();
        res.status(201).json({
            message: 'Product created successfully',
            product: savedProduct
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating product',
            error: error.message
        });
    }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update fields
        const updateFields = { ...req.body };

        // Recalculate final price if price or discount changed
        if (updateFields.price || updateFields.discount_percentage !== undefined) {
            const newPrice = updateFields.price || product.price;
            const newDiscount = updateFields.discount_percentage !== undefined
                ? updateFields.discount_percentage
                : product.discount_percentage;

            updateFields.finalPrice = newDiscount > 0
                ? newPrice * (1 - newDiscount / 100)
                : newPrice;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { ...updateFields, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        res.json({
            message: 'Product updated successfully',
            product: updatedProduct
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(500).json({
            message: 'Error updating product',
            error: error.message
        });
    }
});

// @desc    Delete a product (soft delete)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Soft delete - mark as inactive
        product.isActive = false;
        product.deletedAt = new Date();
        await product.save();

        res.json({
            message: 'Product deleted successfully',
            productId: req.params.id
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(500).json({
            message: 'Error deleting product',
            error: error.message
        });
    }
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
    try {
        const { category } = req.params;
        const { limit = 10 } = req.query;

        const products = await Product.find({
            category: category.toLowerCase(),
            isActive: true
        })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching products by category',
            error: error.message
        });
    }
});

// @desc    Get featured/recommended products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
    try {
        const featuredProducts = await Product.find({
            isActive: true,
            isFeatured: true
        })
            .sort({ rating: -1, createdAt: -1 })
            .limit(8);

        res.json(featuredProducts);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching featured products',
            error: error.message
        });
    }
});

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
const updateProductStock = asyncHandler(async (req, res) => {
    try {
        const { stock } = req.body;

        if (stock < 0) {
            return res.status(400).json({ message: 'Stock cannot be negative' });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { stock },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({
            message: 'Stock updated successfully',
            product
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating stock',
            error: error.message
        });
    }
});

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getFeaturedProducts,
    updateProductStock
};