const rateLimit = require('express-rate-limit');

/**
 * Rate Limiting Configuration
 * Prevents API abuse and controls costs
 */

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute default
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 10, // 10 requests per window
    message: {
        error: 'Too many requests',
        message: 'You have exceeded the rate limit. Please try again later.',
        retryAfter: '60 seconds'
    },
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    // Use user ID if authenticated, otherwise IP
    keyGenerator: (req) => {
        return req.user?.uid || req.ip;
    },
    handler: (req, res) => {
        console.warn(`⚠️  Rate limit exceeded for ${req.user?.email || req.ip}`);
        res.status(429).json({
            error: 'Too Many Requests',
            message: 'Please wait before making more requests',
            retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
        });
    }
});

// Strict limiter for expensive AI operations
const aiLimiter = rateLimit({
    windowMs: 60000, // 1 minute
    max: 5, // Only 5 AI requests per minute
    message: {
        error: 'AI request limit exceeded',
        message: 'Too many AI requests. Please wait before sending more messages.'
    },
    keyGenerator: (req) => req.user?.uid || req.ip,
    skip: (req) => process.env.NODE_ENV === 'development' // Skip in dev mode
});

// Very strict limiter for image processing
const imageLimiter = rateLimit({
    windowMs: 60000,
    max: 3, // Only 3 image validations per minute
    message: {
        error: 'Image processing limit exceeded',
        message: 'Too many image uploads. Please wait before uploading more.'
    },
    keyGenerator: (req) => req.user?.uid || req.ip
});

module.exports = { apiLimiter, aiLimiter, imageLimiter };
