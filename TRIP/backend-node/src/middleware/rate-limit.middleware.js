import 'uncrypto';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { RateLimitError } from '../utils/errors.js';

const cache = new Map();

let redisClient = null;
if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
  redisClient = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });
}

// Fallback in-memory limiters
const memoryGeneralLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  handler: (req, res, next, options) => {
    next(new RateLimitError(options.message.error));
  }
});

const memoryAiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { error: 'AI Rate limit exceeded. Please wait a moment before sending more messages.' },
  handler: (req, res, next, options) => {
    next(new RateLimitError(options.message.error));
  }
});

const generalLimiter = new Ratelimit({
  redis: redisClient || {
    sadd: () => {}, eval: () => [0, 0, 0], get: () => null, set: () => 'OK', incr: () => 1, pexpire: () => 1
  },
  limiter: Ratelimit.slidingWindow(100, '15 m'),
  ephemeralCache: cache,
});

const aiLimiter = new Ratelimit({
  redis: redisClient || {
    sadd: () => {}, eval: () => [0, 0, 0], get: () => null, set: () => 'OK', incr: () => 1, pexpire: () => 1
  },
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  ephemeralCache: cache,
});

export const upstashRateLimiter = async (req, res, next) => {
  if (!redisClient) {
    return memoryGeneralLimiter(req, res, next);
  }

  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const { success, limit, remaining, reset } = await generalLimiter.limit(`general_${ip}`);
    
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', reset);

    if (!success) {
      return next(new RateLimitError('Too many requests, please try again later.'));
    }
    next();
  } catch (error) {
    logger.error('Rate limit error:', { error });
    next();
  }
};

export const upstashAiRateLimiter = async (req, res, next) => {
  if (!redisClient) {
    return memoryAiLimiter(req, res, next);
  }

  try {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const { success, limit, remaining, reset } = await aiLimiter.limit(`ai_${ip}`);
    
    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', reset);

    if (!success) {
      return next(new RateLimitError('AI Rate limit exceeded. Please wait a moment before sending more messages.'));
    }
    next();
  } catch (error) {
    logger.error('AI Rate limit error:', { error });
    next();
  }
};
