import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { handleQuery, getSessionHistory, handleStreamQuery } from './controller.js';

const router = Router();
router.use(requireAuth);

router.post('/chat', handleQuery);
router.post('/stream', handleStreamQuery);
router.get('/session/:sessionId', getSessionHistory);

export default router;
