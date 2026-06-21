import React from 'react';

/**
 * Recommendation Intelligence Dashboard
 * Visualizes the outputs of Phase 3B: Recommendation + Graph + Seasonality + XAI
 */
const RecommendationDashboard = () => {
  // Mock State for SIH Demo
  const topRec = {
    destination: "Tirthan Valley",
    confidence: 93,
    dnaMatch: 95,
    hiddenGemScore: 92,
    graphSimilarity: 88,
    seasonality: 96,
    budgetMatch: 98,
    reasons: [
      "Matches Nature Seeker persona perfectly",
      "High Hidden Gem Score (Low Tourism Pressure)",
      "Loved by travelers with similar graph embeddings",
      "Compatible with current October shoulder season"
    ]
  };

  const alternatives = [
    { name: "Spiti Valley", type: "Backup Choice", match: 89 },
    { name: "Jibhi", type: "Budget Choice", match: 85 },
    { name: "Hampta Pass", type: "Adventure Choice", match: 82 }
  ];

  const graphData = [
    { label: "Users Similar To You", value: 142 },
    { label: "Trips Similar To Yours", value: 38 },
    { label: "Shared Graph Nodes", value: 56 }
  ];

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen font-sans">
      <header className="mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-fuchsia-400">Recommendation Intelligence Engine</h1>
        <p className="text-slate-400">Context Fusion, Travel Graph Similarity & Explainable AI (XAI)</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Section 1: Top Recommendation */}
        <div className="col-span-1 lg:col-span-3 bg-gradient-to-r from-fuchsia-900/40 to-slate-800 p-6 rounded-xl border border-fuchsia-500/30 shadow-lg flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-fuchsia-400 uppercase tracking-widest mb-1">Top Computed Match</h2>
            <h1 className="text-5xl font-black text-white drop-shadow-md">{topRec.destination}</h1>
            <div className="mt-4 flex gap-3">
               <span className="px-3 py-1 bg-green-900/50 text-green-400 text-xs font-bold rounded-full border border-green-700/50">DNA: {topRec.dnaMatch}%</span>
               <span className="px-3 py-1 bg-emerald-900/50 text-emerald-400 text-xs font-bold rounded-full border border-emerald-700/50">Gem Score: {topRec.hiddenGemScore}</span>
               <span className="px-3 py-1 bg-indigo-900/50 text-indigo-400 text-xs font-bold rounded-full border border-indigo-700/50">Graph: {topRec.graphSimilarity}%</span>
            </div>
          </div>
          <div className="mt-6 md:mt-0 flex flex-col items-center justify-center p-6 bg-slate-900/80 rounded-full border-4 border-fuchsia-500 shadow-[0_0_20px_rgba(217,70,239,0.4)] w-40 h-40">
            <span className="text-4xl font-bold text-white">{topRec.confidence}%</span>
            <span className="text-xs text-fuchsia-400 uppercase tracking-wider mt-1">Confidence</span>
          </div>
        </div>

        {/* Section 2: Recommendation Breakdown */}
        <div className="col-span-1 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-slate-200">Recommendation Matrix</h2>
          <div className="space-y-4">
            <ProgressBar label="Travel DNA Match" value={topRec.dnaMatch} color="bg-green-500" />
            <ProgressBar label="Graph Similarity" value={topRec.graphSimilarity} color="bg-indigo-500" />
            <ProgressBar label="Seasonality Match" value={topRec.seasonality} color="bg-yellow-500" />
            <ProgressBar label="Digital Twin Compat." value={94} color="bg-blue-500" />
            <ProgressBar label="Budget Alignment" value={topRec.budgetMatch} color="bg-emerald-500" />
          </div>
        </div>

        {/* Section 3: Explainability Tree */}
        <div className="col-span-1 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🧠</div>
          <h2 className="text-xl font-semibold mb-4 text-slate-200">Explainable AI (XAI)</h2>
          <p className="text-xs text-slate-400 mb-6">Why TPOS selected {topRec.destination}:</p>
          <ul className="space-y-3">
            {topRec.reasons.map((reason, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <span className="text-fuchsia-400 mt-1">↳</span>
                <span className="text-sm text-slate-300">{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 4 & 5: Alternatives & Graph Explorer */}
        <div className="col-span-1 flex flex-col gap-6">
          {/* Alternatives */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">Intelligent Alternatives</h2>
            <div className="space-y-3">
              {alternatives.map((alt, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-700/50">
                  <div>
                    <div className="text-sm font-bold text-white">{alt.name}</div>
                    <div className="text-xs text-slate-400">{alt.type}</div>
                  </div>
                  <div className="text-fuchsia-400 font-mono text-sm">{alt.match}% Match</div>
                </div>
              ))}
            </div>
          </div>

          {/* Graph Similarity Explorer */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h2 className="text-sm font-semibold mb-4 text-indigo-400 uppercase tracking-wider">Travel Intelligence Graph</h2>
            <div className="grid grid-cols-3 gap-2 text-center">
              {graphData.map((data, idx) => (
                <div key={idx} className="bg-slate-900 p-2 rounded">
                  <div className="text-xl font-bold text-white">{data.value}</div>
                  <div className="text-[10px] text-slate-400 uppercase mt-1 leading-tight">{data.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const ProgressBar = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-xs text-slate-300 mb-1">
      <span>{label}</span>
      <span className="font-mono">{value}%</span>
    </div>
    <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

export default RecommendationDashboard;
