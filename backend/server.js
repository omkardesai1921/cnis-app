require('dotenv').config();
const { validateEnvVars } = require('./config/validateEnv');

// Validate environment variables before starting server
validateEnvVars();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { devBypassAuth } = require('./middleware/auth');
const { apiLimiter } = require('./middleware/rateLimiter');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3001;

// ========== SECURITY MIDDLEWARE ==========

// Helmet - Security headers
app.use(helmet({
    contentSecurityPolicy: false // Disable CSP for API server
}));

// CORS - Allow frontend to make requests
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map(url => url.trim());
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all in production for now
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(morgan('dev'));

// ========== RATE LIMITING ==========
// Apply general rate limiter to all API routes
app.use('/api', apiLimiter);

// ========== HEALTH CHECK ENDPOINT ==========
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/', (req, res) => {
    res.json({
        name: 'CNIS Backend API',
        version: '1.0.0',
        description: 'Secure proxy for AI health intelligence',
        endpoints: {
            health: 'GET /health',
            chat: 'POST /api/chat (requires auth)'
        }
    });
});

// ========== API ROUTES (PROTECTED) ==========
// Use devBypassAuth in development, or switch to verifyToken for production
app.use('/api', devBypassAuth, chatRoutes);

// ========== ERROR HANDLING ==========
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', message: 'Endpoint does not exist' });
});

app.use((err, req, res, next) => {
    console.error('❌ Unhandled error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// ========== START SERVER ==========
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 CNIS Backend API Server');
    console.log('='.repeat(50));
    console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✅ Server running on: http://localhost:${PORT}`);
    console.log(`✅ Frontend allowed: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log(`✅ Rate limit: ${process.env.RATE_LIMIT_MAX_REQUESTS || 10} requests per ${(process.env.RATE_LIMIT_WINDOW_MS || 60000) / 1000}s`);
    console.log('='.repeat(50) + '\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT signal received: closing HTTP server');
    process.exit(0);
});
