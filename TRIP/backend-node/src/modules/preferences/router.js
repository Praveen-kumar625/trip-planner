import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import {
  getPreferences,
  updatePreferences,
  deletePreferenceItem
} from './controller.js';

const router = Router();
router.use(requireAuth);

router.get('/', getPreferences);
router.patch('/', updatePreferences);
router.delete('/:key', deletePreferenceItem);

export default router;
