import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

const options = {
  maxRetriesPerRequest: null, // Required by BullMQ
  lazyConnect: true // Prevent immediate connection errors on localhost
};

export const redisConnection = env.REDIS_URL 
  ? new Redis(env.REDIS_URL, options)
  : new Redis({
      host: '127.0.0.1',
      port: 6379,
      ...options
    });

redisConnection.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

redisConnection.on('connect', () => {
  logger.info('✅ Successfully connected to Redis for BullMQ');
});
