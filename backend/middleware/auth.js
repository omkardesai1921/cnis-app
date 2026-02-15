const admin = require('firebase-admin');
const path = require('path');

/**
 * Firebase Authentication Middleware
 * Verifies Firebase ID tokens from frontend requests
 * Protects API endpoints from unauthorized access
 */

// Initialize Firebase Admin SDK
let firebaseInitialized = false;

function initializeFirebase() {
    if (firebaseInitialized) return;

    try {
        // Option 1: Use service account JSON file
        if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
            const serviceAccount = require(path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH));
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log('✅ Firebase Admin initialized with service account file');
        }
        // Option 2: Use environment variables
        else if (process.env.FIREBASE_PROJECT_ID) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
                })
            });
            console.log('✅ Firebase Admin initialized with environment variables');
        } else {
            console.warn('⚠️  Firebase Admin not configured. Authentication disabled.');
            console.warn('   Set FIREBASE_SERVICE_ACCOUNT_PATH or individual credentials in .env');
        }
        firebaseInitialized = true;
    } catch (error) {
        console.error('❌ Firebase initialization error:', error.message);
    }
}

initializeFirebase();

/**
 * Middleware to verify Firebase ID token
 * Usage: app.post('/api/endpoint', verifyToken, handler)
 */
async function verifyToken(req, res, next) {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No authorization token provided'
            });
        }

        const idToken = authHeader.split('Bearer ')[1];

        // Verify the token with Firebase
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // Attach user info to request object
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name
        };

        console.log(`✅ Authenticated user: ${req.user.email || req.user.uid}`);
        next();
    } catch (error) {
        console.error('❌ Token verification failed:', error.message);
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid or expired token'
        });
    }
}

/**
 * Optional: Middleware for development - bypasses auth
 * Use only in development mode for testing
 */
function devBypassAuth(req, res, next) {
    if (process.env.NODE_ENV === 'development' && !firebaseInitialized) {
        console.warn('⚠️  DEV MODE: Authentication bypassed');
        req.user = { uid: 'dev-user', email: 'dev@test.com' };
        return next();
    }
    return verifyToken(req, res, next);
}

module.exports = { verifyToken, devBypassAuth };
