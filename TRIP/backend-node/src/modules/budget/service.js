import { BudgetRepository } from './repository.js';
import { TripRepository } from '../trips/repository.js';
import { logger } from '../../utils/logger.js';

export class BudgetService {
  static async createBudget(userId, data) {
    // Verify trip ownership
    const trip = await TripRepository.getById(data.tripId);
    if (!trip || trip.userId !== userId) {
      throw Object.assign(new Error('Trip not found or unauthorized'), { statusCode: 404 });
    }

    // Ensure budget doesn't already exist
    const existing = await BudgetRepository.getBudgetByTripId(userId, data.tripId);
    if (existing) {
      throw Object.assign(new Error('Budget already exists for this trip'), { statusCode: 400 });
    }

    const budgetData = {
      ...data,
      userId,
      spentAmount: 0,
      alerts: []
    };

    return await BudgetRepository.create(null, budgetData);
  }

  static async getBudget(userId, tripId) {
    const budget = await BudgetRepository.getBudgetByTripId(userId, tripId);
    if (!budget) {
      throw Object.assign(new Error('Budget not found'), { statusCode: 404 });
    }
    return budget;
  }

  static async updateBudget(userId, tripId, data) {
    const budget = await this.getBudget(userId, tripId);
    return await BudgetRepository.update(budget.id, data);
  }

  static async deleteBudget(userId, tripId) {
    const budget = await this.getBudget(userId, tripId);
    return await BudgetRepository.delete(budget.id);
  }

  static async getForecast(userId, tripId) {
    const budget = await this.getBudget(userId, tripId);
    // Placeholder for AI/Analytics forecasting logic
    const forecast = {
      projectedTotal: budget.totalAmount * 0.95, // Optimistic forecast
      currency: budget.currency,
      insight: 'You are trending 5% under budget based on current daily average.'
    };
    return forecast;
  }

  static async getHealth(userId, tripId) {
    const budget = await this.getBudget(userId, tripId);
    const ratio = budget.spentAmount / budget.totalAmount;
    
    let healthScore = 'Excellent';
    if (ratio > 0.9) healthScore = 'Critical';
    else if (ratio > 0.75) healthScore = 'Warning';
    else if (ratio > 0.5) healthScore = 'Good';

    return {
      score: healthScore,
      spentPercentage: (ratio * 100).toFixed(2),
      remainingAmount: budget.totalAmount - budget.spentAmount,
      currency: budget.currency
    };
  }
}
