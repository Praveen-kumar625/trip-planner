import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { useFinanceStore } from '../../store/financeStore';

export function BudgetTracker() {
  const { budget, categories, expenses } = useFinanceStore();

  const spentPercentage = (budget.spent / budget.total) * 100;
  const isOverBudget = spentPercentage > 100;

  return (
    <div className="space-y-6">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Budget Card */}
        <motion.div 
          className="bg-primary-900 border-2 border-primary-800 rounded-3xl p-6 shadow-solid relative overflow-hidden"
          whileHover={{ y: -5 }}
        >
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Wallet className="w-48 h-48 text-accent-500" />
          </div>
          <p className="text-primary-300 font-bold mb-1 uppercase tracking-widest text-sm">Total Budget</p>
          <h2 className="text-4xl font-black text-white flex items-center gap-2">
            ₹{budget.total.toLocaleString()}
          </h2>
          <div className="mt-6">
            <div className="flex justify-between text-sm font-bold mb-2">
              <span className="text-primary-200">Spent: ₹{budget.spent.toLocaleString()}</span>
              <span className="text-accent-500">Left: ₹{(budget.total - budget.spent).toLocaleString()}</span>
            </div>
            <div className="h-3 bg-primary-950 rounded-full overflow-hidden">
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: Math.min(spentPercentage, 100) / 100 }}
                style={{ transformOrigin: 'left' }}
                className={`h-full w-full rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-accent-500'}`}
              />
            </div>
          </div>
        </motion.div>

        {/* AI Insight Card */}
        <motion.div 
          className="bg-primary-950 border-2 border-primary-800 rounded-3xl p-6 shadow-solid flex flex-col justify-center"
          whileHover={{ y: -5 }}
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent-500/20 text-accent-500 rounded-2xl">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-primary-300 font-bold mb-1 uppercase tracking-widest text-sm">AI Insight</p>
              <p className="text-white font-medium text-lg leading-snug">
                You are spending 15% less on stays than average travelers to this destination. Great job!
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Categories */}
      <h3 className="text-2xl font-black text-white font-serif mt-8 mb-4">Categories</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <motion.div 
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            className="bg-primary-900 border border-primary-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-solid"
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-3 shadow-inner" style={{ backgroundColor: `${cat.color}20` }}>
              {cat.icon}
            </div>
            <h4 className="text-white font-bold mb-1">{cat.name}</h4>
            <p className="text-primary-300 text-sm font-semibold">₹{cat.spent.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Expenses */}
      <h3 className="text-2xl font-black text-white font-serif mt-8 mb-4">Recent Expenses</h3>
      <div className="bg-primary-900 border border-primary-800 rounded-3xl overflow-hidden shadow-solid">
        {expenses.slice(0, 5).map((exp, index) => {
          const category = categories.find(c => c.id === exp.category);
          return (
            <div 
              key={exp.id} 
              className={`p-4 flex items-center justify-between hover:bg-primary-800 transition-colors ${
                index !== expenses.length - 1 ? 'border-b border-primary-800' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-primary-950">
                  {category?.icon || '💸'}
                </div>
                <div>
                  <p className="text-white font-bold">{exp.title}</p>
                  <p className="text-primary-400 text-xs font-semibold">{exp.date} • {category?.name}</p>
                </div>
              </div>
              <p className="text-white font-black">₹{exp.amount.toLocaleString()}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
