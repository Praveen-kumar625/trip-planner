import React, { useState } from 'react';

/**
 * Adaptive Planning Dashboard
 * Visualizes the autonomous replanning loop (Simulated Annealing) triggered by live disruptions.
 */
const AdaptivePlanningDashboard = () => {
  // Mock State for Demo
  const [adaptiveState, setAdaptiveState] = useState({
    currentTripScore: 82,
    riskScore: 65, // Spiked due to rain
    resilienceScore: 85,
    adaptabilityScore: 92,
  });

  const timeline = [
    { step: 'Alert Detected', detail: 'Heavy Rain Alert (14:00 - 18:00)', active: true, done: true },
    { step: 'Impact Calculated', detail: 'Travel Score -12, Fatigue +18', active: true, done: true },
    { step: 'Optimization Started', detail: 'Simulated Annealing active...', active: true, done: true },
    { step: 'Digital Twin Validation', detail: 'Validating new route fatigue limits.', active: true, done: true },
    { step: 'Route Updated', detail: 'Indoor activities swapped.', active: true, done: true },
  ];

  const beforeAfter = [
    { time: '14:30', original: 'Roman Forum (Outdoor)', updated: 'Pantheon (Indoor)', status: 'Re-routed' },
    { time: '16:00', original: 'Colosseum (Outdoor)', updated: 'Vatican Museums (Indoor)', status: 'Re-routed' },
  ];

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen font-sans">
      <header className="mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-indigo-400">Autonomous Travel Intelligence</h1>
        <p className="text-slate-400">Live Disruption Detection & Simulated Annealing Re-routing</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Section 1: Travel Health KPIs */}
        <div className="col-span-1 lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Trip Score" value={adaptiveState.currentTripScore} color="text-green-400" />
          <MetricCard title="Risk Alert" value="High" color="text-red-500" blink />
          <MetricCard title="Resilience" value={`${adaptiveState.resilienceScore}%`} color="text-indigo-400" />
          <MetricCard title="Adaptability" value={`${adaptiveState.adaptabilityScore}%`} color="text-blue-400" />
        </div>

        {/* Section 4: Replanning Timeline */}
        <div className="col-span-1 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-slate-200">Replanning Loop</h2>
          <div className="space-y-4">
            {timeline.map((t, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${t.done ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'bg-slate-600'}`}></div>
                  {idx !== timeline.length - 1 && <div className="w-0.5 h-10 bg-slate-700 mt-1"></div>}
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${t.done ? 'text-indigo-400' : 'text-slate-400'}`}>{t.step}</h3>
                  <p className="text-xs text-slate-300 mt-1">{t.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Before vs After */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">Optimized Route Comparison</h2>
            <div className="flex justify-between items-center bg-indigo-900/30 p-4 rounded-lg border border-indigo-900/50 mb-4">
               <div>
                 <div className="text-xs text-indigo-400 uppercase tracking-wide font-bold">Optimization Gain</div>
                 <div className="text-xl font-mono text-white">+15 Travel Score</div>
               </div>
               <div className="text-right">
                 <div className="text-xs text-indigo-400 uppercase tracking-wide font-bold">Time Saved</div>
                 <div className="text-xl font-mono text-white">90 mins</div>
               </div>
            </div>
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3 text-red-400">Original (Disrupted)</th>
                  <th className="p-3 text-green-400">Optimized (Annealed)</th>
                </tr>
              </thead>
              <tbody>
                {beforeAfter.map((row, i) => (
                  <tr key={i} className="border-b border-slate-700/50">
                    <td className="p-3 font-medium text-slate-400">{row.time}</td>
                    <td className="p-3 line-through text-slate-500">{row.original}</td>
                    <td className="p-3 font-bold text-green-400">{row.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 5: AI Explanation Panel */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">AI Mediator Explanation</h2>
            <div className="p-4 bg-slate-900 rounded-lg border border-indigo-900/50 flex gap-4 items-start">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-slate-300 text-sm mb-2 font-medium">Re-routed due to Heavy Rain alert (High severity).</p>
                <p className="text-slate-400 text-sm">By swapping outdoor heritage sites with geographically adjacent indoor alternatives, the simulated annealing engine recovered 15 Travel Score points and prevented severe fatigue spikes.</p>
                <div className="mt-3 inline-block bg-indigo-900/50 text-indigo-300 text-xs px-2 py-1 rounded border border-indigo-700/50">
                  Confidence: 95%
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const MetricCard = ({ title, value, color, blink }) => (
  <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col justify-center items-center text-center shadow-lg relative overflow-hidden">
    {blink && <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>}
    <h3 className="text-sm text-slate-400 mb-2 uppercase tracking-wider">{title}</h3>
    <div className={`text-3xl font-bold ${color}`}>{value}</div>
  </div>
);

export default AdaptivePlanningDashboard;
