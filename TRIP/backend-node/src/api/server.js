import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { upstashRateLimiter, upstashAiRateLimiter } from '../middleware/rate-limit.middleware.js';
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
import simulationRoutes from '../modules/simulation/router.js';

export const createServer = () => {
    const app = express();

    // Security Middleware
    app.use(helmet());
    app.use(
        cors({
            origin: [env.FRONTEND_URL, 'https://trip-planner-rosy-three.vercel.app', 'http://localhost:5173'], // Allow explicit origins for the Vercel deployment
            credentials: true,
        })
    );

    // General Rate Limiting
    app.use(upstashRateLimiter);

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
    app.use('/api/v1/ai', upstashAiRateLimiter, aiRoutes);
    app.use('/api/v1/analytics', analyticsRoutes);
    app.use('/api/v1/notifications', notificationRoutes);
    app.use('/api/v1/simulation', simulationRoutes);

    // Global Error Handler
    app.use(errorHandler);

    return app;
};