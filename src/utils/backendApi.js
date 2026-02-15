/**
 * Secure Backend API Client for CNIS
 * Routes all AI requests through backend proxy to hide API keys
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

/**
 * Make authenticated request to backend chat API
 * @param {string} message - User's message
 * @param {string} lang - Language code (en, hi, mr)
 * @param {string} systemPrompt - RAG context + instructions
 * @returns {Promise<string>} AI response or error message
 */
export async function callSecureChat(message, lang, systemPrompt) {
    try {
        // Get Firebase token if user is authenticated
        const { auth } = await import('../config/firebase');
        const user = auth.currentUser;
        let idToken = '';

        if (user) {
            try {
                idToken = await user.getIdToken();
            } catch (e) {
                console.warn('[Auth] Could not get token:', e.message);
            }
        }

        console.log('[Backend] Calling secure API...');
        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': idToken ? `Bearer ${idToken}` : '' // Empty if not logged in (dev bypass mode)
            },
            body: JSON.stringify({
                message,
                lang,
                systemPrompt
            }),
            signal: AbortSignal.timeout(30000) // 30 second timeout
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }));

            // Handle rate limiting
            if (response.status === 429) {
                return `⏱️ **Too many requests!**\n\nPlease wait ${error.retryAfter || '60 seconds'} before sending another message.`;
            }

            // Handle authentication errors
            if (response.status === 401) {
                console.warn('[Auth] Unauthorized - falling back to offline mode');
                throw new Error('Unauthorized');
            }

            throw new Error(error.message || `Backend error: ${response.status}`);
        }

        const data = await response.json();

        if (data.answer) {
            console.log(`✅ Backend response received (via ${data.provider || 'AI'})`);
            return data.answer;
        }

        throw new Error('No answer received from backend');

    } catch (error) {
        console.error('[Backend] Error:', error.message);
        throw error; // Re-throw so caller can handle fallback
    }
}

/**
 * Check if backend is available
 */
export async function checkBackendHealth() {
    try {
        const response = await fetch(`${BACKEND_URL}/health`, {
            method: 'GET',
            signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        return response.ok;
    } catch (error) {
        console.warn('[Backend] Health check failed:', error.message);
        return false;
    }
}
