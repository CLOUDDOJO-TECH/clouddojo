"use strict";
/**
 * Redis Client for Lambda Functions
 *
 * Used for:
 * - Queue state management
 * - Caching email eligibility checks
 * - Rate limiting
 * - Deduplication
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisClient = getRedisClient;
exports.wasEmailSentRecently = wasEmailSentRecently;
exports.markEmailAsSent = markEmailAsSent;
exports.checkRateLimit = checkRateLimit;
exports.closeRedis = closeRedis;
const ioredis_1 = __importDefault(require("ioredis"));
let redis = null;
function getRedisClient() {
    if (!redis) {
        redis = new ioredis_1.default(process.env.REDIS_URL || '', {
            maxRetriesPerRequest: 3,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            enableReadyCheck: true,
            lazyConnect: true,
        });
        redis.on('error', (err) => {
            console.error('Redis client error:', err);
        });
        redis.on('connect', () => {
            console.log('Redis client connected');
        });
    }
    return redis;
}
/**
 * Check if email was sent recently (deduplication)
 */
async function wasEmailSentRecently(userId, emailType, windowHours = 24) {
    const client = getRedisClient();
    const key = `email:sent:${userId}:${emailType}`;
    try {
        const lastSent = await client.get(key);
        if (!lastSent)
            return false;
        const lastSentTime = parseInt(lastSent, 10);
        const windowMs = windowHours * 60 * 60 * 1000;
        return Date.now() - lastSentTime < windowMs;
    }
    catch (error) {
        console.error('Redis error checking email sent recently:', error);
        return false; // Fail open - allow sending if Redis fails
    }
}
/**
 * Mark email as sent (for deduplication)
 */
async function markEmailAsSent(userId, emailType, ttlHours = 24) {
    const client = getRedisClient();
    const key = `email:sent:${userId}:${emailType}`;
    const ttlSeconds = ttlHours * 60 * 60;
    try {
        await client.setex(key, ttlSeconds, Date.now().toString());
    }
    catch (error) {
        console.error('Redis error marking email as sent:', error);
        // Don't throw - logging is sufficient
    }
}
/**
 * Rate limiting check
 */
async function checkRateLimit(identifier, limit, windowSeconds) {
    const client = getRedisClient();
    const key = `ratelimit:${identifier}`;
    try {
        const current = await client.incr(key);
        if (current === 1) {
            await client.expire(key, windowSeconds);
        }
        const allowed = current <= limit;
        const remaining = Math.max(0, limit - current);
        return { allowed, remaining };
    }
    catch (error) {
        console.error('Redis error in rate limit check:', error);
        return { allowed: true, remaining: limit }; // Fail open
    }
}
/**
 * Close Redis connection (for cleanup)
 */
async function closeRedis() {
    if (redis) {
        await redis.quit();
        redis = null;
    }
}
