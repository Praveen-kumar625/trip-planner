import { ExpenseService } from './service.js';
import { createExpenseSchema, updateExpenseSchema } from './schemas.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const createExpense = catchAsync(async (req, res, next) => {
  const validatedData = createExpenseSchema.parse(req.body);
  const expense = await ExpenseService.createExpense(req.user.uid, validatedData);
  res.status(201).json({ status: 'success', data: expense });
});

export const getExpenses = catchAsync(async (req, res, next) => {
  const expenses = await ExpenseService.getExpenses(req.user.uid, req.params.tripId);
  res.status(200).json({ status: 'success', data: expenses });
});

export const updateExpense = catchAsync(async (req, res, next) => {
  const validatedData = updateExpenseSchema.parse(req.body);
  const expense = await ExpenseService.updateExpense(req.user.uid, req.params.expenseId, validatedData);
  res.status(200).json({ status: 'success', data: expense });
});

export const deleteExpense = catchAsync(async (req, res, next) => {
  await ExpenseService.deleteExpense(req.user.uid, req.params.expenseId);
  res.status(200).json({ status: 'success', message: 'Expense deleted' });
});

export const getReport = catchAsync(async (req, res, next) => {
  const report = await ExpenseService.getReport(req.user.uid, req.params.tripId);
  res.status(200).json({ status: 'success', data: report });
});
