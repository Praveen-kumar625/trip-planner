import { create } from 'zustand';
import { budgetService } from '../services/api/budget.service';
import { expensesService } from '../services/api/expenses.service';

export const useFinanceStore = create((set, get) => ({
  budget: null,
  expenses: [],
  isLoading: false,
  error: null,

  fetchTripFinance: async (tripId) => {
    set({ isLoading: true, error: null });
    try {
      const [budgetRes, expensesRes] = await Promise.all([
        budgetService.getBudgetByTrip(tripId),
        expensesService.getExpensesByTrip(tripId)
      ]);
      set({ 
        budget: budgetRes.data, 
        expenses: expensesRes.data, 
        isLoading: false 
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  addExpense: async (expenseData) => {
    set({ isLoading: true });
    try {
      const response = await expensesService.addExpense(expenseData);
      set((state) => ({ 
        expenses: [...state.expenses, response.data],
        isLoading: false 
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteExpense: async (id) => {
    set({ isLoading: true });
    try {
      await expensesService.deleteExpense(id);
      set((state) => ({
        expenses: state.expenses.filter(e => e.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
}));
