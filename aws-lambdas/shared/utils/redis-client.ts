/**
 * Redis Client for Lambda Functions
 *
 * Used for:
 * - Queue state management
 * - Caching email eligibility checks
 * - Rate limiting
 * - Deduplication
 */

import Redis from 'ioredis';

let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL || '', {
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
export async function wasEmailSentRecently(
  userId: string,
  emailType: string,
  windowHours: number = 24
): Promise<boolean> {
  const client = getRedisClient();
  const key = `email:sent:${userId}:${emailType}`;

  try {
    const lastSent = await client.get(key);
    if (!lastSent) return false;

    const lastSentTime = parseInt(lastSent, 10);
    const windowMs = windowHours * 60 * 60 * 1000;

    return Date.now() - lastSentTime < windowMs;
  } catch (error) {
    console.error('Redis error checking email sent recently:', error);
    return false; // Fail open - allow sending if Redis fails
  }
}

/**
 * Mark email as sent (for deduplication)
 */
export async function markEmailAsSent(
  userId: string,
  emailType: string,
  ttlHours: number = 24
): Promise<void> {
  const client = getRedisClient();
  const key = `email:sent:${userId}:${emailType}`;
  const ttlSeconds = ttlHours * 60 * 60;

  try {
    await client.setex(key, ttlSeconds, Date.now().toString());
  } catch (error) {
    console.error('Redis error marking email as sent:', error);
    // Don't throw - logging is sufficient
  }
}

/**
 * Rate limiting check
 */
export async function checkRateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
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
  } catch (error) {
    console.error('Redis error in rate limit check:', error);
    return { allowed: true, remaining: limit }; // Fail open
  }
}

/**
 * Close Redis connection (for cleanup)
 */
export async function closeRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}
