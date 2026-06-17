import apiClient from './apiClient';

export const budgetService = {
  getBudgetByTrip: async (tripId) => {
    return apiClient.get(`/budget/trip/${tripId}`);
  },

  createBudget: async (budgetData) => {
    return apiClient.post('/budget', budgetData);
  },

  updateBudget: async (id, budgetData) => {
    return apiClient.put(`/budget/${id}`, budgetData);
  },

  getBudgetHealth: async (tripId) => {
    return apiClient.get(`/budget/trip/${tripId}/health`);
  }
};
