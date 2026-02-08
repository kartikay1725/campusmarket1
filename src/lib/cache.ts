/**
 * Simple in-memory cache for API responses
 * Helps reduce database load and improve response times
 */

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number;
}

class MemoryCache {
    private cache: Map<string, CacheEntry<unknown>> = new Map();
    private maxSize: number = 1000; // Max entries

    /**
     * Get cached data
     */
    get<T>(key: string): T | null {
        const entry = this.cache.get(key);

        if (!entry) return null;

        // Check if expired
        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    /**
     * Set cache data
     * @param key Cache key
     * @param data Data to cache
     * @param ttlMs Time to live in milliseconds (default: 5 minutes)
     */
    set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): void {
        // Evict old entries if cache is full
        if (this.cache.size >= this.maxSize) {
            this.evictOldest();
        }

        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttlMs,
        });
    }

    /**
     * Delete cached data
     */
    delete(key: string): void {
        this.cache.delete(key);
    }

    /**
     * Delete all cache entries matching a pattern
     */
    invalidatePattern(pattern: string): void {
        const regex = new RegExp(pattern);
        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                this.cache.delete(key);
            }
        }
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Get cache stats
     */
    stats(): { size: number; maxSize: number } {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
        };
    }

    private evictOldest(): void {
        // Remove the oldest 10% of entries
        const entriesToRemove = Math.floor(this.maxSize * 0.1);
        const keys = Array.from(this.cache.keys()).slice(0, entriesToRemove);
        keys.forEach(key => this.cache.delete(key));
    }
}

// Singleton instance
export const cache = new MemoryCache();

// Cache TTL presets (in milliseconds)
export const CACHE_TTL = {
    SHORT: 30 * 1000,          // 30 seconds - for frequently changing data
    MEDIUM: 5 * 60 * 1000,     // 5 minutes - default
    LONG: 30 * 60 * 1000,      // 30 minutes - for rarely changing data
    HOUR: 60 * 60 * 1000,      // 1 hour
    DAY: 24 * 60 * 60 * 1000,  // 24 hours - for static data
};

// Helper to generate cache keys
export function cacheKey(prefix: string, ...parts: (string | number | undefined)[]): string {
    return `${prefix}:${parts.filter(Boolean).join(":")}`;
}

// Wrapper for cached async functions
export async function cached<T>(
    key: string,
    fn: () => Promise<T>,
    ttlMs: number = CACHE_TTL.MEDIUM
): Promise<T> {
    // Try cache first
    const cachedData = cache.get<T>(key);
    if (cachedData !== null) {
        return cachedData;
    }

    // Execute function and cache result
    const data = await fn();
    cache.set(key, data, ttlMs);
    return data;
}
