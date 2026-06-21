import React, { useState, useEffect } from 'react';

/**
 * Digital Twin Dashboard
 * The core visualizer for the Journey Load Index (JLI) and Fatigue predictions.
 * Critical demo asset for showcasing operations research intelligence.
 */
const DigitalTwinDashboard = () => {
  // Mock Data for Phase 2B Demo
  const [simulationState, setSimulationState] = useState({
    status: 'Simulating...',
    progress: 30,
    dayScore: 82,
    feasibility: 'Feasible',
    comfort: 76,
    fatigue: 44,
    simulationConfidence: 87, // Based on Data Quality & Freshness
  });

  const timeline = [
    { time: '08:00', activity: 'Departure', jli: 15, fatigue: 5, risk: 'Low' },
    { time: '09:30', activity: 'Colosseum Tour', jli: 65, fatigue: 35, risk: 'Moderate' },
    { time: '11:00', activity: 'Roman Forum (Walking)', jli: 85, fatigue: 75, risk: 'High' },
    { time: '13:00', activity: 'Lunch Recovery', jli: 10, fatigue: 45, risk: 'Low' },
    { time: '15:00', activity: 'Vatican Museums', jli: 70, fatigue: 82, risk: 'Severe' },
    { time: '18:00', activity: 'Hotel Check-In', jli: 5, fatigue: 60, risk: 'Low' },
  ];

  const recommendations = [
    "Move 'Vatican Museums' to 09:00 AM to avoid peak crowd density (JLI impact: -30)",
    "Reduce walking distance between Colosseum and Forum by 1.2km (Take Transit)",
    "Add a 45-minute recovery period at 14:30 before next activity",
    "Extreme heat predicted at 15:00. Shift outdoor activities."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSimulationState(prev => ({
        ...prev,
        progress: Math.min(100, prev.progress + 15),
        status: prev.progress >= 85 ? 'Simulation Complete' : 'Simulating JLI factors...',
      }));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen font-sans">
      <header className="mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-cyan-400">Digital Twin Simulator</h1>
        <p className="text-slate-400">Journey Load Index (JLI) & Predictive Fatigue Modeling</p>
      </header>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-1 text-slate-300">
          <span>{simulationState.status}</span>
          <span>{simulationState.progress}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2">
          <div className="bg-cyan-500 h-2 rounded-full transition-all duration-500" style={{ width: `${simulationState.progress}%` }}></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Section 1: Journey Health Metrics */}
        <div className="col-span-1 lg:col-span-3 grid grid-cols-2 md:grid-cols-5 gap-4">
          <MetricCard title="Feasibility" value={simulationState.feasibility} color="text-green-400" />
          <MetricCard title="Day Score" value={simulationState.dayScore} color="text-cyan-400" />
          <MetricCard title="Peak Fatigue" value={`${simulationState.fatigue}%`} color="text-orange-400" />
          <MetricCard title="Comfort Index" value={`${simulationState.comfort}%`} color="text-purple-400" />
          <MetricCard title="Confidence" value={`${simulationState.simulationConfidence}%`} color="text-emerald-400" />
        </div>

        {/* Section 2: Journey Timeline */}
        <div className="col-span-1 lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-slate-200">Simulated Timeline</h2>
          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-600 before:to-transparent">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-600 bg-slate-800 text-slate-400 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 text-xs">
                  {item.time}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-900 p-4 rounded border border-slate-700 shadow">
                  <h3 className="font-bold text-slate-200">{item.activity}</h3>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-cyan-400">JLI: {item.jli}</span>
                    <span className="text-orange-400">Fatigue: {item.fatigue}</span>
                    <span className={item.risk === 'Severe' || item.risk === 'High' ? 'text-red-400' : 'text-green-400'}>Risk: {item.risk}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: AI Recommendations */}
        <div className="col-span-1 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">AI Mitigation Strategies</h2>
          <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
            {recommendations.map((rec, i) => (
              <div key={i} className="p-4 bg-slate-900 rounded-lg border border-slate-700 text-sm flex gap-3 items-start">
                <span className="text-cyan-500 mt-0.5">⚡</span>
                <p className="text-slate-300 leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

const MetricCard = ({ title, value, color }) => (
  <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col justify-center items-center text-center shadow-lg">
    <h3 className="text-sm text-slate-400 mb-2 uppercase tracking-wider">{title}</h3>
    <div className={`text-3xl font-bold ${color}`}>{value}</div>
  </div>
);

export default DigitalTwinDashboard;
