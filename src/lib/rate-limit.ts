export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

const rateLimitCache = new Map<string, { count: number; resetAt: number }>();

// Simple background cleanup to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    rateLimitCache.forEach((value, key) => {
      if (now > value.resetAt) {
        rateLimitCache.delete(key);
      }
    });
  }, 60 * 1000);
}

/**
 * Basic in-memory rate limiter.
 * Note: In serverless environments, this is scoped per-instance.
 * For global distributed rate-limiting, use Redis (e.g. @upstash/ratelimit).
 */
export async function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = Date.now();
  const record = rateLimitCache.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitCache.set(identifier, { count: 1, resetAt: now + windowMs });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + windowMs,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: record.resetAt,
    };
  }

  record.count += 1;
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: record.resetAt,
  };
}
