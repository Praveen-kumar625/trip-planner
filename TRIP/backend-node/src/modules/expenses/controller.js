import { ExpenseService } from './service.js';
import { createExpenseSchema, updateExpenseSchema } from './schemas.js';

export const createExpense = async (req, res, next) => {
  try {
    const validatedData = createExpenseSchema.parse(req.body);
    const expense = await ExpenseService.createExpense(req.user.uid, validatedData);
    res.status(201).json({ status: 'success', data: expense });
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ status: 'error', errors: error.errors });
    next(error);
  }
};

export const getExpenses = async (req, res, next) => {
  try {
    const expenses = await ExpenseService.getExpenses(req.user.uid, req.params.tripId);
    res.status(200).json({ status: 'success', data: expenses });
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    const validatedData = updateExpenseSchema.parse(req.body);
    const expense = await ExpenseService.updateExpense(req.user.uid, req.params.expenseId, validatedData);
    res.status(200).json({ status: 'success', data: expense });
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ status: 'error', errors: error.errors });
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    await ExpenseService.deleteExpense(req.user.uid, req.params.expenseId);
    res.status(200).json({ status: 'success', message: 'Expense deleted' });
  } catch (error) {
    next(error);
  }
};

export const getReport = async (req, res, next) => {
  try {
    const report = await ExpenseService.getReport(req.user.uid, req.params.tripId);
    res.status(200).json({ status: 'success', data: report });
  } catch (error) {
    next(error);
  }
};
