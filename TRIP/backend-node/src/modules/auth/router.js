import { Router } from 'express';
import { syncUser } from './controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';

const router = Router();

// Endpoint to sync auth user to database
router.post('/sync', requireAuth, syncUser);

export default router;
