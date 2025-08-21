// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');

// Temporary hardcoded environment variables
process.env.MONGO_URI = 'mongodb://localhost:27017/k-scents';
process.env.JWT_SECRET = 'your_secret_key_here_12345';
process.env.PORT = '5000';

console.log('Environment variables:');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT);


// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();

//Connect to database 
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);


// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'K-Scents API is running!' });
});



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});