import { ExpenseRepository } from './repository.js';
import { TripRepository } from '../trips/repository.js';

export class ExpenseService {
  static async createExpense(userId, data) {
    // Verify trip ownership
    const trip = await TripRepository.getById(data.tripId);
    if (!trip || trip.userId !== userId) {
      throw Object.assign(new Error('Trip not found or unauthorized'), { statusCode: 404 });
    }

    const expenseData = { ...data, userId };
    return await ExpenseRepository.create(null, expenseData);
  }

  static async getExpenses(userId, tripId) {
    // Verify trip ownership
    const trip = await TripRepository.getById(tripId);
    if (!trip || trip.userId !== userId) {
      throw Object.assign(new Error('Trip not found or unauthorized'), { statusCode: 404 });
    }
    
    return await ExpenseRepository.getExpensesByTripId(userId, tripId);
  }

  static async getExpenseById(userId, expenseId) {
    const expense = await ExpenseRepository.getById(expenseId);
    if (!expense || expense.userId !== userId) {
      throw Object.assign(new Error('Expense not found'), { statusCode: 404 });
    }
    return expense;
  }

  static async updateExpense(userId, expenseId, data) {
    await this.getExpenseById(userId, expenseId); // Verify ownership
    return await ExpenseRepository.update(expenseId, data);
  }

  static async deleteExpense(userId, expenseId) {
    await this.getExpenseById(userId, expenseId); // Verify ownership
    return await ExpenseRepository.delete(expenseId);
  }

  static async getReport(userId, tripId) {
    const expenses = await this.getExpenses(userId, tripId);
    
    const report = {
      totalAmount: 0,
      currency: expenses.length > 0 ? expenses[0].currency : 'INR', // Simplistic assumption, ignoring conversion
      byCategory: {}
    };

    expenses.forEach(exp => {
      report.totalAmount += exp.amount;
      if (!report.byCategory[exp.category]) {
        report.byCategory[exp.category] = 0;
      }
      report.byCategory[exp.category] += exp.amount;
    });

    return report;
  }
}
