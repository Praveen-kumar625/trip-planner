import { useEffect } from 'react';
import { IndianRupee, PieChart, Plus, Wallet } from 'lucide-react';
import { useFinanceStore } from '../../../store/financeStore';

export const BudgetTracker = ({ tripId }) => {
  const { budget, expenses, isLoading, fetchTripFinance } = useFinanceStore();

  useEffect(() => {
    if (tripId) {
      fetchTripFinance(tripId);
    }
  }, [tripId, fetchTripFinance]);

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>;
  }

  const totalBudget = budget?.totalAmount || 0;
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = totalBudget - totalSpent;
  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
          <Wallet className="w-5 h-5 mr-2 text-amber-500" />
          Trip Budget
        </h2>
        <button className="p-2 text-amber-600 bg-amber-50 dark:bg-amber-900/30 rounded-lg hover:bg-amber-100 transition-colors">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Budget</p>
          <div className="flex items-center mt-1">
            <IndianRupee className="w-5 h-5 text-slate-900 dark:text-white" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{totalBudget.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
          <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">Remaining</p>
          <div className="flex items-center mt-1">
            <IndianRupee className="w-5 h-5 text-amber-700 dark:text-amber-300" />
            <span className="text-2xl font-bold text-amber-700 dark:text-amber-300">{remaining.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-8">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-slate-600 dark:text-slate-300">Spent: ₹{totalSpent.toLocaleString('en-IN')}</span>
          <span className="text-slate-600 dark:text-slate-300">{Math.min(spentPercentage, 100).toFixed(1)}%</span>
        </div>
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${
              spentPercentage > 90 ? 'bg-red-500' : spentPercentage > 75 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(spentPercentage, 100)}%` }}
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
          <PieChart className="w-4 h-4 mr-2" />
          Recent Expenses
        </h3>
        <div className="space-y-3">
          {expenses.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No expenses recorded yet.</p>
          ) : (
            expenses.slice(0, 5).map(expense => (
              <div key={expense.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400 font-semibold">
                    {expense.category.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{expense.title}</p>
                    <p className="text-xs text-slate-500">{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  ₹{expense.amount.toLocaleString('en-IN')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
