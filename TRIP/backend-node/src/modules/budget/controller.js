import { BudgetService } from './service.js';
import { createBudgetSchema, updateBudgetSchema } from './schemas.js';

export const createBudget = async (req, res, next) => {
  try {
    const validatedData = createBudgetSchema.parse(req.body);
    const budget = await BudgetService.createBudget(req.user.uid, validatedData);
    res.status(201).json({ status: 'success', data: budget });
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ status: 'error', errors: error.errors });
    next(error);
  }
};

export const getBudget = async (req, res, next) => {
  try {
    const budget = await BudgetService.getBudget(req.user.uid, req.params.tripId);
    res.status(200).json({ status: 'success', data: budget });
  } catch (error) {
    next(error);
  }
};

export const updateBudget = async (req, res, next) => {
  try {
    const validatedData = updateBudgetSchema.parse(req.body);
    const budget = await BudgetService.updateBudget(req.user.uid, req.params.tripId, validatedData);
    res.status(200).json({ status: 'success', data: budget });
  } catch (error) {
    if (error.name === 'ZodError') return res.status(400).json({ status: 'error', errors: error.errors });
    next(error);
  }
};

export const deleteBudget = async (req, res, next) => {
  try {
    await BudgetService.deleteBudget(req.user.uid, req.params.tripId);
    res.status(200).json({ status: 'success', message: 'Budget deleted' });
  } catch (error) {
    next(error);
  }
};

export const getForecast = async (req, res, next) => {
  try {
    const forecast = await BudgetService.getForecast(req.user.uid, req.params.tripId);
    res.status(200).json({ status: 'success', data: forecast });
  } catch (error) {
    next(error);
  }
};

export const getHealth = async (req, res, next) => {
  try {
    const health = await BudgetService.getHealth(req.user.uid, req.params.tripId);
    res.status(200).json({ status: 'success', data: health });
  } catch (error) {
    next(error);
  }
};
