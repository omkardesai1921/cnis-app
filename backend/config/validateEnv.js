/**
 * Environment Variable Validation
 * Validates required environment variables on server startup
 */

function validateEnvVars() {
    const errors = [];
    const warnings = [];

    // Required for server operation
    if (!process.env.PORT) {
        warnings.push('PORT not set, using default 3001');
    }

    // At least one AI provider is required
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasGemini = !!process.env.GEMINI_API_KEY;

    if (!hasOpenAI && !hasGemini) {
        errors.push('❌ No AI API keys configured! Set OPENAI_API_KEY or GEMINI_API_KEY');
    } else {
        if (hasOpenAI) {
            console.log('✅ OpenAI API key detected');
            // Validate key format
            if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
                warnings.push('⚠️  OpenAI API key format looks invalid (should start with sk-)');
            }
        }
        if (hasGemini) {
            console.log('✅ Gemini API key detected');
        }
    }

    // Firebase configuration (optional, shows warning)
    const hasFirebaseConfig = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || process.env.FIREBASE_PROJECT_ID;
    if (!hasFirebaseConfig) {
        warnings.push('⚠️  Firebase Admin not configured - authentication in dev bypass mode');
    } else {
        console.log('✅ Firebase Admin configuration detected');
    }

    // Frontend URL
    if (!process.env.FRONTEND_URL) {
        warnings.push('⚠️  FRONTEND_URL not set, using default http://localhost:5173');
    } else {
        console.log(`✅ CORS configured for: ${process.env.FRONTEND_URL}`);
    }

    // Rate limiting
    if (!process.env.RATE_LIMIT_MAX_REQUESTS) {
        warnings.push('⚠️  Rate limit not configured, using defaults');
    }

    // Print results
    if (warnings.length > 0) {
        console.log('\n⚠️  CONFIGURATION WARNINGS:');
        warnings.forEach(w => console.log(`   ${w}`));
    }

    if (errors.length > 0) {
        console.log('\n❌ CONFIGURATION ERRORS:');
        errors.forEach(e => console.log(`   ${e}`));
        console.log('\n💡 Fix these errors in your .env file before proceeding.\n');
        process.exit(1); // Exit with error code
    }

    console.log('\n✅ Environment validation passed\n');
}

module.exports = { validateEnvVars };
