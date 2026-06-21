import React, { useState } from 'react';

/**
 * Enterprise AI Copilot Dashboard
 * The primary conversational interface for Tourism Officers and Enterprise Executives.
 */
const EnterpriseCopilotDashboard = () => {
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'user',
      text: 'Which areas in Jabalpur are overcrowded right now?'
    },
    {
      role: 'ai',
      text: 'Bhedaghat is currently experiencing a critical Pressure Score of 89.\n\n**Recommendation:**\nPromote Lamheta\nPromote Bargi Eco Circuit\nPromote Tilwara Corridor',
      metrics: { impact: "+14% visitor distribution" }
    }
  ]);

  const kpis = [
    { label: 'Tourism Revenue', value: '$2.4M', trend: '+12%' },
    { label: 'Pressure Index', value: '78/100', trend: 'High' },
    { label: 'Destination Health', value: '87/100', trend: 'Stable' },
    { label: 'Visitor Growth', value: '+14%', trend: 'MoM' }
  ];

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen font-sans flex flex-col md:flex-row gap-6">
      
      {/* Sidebar: KPIs & Forecasts */}
      <div className="w-full md:w-1/3 flex flex-col gap-6">
         <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
           <h2 className="text-xl font-bold text-fuchsia-400 mb-4">Executive KPIs</h2>
           <div className="grid grid-cols-2 gap-4">
             {kpis.map((kpi, i) => (
                <div key={i} className="bg-slate-900 p-3 rounded-lg border border-slate-700">
                  <div className="text-xs text-slate-400 mb-1">{kpi.label}</div>
                  <div className="text-lg font-bold text-slate-200">{kpi.value}</div>
                  <div className="text-xs text-emerald-400">{kpi.trend}</div>
                </div>
             ))}
           </div>
         </div>

         <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex-grow">
           <h2 className="text-xl font-bold text-fuchsia-400 mb-4">Forecast Center</h2>
           <div className="space-y-4">
              <div className="p-3 border-l-2 border-emerald-500 bg-slate-900 rounded-r-lg">
                <div className="text-sm font-semibold text-emerald-400">Demand Forecast</div>
                <div className="text-xs text-slate-400 mt-1">Expected 15% drop in 3 weeks (Monsoon).</div>
              </div>
              <div className="p-3 border-l-2 border-rose-500 bg-slate-900 rounded-r-lg">
                <div className="text-sm font-semibold text-rose-400">Risk Forecast</div>
                <div className="text-xs text-slate-400 mt-1">Flash flood warnings in low-lying corridors.</div>
              </div>
              <div className="p-3 border-l-2 border-blue-500 bg-slate-900 rounded-r-lg">
                <div className="text-sm font-semibold text-blue-400">Strategic Actions</div>
                <div className="text-xs text-slate-400 mt-1">Launch Monsoon Wellness Retreat campaign to stabilize revenue.</div>
              </div>
           </div>
         </div>
      </div>

      {/* Main Area: Copilot Chat */}
      <div className="w-full md:w-2/3 bg-slate-800 rounded-xl border border-slate-700 shadow-lg flex flex-col">
        <header className="p-6 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">Enterprise AI Copilot</h1>
            <p className="text-sm text-slate-400">Natural Language Intelligence & Analytics</p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-fuchsia-900/30 text-fuchsia-400 text-xs font-bold rounded-full border border-fuchsia-900/50">Analytics Agent Active</span>
            <span className="px-3 py-1 bg-emerald-900/30 text-emerald-400 text-xs font-bold rounded-full border border-emerald-900/50">Strategy Agent Active</span>
          </div>
        </header>

        <div className="flex-grow p-6 overflow-y-auto space-y-6">
          {chatHistory.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-xl p-4 ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-700 text-slate-200 rounded-tl-none border border-slate-600'}`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</div>
                {msg.metrics && (
                  <div className="mt-3 p-2 bg-slate-800 rounded border border-slate-600 text-xs text-emerald-400 font-mono">
                    Expected Impact: {msg.metrics.impact}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-700 bg-slate-900 rounded-b-xl flex gap-3">
          <input 
            type="text" 
            placeholder="Ask about destination health, revenue, or generate a report..." 
            className="flex-grow bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-fuchsia-500 transition"
          />
          <button className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-6 py-3 rounded-lg font-semibold transition">
            Ask AI
          </button>
        </div>
      </div>

    </div>
  );
};

export default EnterpriseCopilotDashboard;
