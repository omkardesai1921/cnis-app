/**
 * Client-Side Request Throttling
 * Prevents users from spamming requests before they even reach the backend
 */

class RequestThrottler {
    constructor(maxRequests, windowMs) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.requests = [];
    }

    /**
     * Check if a new request is allowed
     * @returns {Object} { allowed: boolean, retryAfter: number }
     */
    canMakeRequest() {
        const now = Date.now();

        // Remove old requests outside the window
        this.requests = this.requests.filter(
            timestamp => now - timestamp < this.windowMs
        );

        // Check if under limit
        if (this.requests.length < this.maxRequests) {
            this.requests.push(now);
            return { allowed: true, retryAfter: 0 };
        }

        // Calculate retry time
        const oldestRequest = this.requests[0];
        const retryAfter = Math.ceil((oldestRequest + this.windowMs - now) / 1000);

        return { allowed: false, retryAfter };
    }

    /**
     * Reset the throttler (useful for testing)
     */
    reset() {
        this.requests = [];
    }
}

// Create throttler instances for different actions
export const chatThrottler = new RequestThrottler(5, 60000); // 5 requests per minute
export const imageThrottler = new RequestThrottler(3, 60000); // 3 uploads per minute
export const generalThrottler = new RequestThrottler(10, 60000); // 10 general requests per minute
