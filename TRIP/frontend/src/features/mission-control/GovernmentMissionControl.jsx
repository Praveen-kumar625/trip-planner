import React from 'react';

/**
 * Government Mission Control Dashboard
 * The highest level of SIH intelligence for policy makers and emergency responders.
 */
const GovernmentMissionControl = () => {
  const policies = [
    { objective: "Reduce Congestion", rec: "Implement dynamic congestion pricing.", impact: "-18% peak volume" },
    { objective: "Local Retention", rec: "Mandate 15% local procurement quota.", impact: "+12% local retention" }
  ];

  const deployments = [
    { type: "Police Patrols", location: "Bhedaghat", qty: "+3 Teams", reason: "Weekend surge (140% capacity)" },
    { type: "Medical Units", location: "Kanha Gates", qty: "+1 Unit", reason: "High risk demographics" }
  ];

  const emergency = {
    status: "Active Alert",
    type: "Extreme Heatwave",
    impacted: 1450,
    action: "SSE Replanning Triggered - Rerouting to indoor corridors."
  };

  return (
    <div className="p-6 bg-slate-950 text-slate-100 min-h-screen font-sans border-t-4 border-red-600">
      <header className="mb-8 border-b border-slate-800 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-red-500 uppercase">Government Command Center</h1>
          <p className="text-slate-400 tracking-widest text-sm uppercase">Decision Intelligence Platform</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded text-center">
             <div className="text-xs text-slate-500">National Visitors</div>
             <div className="text-2xl font-bold text-white">1.4M</div>
           </div>
           <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded text-center">
             <div className="text-xs text-slate-500">Global Health Score</div>
             <div className="text-2xl font-bold text-emerald-400">84</div>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Emergency & Climate */}
        <div className="bg-rose-950/20 p-6 rounded-xl border border-rose-900 shadow-lg">
          <h2 className="text-xl font-bold text-rose-500 mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
            Emergency & Climate Intelligence
          </h2>
          <div className="bg-rose-900/30 p-4 rounded border border-rose-800 mb-4">
            <div className="text-rose-400 font-bold mb-1">{emergency.type}</div>
            <div className="text-sm text-slate-300 mb-3">{emergency.action}</div>
            <div className="text-xs text-rose-300 font-mono">Affected Active Tourists: {emergency.impacted}</div>
          </div>
        </div>

        {/* Resource Allocation */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
          <h2 className="text-xl font-bold text-blue-500 mb-4">Predictive Resource Allocation</h2>
          <div className="space-y-3">
            {deployments.map((d, i) => (
              <div key={i} className="flex justify-between items-center bg-slate-800 p-3 rounded border border-slate-700">
                <div>
                  <div className="font-bold text-slate-200">{d.type} <span className="text-blue-400 ml-2">{d.qty}</span></div>
                  <div className="text-xs text-slate-400">Loc: {d.location}</div>
                </div>
                <div className="text-xs text-slate-500 max-w-xs text-right">{d.reason}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Policy Recommendations */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg lg:col-span-2">
          <h2 className="text-xl font-bold text-fuchsia-500 mb-4">AI Policy Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {policies.map((p, i) => (
                <div key={i} className="bg-slate-800 p-4 rounded border border-slate-700">
                  <div className="text-sm font-bold text-fuchsia-400 mb-2">{p.objective}</div>
                  <div className="text-sm text-slate-300 mb-3">{p.rec}</div>
                  <div className="text-xs font-mono text-emerald-400 bg-emerald-900/20 inline-block px-2 py-1 rounded">
                    Expected Impact: {p.impact}
                  </div>
                </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GovernmentMissionControl;
