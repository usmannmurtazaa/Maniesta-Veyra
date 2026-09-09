import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { getServerEnv } from '@/lib/env';

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
      // Environment not fully available; fall back to no‑op limiter.
      redis = null;
    }
  }
  return redis;
}

function createLimiter(
  prefix: string,
  limit: number,
  duration: `${number}s` | `${number}m` | `${number}h`
) {
  const client = getRedisClient();
  if (!client) {
    return {
      limit: async () => ({ success: true }),
    };
  }

  return new Ratelimit({
    redis: client,
    limiter: Ratelimit.slidingWindow(limit, duration),
    prefix,
  });
}

export const rateLimiters = {
  login: createLimiter('rl:login', 5, '1m'),
  register: createLimiter('rl:register', 3, '10m'),
  passwordReset: createLimiter('rl:reset', 3, '10m'),
  upload: createLimiter('rl:upload', 10, '1m'),
  couponValidate: createLimiter('rl:coupon', 10, '1m'),
  reviewSubmit: createLimiter('rl:review', 3, '10m'),
  orderCreate: createLimiter('rl:order', 5, '1m'),
  contact: createLimiter('rl:contact', 3, '10m'),
};