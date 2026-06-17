import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { getDashboardStats, getTripAnalytics } from './controller.js';

const router = Router();
router.use(requireAuth);

router.get('/dashboard', getDashboardStats);
router.get('/trip/:tripId', getTripAnalytics);

export default router;
