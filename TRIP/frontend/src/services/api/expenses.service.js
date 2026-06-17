import apiClient from './apiClient';

export const expensesService = {
  getExpensesByTrip: async (tripId) => {
    return apiClient.get(`/expenses/trip/${tripId}`);
  },

  addExpense: async (expenseData) => {
    return apiClient.post('/expenses', expenseData);
  },

  updateExpense: async (id, expenseData) => {
    return apiClient.put(`/expenses/${id}`, expenseData);
  },

  deleteExpense: async (id) => {
    return apiClient.delete(`/expenses/${id}`);
  }
};
