import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { getNotifications, markAsRead } from './controller.js';

const router = Router();
router.use(requireAuth);

router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);

export default router;
