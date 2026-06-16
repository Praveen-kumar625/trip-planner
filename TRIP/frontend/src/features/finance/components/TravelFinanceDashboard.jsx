import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Wallet, TrendingUp, AlertCircle, Plus, Receipt, Plane, Coffee, Map, ShoppingBag } from 'lucide-react';
import { useTripFinance } from '../hooks/useTripFinance';

// Luxury India-First Color Palette for Finance
const CHART_COLORS = ['#2E3192', '#FF9933', '#10b981', '#00A4B4', '#c94f5f', '#8c816f'];

const CATEGORY_ICONS = {
  flights: Plane,
  food: Coffee,
  transport: Map,
  shopping: ShoppingBag,
  default: Receipt
};

export function TravelFinanceDashboard({ planId }) {
  const { 
    budget, 
    expenses, 
    loading, 
    addExpense, 
    healthScore,
    aiInsights 
  } = useTripFinance(planId);

  const [showAddExpense, setShowAddExpense] = useState(false);

  if (loading) return <div className="animate-pulse h-64 bg-surface-100 rounded-3xl" />;

  const totalSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remaining = budget.total_estimated - totalSpent;
  const utilization = Math.min((totalSpent / budget.total_estimated) * 100, 100);

  // Group expenses for chart
  const groupedExpenses = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});
  
  const chartData = Object.keys(groupedExpenses).map(key => ({
    name: key,
    value: groupedExpenses[key]
  }));

  return (
    <div className="space-y-8 w-full">
      {/* HEADER & HEALTH SCORE */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-serif font-medium text-ink-900 tracking-tight">Trip Finances</h2>
          <p className="text-sm font-semibold text-ink-500 uppercase tracking-widest mt-1">Real-time Budget Intelligence</p>
        </div>
        <div className="flex items-center gap-4 bg-white px-6 py-3 border border-ink-100 shadow-editorial">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-ink-500 font-bold">Budget Health</span>
            <span className={`text-xl font-bold ${healthScore > 80 ? 'text-nature-600' : healthScore > 50 ? 'text-accent-500' : 'text-brand-500'}`}>
              {healthScore}/100
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-surface-100 flex items-center justify-center relative">
             <svg className="absolute inset-0 w-full h-full transform -rotate-90">
               <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-surface-100" />
               <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="125" strokeDashoffset={125 - (125 * healthScore) / 100} className={healthScore > 80 ? 'text-nature-500' : 'text-brand-500'} />
             </svg>
          </div>
        </div>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-editorial bg-primary-900 text-white border-none">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><Wallet className="w-5 h-5 text-accent-400" /></div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary-200">Estimated</span>
          </div>
          <div className="text-3xl font-sans font-bold">₹{budget.total_estimated.toLocaleString('en-IN')}</div>
          <div className="text-sm font-medium text-primary-300 mt-2">AI Generated Baseline</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card-editorial bg-white">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-brand-600" /></div>
            <span className="text-xs font-bold uppercase tracking-widest text-ink-400">Spent</span>
          </div>
          <div className="text-3xl font-sans font-bold text-ink-900">₹{totalSpent.toLocaleString('en-IN')}</div>
          <div className="w-full bg-surface-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-brand-500 h-full rounded-full transition-all duration-1000" style={{ width: `${utilization}%` }} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card-editorial bg-white">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-full bg-nature-50 flex items-center justify-center"><Receipt className="w-5 h-5 text-nature-600" /></div>
            <span className="text-xs font-bold uppercase tracking-widest text-ink-400">Remaining</span>
          </div>
          <div className={`text-3xl font-sans font-bold ${remaining < 0 ? 'text-brand-600' : 'text-nature-600'}`}>
            ₹{remaining.toLocaleString('en-IN')}
          </div>
          <div className="text-sm font-medium text-ink-500 mt-2">Available across {budget.days_remaining} days</div>
        </motion.div>
      </div>

      {/* AI INSIGHTS & CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card-editorial bg-white flex flex-col">
          <div className="flex justify-between items-center mb-8">
             <h3 className="font-serif font-medium text-xl text-ink-900">Expense Distribution</h3>
             <button onClick={() => setShowAddExpense(true)} className="btn-editorial py-2 px-4 text-xs gap-2">
               <Plus className="w-4 h-4" /> Log Expense
             </button>
          </div>
          
          <div className="flex-1 flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value}`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full md:w-1/2 space-y-4">
              {chartData.map((data, idx) => (
                <div key={data.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                    <span className="text-sm font-bold text-ink-700 capitalize">{data.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-ink-900">₹{data.value.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI TRAVEL FINANCE INSIGHTS */}
        <div className="card-editorial bg-paper-dark border-accent-300 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-accent-400/10 rounded-full blur-[40px] pointer-events-none" />
           <h3 className="font-serif font-medium text-xl text-ink-900 mb-6 flex items-center gap-2">
             <Sparkles className="w-5 h-5 text-accent-500" /> AI Insights
           </h3>
           <div className="space-y-4 relative z-10">
             {aiInsights.map((insight, i) => (
               <div key={i} className="bg-white p-4 border border-ink-100 shadow-sm flex items-start gap-3">
                 <AlertCircle className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                 <p className="text-sm text-ink-700 font-medium leading-relaxed">{insight.message}</p>
               </div>
             ))}
             {aiInsights.length === 0 && (
               <p className="text-sm text-ink-500 italic">No budget anomalies detected. You are tracking perfectly.</p>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}