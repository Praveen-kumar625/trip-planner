import 'uncrypto';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { env } from '../config/env.js';

// Fallback to memory store if no Redis config is provided (for local dev)
const cache = new Map();

let redisClient = null;
if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
  redisClient = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// Create rate limiters
const generalLimiter = new Ratelimit({
  redis: redisClient || {
    sadd: () => {},
    eval: () => [0, 0, 0],
    get: (key) => cache.get(key) || null,
    set: (key, value) => { cache.set(key, value); return 'OK'; },
    incr: (key) => { const v = (cache.get(key) || 0) + 1; cache.set(key, v); return v; },
    pexpire: () => 1
  },
  limiter: Ratelimit.slidingWindow(100, '15 m'),
  ephemeralCache: cache,
});

const aiLimiter = new Ratelimit({
  redis: redisClient || {
    sadd: () => {},
    eval: () => [0, 0, 0],
    get: (key) => cache.get(key) || null,
    set: (key, value) => { cache.set(key, value); return 'OK'; },
    incr: (key) => { const v = (cache.get(key) || 0) + 1; cache.set(key, v); return v; },
    pexpire: () => 1
  },
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  ephemeralCache: cache,
});

export const upstashRateLimiter = async (req, res, next) => {
  if (!redisClient) {
    // If no Redis configured, skip real rate limiting and pass through or use simple memory
    return next();
  }

  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const { success, limit, remaining, reset } = await generalLimiter.limit(`general_${ip}`);
    
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', reset);

    if (!success) {
      return res.status(429).json({ error: 'Too many requests, please try again later.' });
    }
    next();
  } catch (error) {
    console.error('Rate limit error:', error);
    next(); // Pass through on Redis errors to avoid taking down the app
  }
};

export const upstashAiRateLimiter = async (req, res, next) => {
  if (!redisClient) {
    return next();
  }

  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const { success, limit, remaining, reset } = await aiLimiter.limit(`ai_${ip}`);
    
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', reset);

    if (!success) {
      return res.status(429).json({ error: 'AI Rate limit exceeded. Please wait a moment before sending more messages.' });
    }
    next();
  } catch (error) {
    console.error('AI Rate limit error:', error);
    next();
  }
};
