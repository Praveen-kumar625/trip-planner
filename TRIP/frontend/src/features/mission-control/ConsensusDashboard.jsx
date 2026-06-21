import React, { useState } from 'react';

/**
 * Consensus Dashboard
 * Live interface demonstrating the mathematical resolution of group conflicts 
 * using Borda Count, Copeland Method, and Fairness algorithms.
 */
const ConsensusDashboard = () => {
  // Mock State reflecting what the SSE broadcast would look like
  const [consensusState, setConsensusState] = useState({
    agreementScore: 68,
    conflictScore: 82,
    fairnessScore: 88,
    confidence: 92,
    bordaWinner: "Mountains",
    leastSatisfiedUser: "User C",
  });

  const conflicts = [
    { type: 'Budget', desc: 'User A wants Luxury ($$$) but User C is Budget ($)', severity: 'High' },
    { type: 'Activity', desc: 'User B prefers Extreme Sports, User A prefers Spa', severity: 'Moderate' }
  ];

  const recommendations = [
    "Swap Activity B for a moderate hike to align with User B and A.",
    "Reduce Budget Difference by selecting mid-tier accommodation.",
    "Add Shared Food Experience (High overlap in Travel DNA)."
  ];

  const candidates = ["Beach", "Mountains", "Wildlife"];
  const matrix = [
    [0, 2, 1], // Beach vs Others
    [1, 0, 2], // Mountains vs Others
    [2, 1, 0]  // Wildlife vs Others
  ];

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen font-sans">
      <header className="mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-fuchsia-400">Consensus Intelligence</h1>
        <p className="text-slate-400">Mathematical Group Conflict Resolution & Fair Planning</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Section 1: Group Health KPI */}
        <div className="col-span-1 lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Agreement Score" value={`${consensusState.agreementScore}%`} color={consensusState.agreementScore > 70 ? 'text-green-400' : 'text-orange-400'} />
          <MetricCard title="Conflict Level" value={consensusState.conflictScore} color="text-red-400" />
          <MetricCard title="Fairness Index" value={`${consensusState.fairnessScore}%`} color="text-blue-400" />
          <MetricCard title="Current Winner (Borda)" value={consensusState.bordaWinner} color="text-fuchsia-400" />
        </div>

        {/* Section 2: Conflict Heatmap */}
        <div className="col-span-1 lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">Active Conflicts Detected</h2>
          <div className="space-y-3">
            {conflicts.map((c, i) => (
              <div key={i} className="p-4 bg-slate-900 rounded-lg border border-red-900/50 flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="text-sm font-bold text-red-400">{c.type}</span>
                  <span className="text-xs uppercase bg-red-900/30 text-red-300 px-2 py-0.5 rounded">{c.severity}</span>
                </div>
                <p className="text-slate-300 text-sm">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: AI Mediator */}
        <div className="col-span-1 lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">AI Mediator Proposals</h2>
          <p className="text-sm text-slate-400 mb-4">Recommendations generated using Copeland logic & DNA Affinities.</p>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div key={i} className="p-4 bg-slate-900 rounded-lg border border-fuchsia-900/50 flex gap-3 items-start">
                <span className="text-fuchsia-400">🤖</span>
                <p className="text-slate-300 text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Pairwise Matrix */}
        <div className="col-span-1 lg:col-span-4 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">Pairwise Preference Matrix</h2>
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-3">Candidate</th>
                {candidates.map(c => <th key={c} className="p-3">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {candidates.map((cRow, i) => (
                <tr key={cRow} className="border-b border-slate-700/50">
                  <td className="p-3 font-medium text-slate-200">{cRow}</td>
                  {candidates.map((cCol, j) => (
                    <td key={cCol} className={`p-3 ${i === j ? 'bg-slate-900/50 text-slate-600' : matrix[i][j] > matrix[j][i] ? 'text-green-400 font-bold' : 'text-slate-400'}`}>
                      {i === j ? '-' : matrix[i][j]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

const MetricCard = ({ title, value, color }) => (
  <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col justify-center items-center text-center shadow-lg">
    <h3 className="text-sm text-slate-400 mb-2 uppercase tracking-wider">{title}</h3>
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
  </div>
);

export default ConsensusDashboard;
