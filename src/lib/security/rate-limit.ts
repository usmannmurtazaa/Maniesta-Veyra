import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { getServerEnv } from '@/lib/env';

type Duration = `${number} ${'ms' | 's' | 'm' | 'h' | 'd'}`;

interface LimitResult {
  success: boolean;
  limit?: number;
  remaining?: number;
  reset?: number;
}

interface Limiter {
  limit: (identifier: string) => Promise<LimitResult>;
}

let redis: Redis | null = null;
let redisInitialized = false;

function getRedisClient(): Redis | null {
  if (!redisInitialized) {
    redisInitialized = true;
    try {
      const env = getServerEnv();
      if (env.UPSTASH_REDIS_URL && env.UPSTASH_REDIS_TOKEN) {
        redis = new Redis({
          url: env.UPSTASH_REDIS_URL,
          token: env.UPSTASH_REDIS_TOKEN,
        });
      }
    } catch {
      // Env not fully available — fall back to no-op limiter
      redis = null;
    }
  }
  return redis;
}

/**
 * Wraps a ratelimit check so that a failure of the rate limiter itself
 * (Redis down, token permissions like NOPERM, network error) does NOT
 * crash the request.
 *
 * Fail-open: allow the request through and log the error. This is the
 * right behavior for a security control — better to occasionally allow
 * over-quota traffic than to 500 every request when Redis has a hiccup.
 */
function createLimiter(
  prefix: string,
  limit: number,
  duration: Duration
): Limiter {
  const client = getRedisClient();

  if (!client) {
    return {
      limit: async () => ({ success: true }),
    };
  }

  const limiter = new Ratelimit({
    redis: client,
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
        // Fail-open. Log so we can see it in Netlify function logs.
        console.error(`[ratelimit:${prefix}] check failed:`, error);
        return { success: true };
      }
    },
  };
}

export const rateLimiters = {
  login: createLimiter('rl:login', 5, '1 m'),
  register: createLimiter('rl:register', 3, '10 m'),
  passwordReset: createLimiter('rl:reset', 3, '10 m'),
  upload: createLimiter('rl:upload', 10, '1 m'),
  couponValidate: createLimiter('rl:coupon', 10, '1 m'),
  reviewSubmit: createLimiter('rl:review', 3, '10 m'),
  orderCreate: createLimiter('rl:order', 5, '1 m'),
  contact: createLimiter('rl:contact', 3, '10 m'),
} as const;