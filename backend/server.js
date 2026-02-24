require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security: simple rate-limiter (in-memory, replace with redis in production)
const rateLimitMap = new Map();
const rateLimit = (windowMs = 60000, maxRequests = 100) => (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;
    const requests = rateLimitMap.get(ip) || [];
    const recentRequests = requests.filter(t => t > windowStart);
    if (recentRequests.length >= maxRequests) {
        return res.status(429).json({ message: 'Too many requests, please try again later.' });
    }
    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);
    next();
};
app.use('/api/auth/login', rateLimit(60000, 10)); // 10 login attempts/min
app.use('/api/auth/register', rateLimit(60000, 5)); // 5 registrations/min
app.use('/api/', rateLimit(60000, 200)); // 200 general requests/min

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const couponRoutes = require('./routes/coupons');
const wishlistRoutes = require('./routes/wishlist');
const reviewRoutes = require('./routes/reviews');

// Payments route — only load if Stripe key configured
let paymentRoutes;
try {
    paymentRoutes = require('./routes/payments');
} catch (e) {
    console.warn('⚠️  Payments route not loaded (STRIPE_SECRET_KEY missing). Payments disabled.');
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products', reviewRoutes); // /api/products/:id/reviews
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/wishlist', wishlistRoutes);
if (paymentRoutes) app.use('/api/payments', paymentRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'K-Scents API is running!', version: '2.0.0' });
});

// Global error handler
const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5100;
app.listen(PORT, () => {
    console.log(`🌿 K-Scents server running on port ${PORT}`);
});