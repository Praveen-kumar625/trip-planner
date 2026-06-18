import { useFinanceStore } from '../../../store/financeStore';
import { IndianRupee, TrendingDown, TrendingUp } from 'lucide-react';

export const ExpenseAnalytics = () => {
  const { expenses, budget } = useFinanceStore();

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  const totalSpent = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);
  const categories = Object.keys(expensesByCategory).sort((a, b) => expensesByCategory[b] - expensesByCategory[a]);

  // Colors for categories
  const categoryColors = {
    Flights: 'bg-blue-500',
    Accommodation: 'bg-amber-500',
    Food: 'bg-emerald-500',
    Transport: 'bg-amber-500',
    Activities: 'bg-orange-500',
    Shopping: 'bg-pink-500',
    Other: 'bg-slate-500'
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Spending Analytics</h2>

      {totalSpent === 0 ? (
        <div className="text-center py-8 text-slate-500 dark:text-slate-400">
          No data to analyze yet.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Chart Area (Flex bars) */}
          <div className="flex h-32 rounded-xl overflow-hidden gap-1">
            {categories.map((cat) => {
              const amount = expensesByCategory[cat];
              const percentage = (amount / totalSpent) * 100;
              return (
                <div
                  key={cat}
                  style={{ width: `${percentage}%` }}
                  className={`${categoryColors[cat] || categoryColors.Other} h-full relative group cursor-pointer transition-all hover:opacity-90`}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 transition-opacity pointer-events-none">
                    {cat}: ₹{amount.toLocaleString('en-IN')} ({percentage.toFixed(1)}%)
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${categoryColors[cat] || categoryColors.Other}`} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{cat}</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  ₹{expensesByCategory[cat].toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
          
          {/* Insights */}
          {budget && (
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl ${totalSpent > budget.totalAmount ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {totalSpent > budget.totalAmount ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {totalSpent > budget.totalAmount ? 'Over Budget' : 'On Track'}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {totalSpent > budget.totalAmount 
                      ? `You are over your budget by ₹${(totalSpent - budget.totalAmount).toLocaleString('en-IN')}.` 
                      : `You have ₹${(budget.totalAmount - totalSpent).toLocaleString('en-IN')} remaining.`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
