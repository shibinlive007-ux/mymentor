/**
 * In-memory sliding window rate limiter
 * Protects Next.js API route handlers from DDoS & spam at $0 operating cost
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Lazy cleanup when store grows beyond 1,000 entries
 */
function cleanupStaleEntries(): void {
  if (rateLimitStore.size < 1000) return;
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    const validTimestamps = record.timestamps.filter((ts) => now - ts < 60000);
    if (validTimestamps.length === 0) {
      rateLimitStore.delete(key);
    } else {
      record.timestamps = validTimestamps;
    }
  }
}

export interface RateLimitOptions {
  limit?: number; // max allowed requests per window
  windowMs?: number; // sliding window duration in ms (default: 60000 = 1 minute)
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

/**
 * Checks if a given identifier (IP, userId, etc.) is within allowed limits
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  cleanupStaleEntries();

  const limit = options.limit ?? 30; // default 30 requests / minute
  const windowMs = options.windowMs ?? 60000;
  const now = Date.now();

  let record = rateLimitStore.get(identifier);
  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(identifier, record);
  }

  // Filter timestamps within current sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  const resetMs = record.timestamps.length > 0
    ? Math.max(0, windowMs - (now - record.timestamps[0]))
    : windowMs;

  if (record.timestamps.length >= limit) {
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetMs,
    };
  }

  // Record this hit
  record.timestamps.push(now);

  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - record.timestamps.length),
    resetMs,
  };
}

/**
 * Resets rate limit records (helpful for tests and account resets)
 */
export function clearRateLimitStore(): void {
  rateLimitStore.clear();
}

/**
 * Generates standard rate limit headers
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetMs / 1000)),
  };
}
