// Global error handling middleware

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error to console for development
    console.log(err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found`;
        error = {
            message,
            statusCode: 404
        };
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const duplicateField = Object.keys(err.keyValue)[0];
        const message = `${duplicateField} already exists`;
        error = {
            message,
            statusCode: 400
        };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = {
            message,
            statusCode: 400
        };
    }

    // JWT error
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = {
            message,
            statusCode: 401
        };
    }

    // JWT expired error
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = {
            message,
            statusCode: 401
        };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

// Handle unhandled promise rejections
const unhandledRejection = (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    process.exit(1);
};

// Handle uncaught exceptions
const uncaughtException = (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to Uncaught Exception');
    // Close server & exit process
    process.exit(1);
};

module.exports = {
    errorHandler,
    unhandledRejection,
    uncaughtException
};