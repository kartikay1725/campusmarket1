/**
 * Rate limiter for API endpoints
 * Prevents abuse and protects against DDoS
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

class RateLimiter {
    private limits: Map<string, RateLimitEntry> = new Map();

    // Clean up expired entries every minute
    constructor() {
        if (typeof setInterval !== "undefined") {
            setInterval(() => this.cleanup(), 60 * 1000);
        }
    }

    /**
     * Check if request should be allowed
     * @param key Unique identifier (e.g., IP address or user ID)
     * @param maxRequests Maximum requests allowed in window
     * @param windowMs Time window in milliseconds
     * @returns Object with allowed status and remaining requests
     */
    check(
        key: string,
        maxRequests: number = 100,
        windowMs: number = 60 * 1000
    ): { allowed: boolean; remaining: number; resetIn: number } {
        const now = Date.now();
        const entry = this.limits.get(key);

        // No existing entry - create new one
        if (!entry || now > entry.resetTime) {
            this.limits.set(key, {
                count: 1,
                resetTime: now + windowMs,
            });
            return {
                allowed: true,
                remaining: maxRequests - 1,
                resetIn: windowMs,
            };
        }

        // Check if limit exceeded
        if (entry.count >= maxRequests) {
            return {
                allowed: false,
                remaining: 0,
                resetIn: entry.resetTime - now,
            };
        }

        // Increment count
        entry.count++;
        return {
            allowed: true,
            remaining: maxRequests - entry.count,
            resetIn: entry.resetTime - now,
        };
    }

    /**
     * Reset rate limit for a key
     */
    reset(key: string): void {
        this.limits.delete(key);
    }

    private cleanup(): void {
        const now = Date.now();
        for (const [key, entry] of this.limits.entries()) {
            if (now > entry.resetTime) {
                this.limits.delete(key);
            }
        }
    }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Rate limit presets (requests per minute)
export const RATE_LIMITS = {
    // Very strict - for sensitive endpoints
    STRICT: { maxRequests: 10, windowMs: 60 * 1000 },

    // Normal - for regular API calls
    NORMAL: { maxRequests: 60, windowMs: 60 * 1000 },

    // Relaxed - for read-heavy endpoints
    RELAXED: { maxRequests: 120, windowMs: 60 * 1000 },

    // Auth endpoints - prevent brute force
    AUTH: { maxRequests: 5, windowMs: 60 * 1000 },

    // OTP endpoints - prevent spam
    OTP: { maxRequests: 3, windowMs: 60 * 1000 },
};

/**
 * Helper to get client identifier from request
 */
export function getClientId(req: Request): string {
    // Try to get real IP from headers (for proxied requests)
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");

    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }

    if (realIp) {
        return realIp;
    }

    // Fallback to a generic key
    return "unknown";
}
