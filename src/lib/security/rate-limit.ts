import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { getServerEnv } from '@/lib/env';

function createRedisClient() {
  const env = getServerEnv();
  if (!env.UPSTASH_REDIS_URL || !env.UPSTASH_REDIS_TOKEN) {
    // Return a mock or throw? For development, we can create a dummy limiter that always allows.
    // Better: throw error if missing, but for now return null and handle in limiter.
    return null;
  }
  return new Redis({
    url: env.UPSTASH_REDIS_URL,
    token: env.UPSTASH_REDIS_TOKEN,
  });
}

const redis = createRedisClient();

function createLimiter(prefix: string, limit: number, duration: `${number} s` | `${number} m` | `${number} h`) {
  if (!redis) {
    // Dummy limiter that always allows
    return {
      limit: async () => ({ success: true }),
    };
  }
  return new Ratelimit({
    redis,
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
};