import apiClient from '@/services/apiClient';

export const financeService = {
  getTripBudget: async (planId) => {
    const response = await apiClient.get(`/api/finance/${planId}/budget`);
    return response.data;
  },

  getTripExpenses: async (planId) => {
    const response = await apiClient.get(`/api/finance/${planId}/expenses`);
    return response.data;
  },

  addExpense: async (planId, expenseData) => {
    // expenseData: { category, amount, currency, notes, location, day_index }
    const response = await apiClient.post(`/api/finance/${planId}/expenses`, expenseData);
    return response.data;
  },

  getAiInsights: async (planId) => {
    const response = await apiClient.get(`/api/finance/${planId}/insights`);
    return response.data;
  },

  // Savings Module
  getSavingsGoal: async (planId) => {
    const response = await apiClient.get(`/api/finance/${planId}/savings`);
    return response.data;
  },
  
  updateSavings: async (planId, amount) => {
    const response = await apiClient.post(`/api/finance/${planId}/savings/contribute`, { amount });
    return response.data;
  }
};