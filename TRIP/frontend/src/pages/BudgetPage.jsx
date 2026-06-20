import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, IndianRupee, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const expenseData = [
  { name: 'Accommodation', value: 72000, color: '#3b82f6' },
  { name: 'Flights', value: 48000, color: '#8b5cf6' },
  { name: 'Food', value: 27000, color: '#10b981' },
  { name: 'Activities', value: 18000, color: '#f59e0b' },
  { name: 'Transport', value: 9000, color: '#ef4444' },
];

const dailyData = [
  { day: 'Day 1', amount: 7200 },
  { day: 'Day 2', amount: 4800 },
  { day: 'Day 3', amount: 15000 },
  { day: 'Day 4', amount: 5400 },
  { day: 'Day 5', amount: 9000 },
  { day: 'Day 6', amount: 4200 },
  { day: 'Day 7', amount: 12000 },
];

export function BudgetPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Budget Analytics</h1>
            <p className="text-neutral-500 mt-1">Track your travel expenses and remaining budget</p>
          </div>
          <select className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 shadow-sm">
            <option>All Trips</option>
            <option>Kyoto, Japan</option>
            <option>Santorini, Greece</option>
          </select>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800" />
              <div className="h-96 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800" />
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Total Budget</p>
                    <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">₹3,00,000</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-500 font-medium flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> On Track</span>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Spent So Far</p>
                    <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">₹1,74,000</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center">
                    <IndianRupee className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-neutral-500">58% of total budget</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2 mt-3">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '58%' }}></div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-neutral-500">Remaining</p>
                    <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">₹1,26,000</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                    <PieChartIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-500 font-medium flex items-center"><TrendingDown className="w-4 h-4 mr-1" /> Excellent</span>
                  <span className="text-neutral-500 ml-2">~₹18,000/day available</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Category Breakdown Pie Chart */}
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">Expense Breakdown</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        itemStyle={{ color: '#171717', fontWeight: 600 }}
                        formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                  {expenseData.map((category) => (
                    <div key={category.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <div>
                        <p className="text-xs text-neutral-500">{category.name}</p>
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white">₹{category.value.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Spending Bar Chart */}
              <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">Daily Spending</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Spent']}
                      />
                      <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
