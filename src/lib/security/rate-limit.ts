import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { getServerEnv } from '@/lib/env';

type Duration = `${number} s` | `${number} m` | `${number} h`;

interface LimitResult {
  success: boolean;
  limit?: number;
  remaining?: number;
  reset?: number;
}

interface Limiter {
  limit: (identifier: string) => Promise<LimitResult>;
}

function createRedisClient(): Redis | null {
  const env = getServerEnv();
  if (!env.UPSTASH_REDIS_URL || !env.UPSTASH_REDIS_TOKEN) {
    return null;
  }
  return new Redis({
    url: env.UPSTASH_REDIS_URL,
    token: env.UPSTASH_REDIS_TOKEN,
  });
}

const redis = createRedisClient();

/**
 * Wraps a ratelimit check so that a failure of the rate limiter itself
 * (Redis down, token permissions, network error) does NOT crash the
 * request. Fail-open: allow the request through and log the error.
 */
function createLimiter(prefix: string, limit: number, duration: Duration): Limiter {
  if (!redis) {
    return {
      limit: async () => ({ success: true }),
    };
  }

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, duration),
    prefix,
  });

  return {
    limit: async (identifier: string): Promise<LimitResult> => {
      try {
        const result = await limiter.limit(identifier);
        return {
          success: result.success,
          limit: result.limit,
          remaining: result.remaining,
          reset: result.reset,
        };
      } catch (error) {
        console.error(`[ratelimit:${prefix}] check failed:`, error);
        return { success: true };
      }
    },
  };
}

export const rateLimiters = {
  login: createLimiter('rl:login', 5, '1m'),
  register: createLimiter('rl:register', 3, '10m'),
  passwordReset: createLimiter('rl:reset', 3, '10m'),
  upload: createLimiter('rl:upload', 10, '1m'),
  couponValidate: createLimiter('rl:coupon', 10, '1m'),
  reviewSubmit: createLimiter('rl:review', 3, '10m'),
  orderCreate: createLimiter('rl:order', 5, '1m'),
} as const;