import { BudgetService } from './service.js';
import { createBudgetSchema, updateBudgetSchema } from './schemas.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const createBudget = catchAsync(async (req, res, next) => {
  const validatedData = createBudgetSchema.parse(req.body);
  const budget = await BudgetService.createBudget(req.user.uid, validatedData);
  res.status(201).json({ status: 'success', data: budget });
});

export const getBudget = catchAsync(async (req, res, next) => {
  const budget = await BudgetService.getBudget(req.user.uid, req.params.tripId);
  res.status(200).json({ status: 'success', data: budget });
});

export const updateBudget = catchAsync(async (req, res, next) => {
  const validatedData = updateBudgetSchema.parse(req.body);
  const budget = await BudgetService.updateBudget(req.user.uid, req.params.tripId, validatedData);
  res.status(200).json({ status: 'success', data: budget });
});

export const deleteBudget = catchAsync(async (req, res, next) => {
  await BudgetService.deleteBudget(req.user.uid, req.params.tripId);
  res.status(200).json({ status: 'success', message: 'Budget deleted' });
});

export const getForecast = catchAsync(async (req, res, next) => {
  const forecast = await BudgetService.getForecast(req.user.uid, req.params.tripId);
  res.status(200).json({ status: 'success', data: forecast });
});

export const getHealth = catchAsync(async (req, res, next) => {
  const health = await BudgetService.getHealth(req.user.uid, req.params.tripId);
  res.status(200).json({ status: 'success', data: health });
});
