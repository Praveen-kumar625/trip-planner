import React from 'react';

/**
 * Destination Command Center Dashboard
 * Used by State/District Tourism Boards to monitor Destination Intelligence.
 */
const DestinationCommandCenter = () => {
  const healthData = {
    destination: "Jabalpur",
    healthScore: 87,
    pressureLevel: "Moderate",
    sustainabilityScore: 91,
    growthPotential: 84
  };

  const leakageData = {
    localRetention: 72,
    externalLeakage: 28,
    recommendation: "Increase promotion of local transport operators."
  };

  const flowData = [
    { origin: "Indore", percentage: 35 },
    { origin: "Bhopal", percentage: 28 },
    { origin: "Delhi", percentage: 15 }
  ];

  const benchmarks = [
    { name: "Jabalpur", health: 87, pressure: 78, rev: "+12%", color: "text-blue-400 font-bold" },
    { name: "Udaipur", health: 82, pressure: 95, rev: "+8%", color: "text-slate-400" },
    { name: "Shimla", health: 65, pressure: 99, rev: "+2%", color: "text-slate-400" },
    { name: "Mysore", health: 88, pressure: 70, rev: "+15%", color: "text-slate-400" },
  ];

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen font-sans">
      <header className="mb-8 border-b border-slate-700 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-blue-400">Destination Intelligence</h1>
          <p className="text-slate-400">Strategic Command Center for {healthData.destination}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-center shadow-lg">
           <div className="text-xs text-slate-400 uppercase tracking-wide font-bold">Health Score™</div>
           <div className="text-3xl font-bold text-blue-400">{healthData.healthScore}</div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Economic Leakage */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">Economic Leakage</h2>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
               <div className="text-sm text-slate-400 mb-1">Local Retention</div>
               <div className="text-2xl font-bold text-emerald-400">{leakageData.localRetention}%</div>
            </div>
            <div className="flex-1 border-l border-slate-600 pl-4">
               <div className="text-sm text-slate-400 mb-1">External Leakage</div>
               <div className="text-2xl font-bold text-rose-400">{leakageData.externalLeakage}%</div>
            </div>
          </div>
          <div className="p-3 bg-blue-900/20 border border-blue-900/50 rounded text-sm text-blue-300">
             <strong>AI Insight:</strong> {leakageData.recommendation}
          </div>
        </div>

        {/* Visitor Flow */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">Visitor Flow Origins</h2>
          <div className="space-y-4">
             {flowData.map((f, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{f.origin}</span>
                    <span className="text-slate-400">{f.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div className="bg-indigo-400 h-1.5 rounded-full" style={{ width: `${f.percentage}%` }}></div>
                  </div>
                </div>
             ))}
          </div>
        </div>

        {/* Benchmarking */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">Competitive Benchmark</h2>
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="text-slate-500 border-b border-slate-700">
                <th className="pb-2">City</th>
                <th className="pb-2">Health</th>
                <th className="pb-2">Pressure</th>
                <th className="pb-2">Rev</th>
              </tr>
            </thead>
            <tbody>
              {benchmarks.map((b, i) => (
                 <tr key={i} className={`border-b border-slate-700/50 ${b.color}`}>
                   <td className="py-2">{b.name}</td>
                   <td className="py-2">{b.health}</td>
                   <td className="py-2">{b.pressure}</td>
                   <td className="py-2">{b.rev}</td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default DestinationCommandCenter;
