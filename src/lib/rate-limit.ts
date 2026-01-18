/**
 * Simple in-memory rate limiter for serverless functions.
 * Note: This only works within a single instance. For production,
 * use Redis or a similar distributed cache.
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
    /** Maximum requests allowed within the window */
    limit: number;
    /** Time window in milliseconds */
    windowMs: number;
}

export interface RateLimitResult {
    success: boolean;
    remaining: number;
    resetTime: number;
}

/**
 * Check rate limit for a given identifier (usually IP or user ID).
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig
): RateLimitResult {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    // Clean up expired entries periodically
    if (rateLimitStore.size > 1000) {
        for (const [key, value] of rateLimitStore.entries()) {
            if (value.resetTime < now) {
                rateLimitStore.delete(key);
            }
        }
    }

    // If no entry or expired, create new one
    if (!entry || entry.resetTime < now) {
        const newEntry: RateLimitEntry = {
            count: 1,
            resetTime: now + config.windowMs,
        };
        rateLimitStore.set(identifier, newEntry);
        return {
            success: true,
            remaining: config.limit - 1,
            resetTime: newEntry.resetTime,
        };
    }

    // Check if limit exceeded
    if (entry.count >= config.limit) {
        return {
            success: false,
            remaining: 0,
            resetTime: entry.resetTime,
        };
    }

    // Increment count
    entry.count++;
    return {
        success: true,
        remaining: config.limit - entry.count,
        resetTime: entry.resetTime,
    };
}

/**
 * Get client identifier from request headers.
 * Falls back to a generic identifier if IP cannot be determined.
 */
export function getClientIdentifier(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    return forwarded?.split(',')[0]?.trim() ?? realIp ?? 'unknown';
}
