import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import {
  createBudget,
  getBudget,
  updateBudget,
  deleteBudget,
  getForecast,
  getHealth
} from './controller.js';

const router = Router();
router.use(requireAuth);

router.post('/', createBudget);
router.get('/:tripId', getBudget);
router.patch('/:tripId', updateBudget);
router.delete('/:tripId', deleteBudget);
router.get('/:tripId/forecast', getForecast);
router.get('/:tripId/health', getHealth);

export default router;
