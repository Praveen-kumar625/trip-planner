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
    <div className="min-h-screen bg-[#080D17] p-4 md:p-8 selection:bg-primary-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-light text-white tracking-wide">Budget <span className="font-serif italic text-primary-400">Analytics</span></h1>
            <p className="text-white/50 mt-2 font-serif italic text-lg">Track your travel expenses and remaining budget</p>
          </div>
          <select className="glass-dark border border-white/20 rounded-lg px-4 py-2 text-sm font-bold text-white shadow-premium hover:border-white/40 outline-none uppercase tracking-wider">
            <option className="bg-[#080D17]">All Trips</option>
            <option className="bg-[#080D17]">Kyoto, Japan</option>
            <option className="bg-[#080D17]">Santorini, Greece</option>
          </select>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <div key={i} className="h-32 glass-dark rounded-2xl border border-white/10" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 glass-dark rounded-2xl border border-white/10" />
              <div className="h-96 glass-dark rounded-2xl border border-white/10" />
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
              <div className="glass-dark p-6 rounded-3xl border border-white/10 shadow-premium flex flex-col justify-between hover:border-white/30 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/50">Total Budget</p>
                    <h3 className="text-3xl font-display font-light text-white mt-1 tracking-wide">₹3,00,000</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-inner">
                    <Wallet className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div className="mt-6 flex items-center text-sm">
                  <span className="text-green-400 font-bold tracking-wide flex items-center"><TrendingUp className="w-4 h-4 mr-1" /> On Track</span>
                </div>
              </div>

              <div className="glass-dark p-6 rounded-3xl border border-white/10 shadow-premium flex flex-col justify-between hover:border-white/30 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/50">Spent So Far</p>
                    <h3 className="text-3xl font-display font-light text-white mt-1 tracking-wide">₹1,74,000</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shadow-inner">
                    <IndianRupee className="w-5 h-5 text-orange-400" />
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-3 text-sm">
                  <div className="flex justify-between items-center text-white/50 font-bold uppercase tracking-wider text-xs">
                    <span>58% spent</span>
                    <span>42% left</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: '58%' }}></div>
                  </div>
                </div>
              </div>

              <div className="glass-premium p-6 rounded-3xl border border-primary-500/20 shadow-premium-lg flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50" />
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/50">Remaining</p>
                    <h3 className="text-3xl font-display font-light text-primary-400 mt-1 tracking-wide">₹1,26,000</h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center shadow-inner">
                    <PieChartIcon className="w-5 h-5 text-green-400" />
                  </div>
                </div>
                <div className="mt-6 flex items-center text-sm relative z-10">
                  <span className="text-green-400 font-bold tracking-wide flex items-center"><TrendingDown className="w-4 h-4 mr-1" /> Excellent</span>
                  <span className="text-white/40 ml-2 font-serif italic">~₹18,000/day available</span>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Category Breakdown Pie Chart */}
              <div className="glass-dark p-8 rounded-3xl border border-white/10 shadow-premium">
                <h3 className="text-xl font-display font-light text-white mb-8 tracking-wide">Expense Breakdown</h3>
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
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: '#fff', fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}
                        formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-8">
                  {expenseData.map((category) => (
                    <div key={category.name} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-white/50">{category.name}</p>
                        <p className="text-base font-display text-white mt-0.5">₹{category.value.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Spending Bar Chart */}
              <div className="glass-dark p-8 rounded-3xl border border-white/10 shadow-premium">
                <h3 className="text-xl font-display font-light text-white mb-8 tracking-wide">Daily Spending</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)', fontWeight: 600 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)', fontWeight: 600 }} tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)' }}
                        itemStyle={{ color: '#fff', fontWeight: 600, fontFamily: 'Outfit, sans-serif' }}
                        formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Spent']}
                      />
                      <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={24} />
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
