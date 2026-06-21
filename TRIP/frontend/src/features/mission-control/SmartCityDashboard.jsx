import React from 'react';

/**
 * Smart City Analytics Dashboard (Phase 4B)
 * Used by City Administrators & Tourism Boards to monitor macro-level tourism intelligence.
 */
const SmartCityDashboard = () => {
  const demandData = {
    date: '2026-06-27 (Weekend)',
    expectedVisitors: '18,900',
    trend: 'Peak Demand (+14% WoW)',
    estimatedRevenue: '$1.25M'
  };

  const pressureZones = [
    { name: 'Mall Road', score: 92, status: 'Critical', color: 'bg-rose-500' },
    { name: 'Jakhoo Temple', score: 78, status: 'High', color: 'bg-orange-500' },
    { name: 'Ridge', score: 65, status: 'Moderate', color: 'bg-yellow-500' },
    { name: 'Mashobra', score: 34, status: 'Optimal', color: 'bg-emerald-500' },
  ];

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen font-sans">
      <header className="mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-blue-400">Smart City Analytics</h1>
        <p className="text-slate-400">Tourism Intelligence Cloud - Urban Command Center</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* KPI Cards */}
        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
          <div className="text-xs text-slate-400 uppercase font-bold mb-1">Expected Visitors (Next 72h)</div>
          <div className="text-3xl font-bold text-blue-400">{demandData.expectedVisitors}</div>
          <div className="text-xs text-emerald-400 mt-2">{demandData.trend}</div>
        </div>

        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
          <div className="text-xs text-slate-400 uppercase font-bold mb-1">Economic Injection</div>
          <div className="text-3xl font-bold text-emerald-400">{demandData.estimatedRevenue}</div>
          <div className="text-xs text-slate-400 mt-2">Local Economy Benefit</div>
        </div>

        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
          <div className="text-xs text-slate-400 uppercase font-bold mb-1">Critical Choke Points</div>
          <div className="text-3xl font-bold text-rose-400">2</div>
          <div className="text-xs text-slate-400 mt-2">Active AI diversions running</div>
        </div>

        <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-lg">
          <div className="text-xs text-slate-400 uppercase font-bold mb-1">API Requests</div>
          <div className="text-3xl font-bold text-indigo-400">45.2K</div>
          <div className="text-xs text-slate-400 mt-2">Tourism Intelligence Cloud</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tourism Pressure Monitor */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-slate-200">Live Tourism Pressure</h2>
          <div className="space-y-6">
            {pressureZones.map((zone, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-semibold text-slate-300">{zone.name}</span>
                  <span className="text-slate-400">Load: {zone.score}/100</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div className={`${zone.color} h-2 rounded-full`} style={{ width: `${zone.score}%` }}></div>
                </div>
                <div className={`text-xs mt-1 ${zone.score > 80 ? 'text-rose-400' : 'text-slate-500'}`}>
                  Status: {zone.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Intelligence / AI Copilot Mock */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-between">
           <div>
             <h2 className="text-xl font-semibold mb-4 text-slate-200">AI City Copilot</h2>
             <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-300 mb-4">
               <span className="text-indigo-400 font-bold">Query:</span> "Which destinations are overcrowded right now?"
             </div>
             <div className="p-4 bg-indigo-900/20 border border-indigo-900/50 rounded-lg text-sm text-indigo-200 leading-relaxed">
               <span className="font-bold text-indigo-400">Copilot:</span> <strong>Mall Road</strong> is currently at critical pressure (92/100).
               <br/><br/>
               <span className="font-bold text-emerald-400">Recommendation:</span> Redirecting incoming TPOS users to alternative hidden gems like <strong>Mashobra</strong> and <strong>Naldehra</strong> via the Adaptive Replanning Engine to balance the city load.
             </div>
           </div>
           
           <button className="mt-6 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-semibold transition">
             Execute City-Wide Diversion
           </button>
        </div>
      </div>
    </div>
  );
};

export default SmartCityDashboard;
