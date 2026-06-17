import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
import { errorHandler } from '../middleware/error.middleware.js';

// Import domain routers
import authRoutes from '../modules/auth/router.js';
import tripRoutes from '../modules/trips/router.js';
import budgetRoutes from '../modules/budget/router.js';
import expenseRoutes from '../modules/expenses/router.js';
import preferenceRoutes from '../modules/preferences/router.js';
import mapRoutes from '../modules/maps/router.js';
import destinationRoutes from '../modules/destinations/router.js';
import aiRoutes from '../modules/ai/router.js';
import analyticsRoutes from '../modules/analytics/router.js';
import notificationRoutes from '../modules/notifications/router.js';

export const createServer = () => {
  const app = express();

  // Security Middleware
  app.use(helmet());
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    })
  );

  // General Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
  });
  app.use(limiter);

  // Strict AI Rate Limiting
  const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Max 10 messages per minute per IP
    message: 'AI Rate limit exceeded. Please wait a moment before sending more messages.',
  });

  // Body Parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'WANDERSYNC AI Backend' });
  });

  // Mount Domain Modules
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/trips', tripRoutes);
  app.use('/api/v1/budget', budgetRoutes);
  app.use('/api/v1/expenses', expenseRoutes);
  app.use('/api/v1/preferences', preferenceRoutes);
  app.use('/api/v1/maps', mapRoutes);
  app.use('/api/v1/destinations', destinationRoutes);
  app.use('/api/v1/ai', aiLimiter, aiRoutes);
  app.use('/api/v1/analytics', analyticsRoutes);
  app.use('/api/v1/notifications', notificationRoutes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
