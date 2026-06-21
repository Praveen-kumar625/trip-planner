import React, { useState, useEffect } from 'react';

/**
 * Travel Command Center
 * Displays real-time ALNS optimization status, Trip Scores, and AI Activity.
 */
const TravelCommandCenter = () => {
  // Mock Data for Phase 2A Demo Readiness
  const [optimizationStatus, setOptimizationStatus] = useState({
    status: 'Optimizing...',
    iteration: 42,
    bestScore: 88.5
  });

  const [scores, setScores] = useState({
    tripScore: 88,
    budgetScore: 92,
    comfortScore: 85,
    riskScore: 12
  });

  const [aiFeed, setAiFeed] = useState([
    { id: 1, time: '10:42 AM', message: '🤖 PlannerAgent: Generated Travel Vector [Nature: High, Budget: Medium]' },
    { id: 2, time: '10:43 AM', message: '✂️ ALNS: Executed Worst Removal operator. Removed 2 inefficient nodes.' },
    { id: 3, time: '10:43 AM', message: '🧩 ALNS: Executed Best Fit Insertion. Re-routed via Coastal Highway.' },
    { id: 4, time: '10:44 AM', message: '📈 ScoringEngine: TripScore improved from 82.1 to 88.5' }
  ]);

  // Simulate incoming SSE events
  useEffect(() => {
    const timer = setInterval(() => {
      setOptimizationStatus(prev => ({
        ...prev,
        iteration: prev.iteration + 1,
        bestScore: prev.bestScore + (Math.random() * 0.5)
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen font-sans">
      <header className="mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-blue-400">Travel Command Center</h1>
        <p className="text-gray-400">Live Mission Feed & Optimization Status</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Scores Panel */}
        <div className="col-span-1 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Live KPIs</h2>
          <div className="space-y-4">
            <ScoreBar label="Master Trip Score" score={scores.tripScore} color="bg-blue-500" />
            <ScoreBar label="Budget Efficiency" score={scores.budgetScore} color="bg-green-500" />
            <ScoreBar label="Comfort Level" score={scores.comfortScore} color="bg-purple-500" />
            <ScoreBar label="Journey Risk" score={scores.riskScore} color="bg-red-500" />
          </div>
        </div>

        {/* ALNS Status Panel */}
        <div className="col-span-1 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">ALNS Optimization</h2>
          <div className="flex flex-col items-center justify-center h-48 bg-gray-900 rounded-lg border border-gray-700">
            <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">{optimizationStatus.status}</div>
            <div className="text-5xl font-mono text-green-400 font-bold mb-2">
              {optimizationStatus.bestScore.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">Iteration: {optimizationStatus.iteration}/100</div>
          </div>
        </div>

        {/* AI Activity Feed */}
        <div className="col-span-1 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">AI Activity Feed</h2>
          <div className="space-y-3 h-48 overflow-y-auto pr-2 custom-scrollbar">
            {aiFeed.map(feed => (
              <div key={feed.id} className="p-3 bg-gray-900 rounded-lg border border-gray-700 text-sm">
                <span className="text-xs text-gray-500 block mb-1">{feed.time}</span>
                <span className="text-gray-300 font-mono">{feed.message}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

const ScoreBar = ({ label, score, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-300">{label}</span>
      <span className="font-mono text-white">{score}</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${score}%` }}></div>
    </div>
  </div>
);

export default TravelCommandCenter;
