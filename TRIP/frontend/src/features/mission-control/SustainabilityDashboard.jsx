import React from 'react';

/**
 * Sustainability Intelligence Dashboard
 * Visualizes the environmental and socioeconomic impact of the travel plan.
 */
const SustainabilityDashboard = () => {
  // Mock data from the SustainabilityScorer
  const metrics = {
    sustainabilityScore: 89.4,
    carbon: {
      total: 104.5,
      transport: 30.0,
      accommodation: 62.0,
      activities: 12.5
    },
    localImpact: {
      score: 88,
      businesses: 8,
      independent: 5,
      guides: 1
    },
    diversification: {
      score: 94,
      pressureReduction: "72%"
    }
  };

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen font-sans">
      <header className="mb-8 border-b border-slate-700 pb-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-emerald-400">Sustainability Intelligence</h1>
            <p className="text-slate-400">Environmental & Socioeconomic Impact Tracker</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-center shadow-lg">
             <div className="text-xs text-slate-400 uppercase tracking-wide font-bold">Sustainability Score</div>
             <div className="text-3xl font-bold text-emerald-400">{metrics.sustainabilityScore}</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Carbon Impact */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-rose-900/30 rounded-lg text-rose-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-200">Carbon Footprint</h2>
           </div>
           <div className="text-4xl font-bold text-rose-400 mb-6">{metrics.carbon.total} <span className="text-lg text-slate-500">kg CO₂</span></div>
           
           <div className="space-y-4">
             <div>
               <div className="flex justify-between text-xs text-slate-400 mb-1">
                 <span>Transport</span>
                 <span>{metrics.carbon.transport} kg</span>
               </div>
               <div className="w-full bg-slate-700 rounded-full h-1.5">
                 <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: '28%' }}></div>
               </div>
             </div>
             <div>
               <div className="flex justify-between text-xs text-slate-400 mb-1">
                 <span>Accommodation</span>
                 <span>{metrics.carbon.accommodation} kg</span>
               </div>
               <div className="w-full bg-slate-700 rounded-full h-1.5">
                 <div className="bg-rose-400 h-1.5 rounded-full" style={{ width: '60%' }}></div>
               </div>
             </div>
             <div>
               <div className="flex justify-between text-xs text-slate-400 mb-1">
                 <span>Activities</span>
                 <span>{metrics.carbon.activities} kg</span>
               </div>
               <div className="w-full bg-slate-700 rounded-full h-1.5">
                 <div className="bg-rose-300 h-1.5 rounded-full" style={{ width: '12%' }}></div>
               </div>
             </div>
           </div>
        </div>

        {/* Local Economy Benefit */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-900/30 rounded-lg text-amber-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-200">Local Economy</h2>
           </div>
           <div className="text-4xl font-bold text-amber-400 mb-6">{metrics.localImpact.score} <span className="text-lg text-slate-500">/100</span></div>
           
           <ul className="space-y-3">
             <li className="flex justify-between items-center p-2 bg-slate-900 rounded border border-slate-700">
               <span className="text-sm text-slate-400">Local Businesses Supported</span>
               <span className="font-bold text-amber-300">{metrics.localImpact.businesses}</span>
             </li>
             <li className="flex justify-between items-center p-2 bg-slate-900 rounded border border-slate-700">
               <span className="text-sm text-slate-400">Independent Vendors</span>
               <span className="font-bold text-amber-300">{metrics.localImpact.independent}</span>
             </li>
             <li className="flex justify-between items-center p-2 bg-slate-900 rounded border border-slate-700">
               <span className="text-sm text-slate-400">Local Guides Employed</span>
               <span className="font-bold text-amber-300">{metrics.localImpact.guides}</span>
             </li>
           </ul>
        </div>

        {/* Tourism Pressure Reduction */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
           <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-cyan-900/30 rounded-lg text-cyan-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-200">Tourism Diversification</h2>
           </div>
           <div className="text-4xl font-bold text-cyan-400 mb-6">{metrics.diversification.pressureReduction} <span className="text-lg text-slate-500">Shifted</span></div>
           
           <div className="p-4 bg-cyan-900/20 border border-cyan-900/50 rounded-lg text-sm text-cyan-200 mb-4">
             This itinerary successfully diverts {metrics.diversification.pressureReduction} of the travel duration away from overcrowded, high-pressure tourist hubs.
           </div>

           <div className="text-xs text-slate-400 uppercase tracking-wide font-bold mb-2">Diversification Score</div>
           <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="bg-cyan-400 h-2 rounded-full" style={{ width: `${metrics.diversification.score}%` }}></div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default SustainabilityDashboard;
