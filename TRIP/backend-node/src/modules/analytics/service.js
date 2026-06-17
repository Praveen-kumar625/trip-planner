import { TripRepository } from '../trips/repository.js';
import { ExpenseRepository } from '../expenses/repository.js';

export class AnalyticsService {
  static async getDashboardStats(userId) {
    const trips = await TripRepository.getTripsByUser(userId);
    
    let totalSpent = 0;
    let upcomingTrips = 0;
    let completedTrips = 0;

    for (const trip of trips) {
      if (trip.status === 'completed') completedTrips++;
      if (trip.status === 'upcoming' || trip.status === 'planning') upcomingTrips++;
      
      const expenses = await ExpenseRepository.getExpensesByTripId(userId, trip.id);
      totalSpent += expenses.reduce((sum, exp) => sum + exp.amount, 0);
    }

    return {
      totalTrips: trips.length,
      upcomingTrips,
      completedTrips,
      totalSpent,
      currency: 'INR' // Assuming default for now
    };
  }

  static async getTripAnalytics(userId, tripId) {
    // Basic wrapper, real app would have charts and daily burn rates
    const expenses = await ExpenseRepository.getExpensesByTripId(userId, tripId);
    
    const dailyAverage = expenses.length > 0 ? 
      expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length : 0; // Simplified
      
    return {
      totalExpenses: expenses.length,
      dailyAverage
    };
  }
}
