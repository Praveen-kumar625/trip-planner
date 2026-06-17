import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getReport
} from './controller.js';

const router = Router();
router.use(requireAuth);

router.post('/', createExpense);
router.get('/:tripId', getExpenses);
router.patch('/:expenseId', updateExpense);
router.delete('/:expenseId', deleteExpense);
router.get('/:tripId/report', getReport);

export default router;
