import { Worker, Queue } from 'bullmq';
import { redisConnection } from '../config/redis.js';
import { logger } from '../utils/logger.js';

// By default, we use an in-memory mock queue to avoid requiring a real Redis server
const USE_MOCK_QUEUE = true; 
const mockProcessors = {};

export const createQueue = (queueName) => {
  if (USE_MOCK_QUEUE) {
    return {
      add: async (name, data) => {
        logger.info(`[MOCK Queue] Added job to ${queueName}: ${name}`);
        if (mockProcessors[queueName]) {
          setTimeout(async () => {
            try {
              await mockProcessors[queueName]({ id: `mock-${Date.now()}`, name, data });
            } catch (err) {
              logger.error(`[MOCK Worker] Error in ${queueName}:`, err);
            }
          }, 100);
        }
        return { id: `mock-${Date.now()}` };
      }
    };
  }
  return new Queue(queueName, { connection: redisConnection });
};

export const createWorker = (queueName, processor) => {
  if (USE_MOCK_QUEUE) {
    logger.info(`[MOCK Worker] Registered worker for ${queueName}`);
    mockProcessors[queueName] = processor;
    return {
      on: () => {},
      close: async () => {}
    };
  }

  const worker = new Worker(queueName, processor, { connection: redisConnection });

  worker.on('completed', (job) => {
    logger.info(`✅ Job ${job.id} completed in ${queueName}`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`❌ Job ${job.id} failed in ${queueName}:`, err);
  });

  return worker;
};
