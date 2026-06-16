import { create } from 'zustand';

// Ivy Wallet style data structures for comprehensive finance tracking
export const useFinanceStore = create((set, get) => ({
  budget: {
    total: 50000,
    currency: 'INR',
    spent: 12500,
  },
  
  categories: [
    { id: 'flights', name: 'Flights', color: '#0284C7', icon: '✈️', spent: 8000, budget: 15000 },
    { id: 'hotels', name: 'Stays', color: '#D97706', icon: '🏨', spent: 3000, budget: 12000 },
    { id: 'food', name: 'Dining', color: '#059669', icon: '🍛', spent: 1000, budget: 10000 },
    { id: 'transport', name: 'Transport', color: '#7C3AED', icon: '🚕', spent: 500, budget: 5000 },
  ],

  expenses: [
    { id: 1, title: 'Indigo Flight to Goa', amount: 8000, category: 'flights', date: '2023-10-12', notes: 'Round trip' },
    { id: 2, title: 'Taj Exotica Deposit', amount: 3000, category: 'hotels', date: '2023-10-15', notes: '2 nights' },
    { id: 3, title: 'Fishermans Wharf', amount: 1000, category: 'food', date: '2023-11-01', notes: 'Dinner' },
    { id: 4, title: 'Airport Taxi', amount: 500, category: 'transport', date: '2023-11-01', notes: 'Prepaid' },
  ],

  addExpense: (expense) => set((state) => {
    const newExpense = { ...expense, id: Date.now() };
    const newSpent = state.budget.spent + expense.amount;
    
    const newCategories = state.categories.map(cat => 
      cat.id === expense.category 
        ? { ...cat, spent: cat.spent + expense.amount }
        : cat
    );

    return {
      expenses: [newExpense, ...state.expenses],
      budget: { ...state.budget, spent: newSpent },
      categories: newCategories
    };
  }),
}));
