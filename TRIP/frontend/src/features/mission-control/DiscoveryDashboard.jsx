import React, { useState } from 'react';

/**
 * Discovery Intelligence Dashboard
 * Visualizes DBSCAN clusters, Tourism Pressure, and Hidden Gem Rankings.
 */
const DiscoveryDashboard = () => {
  // Mock Data for Demo
  const [pipelineState, setPipelineState] = useState({
    poisScanned: 1245,
    clustersFormed: 14,
    gemsIdentified: 18,
    avgTourismPressure: 62 // 0-100 (High score = low pressure = sustainable)
  });

  const clusterData = [
    { id: '1 (Mall Road)', type: 'Tourist Trap', density: 'High', pressure: 15, nodes: 142 },
    { id: '2 (Old Manali)', type: 'Moderate Zone', density: 'Medium', pressure: 45, nodes: 64 },
    { id: 'NOISE (Outliers)', type: 'Isolated Gems', density: 'Low', pressure: 92, nodes: 28 },
  ];

  const hiddenGems = [
    { name: 'Jogni Waterfall Trek Start', score: 96, auth: 98, localEcon: 95, pressure: 99 },
    { name: 'Sethan Village Igloo Stay', score: 94, auth: 95, localEcon: 90, pressure: 96 },
    { name: 'Hampta Pass Base', score: 89, auth: 92, localEcon: 85, pressure: 88 },
  ];

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen font-sans">
      <header className="mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-emerald-400">Discovery Intelligence Engine</h1>
        <p className="text-slate-400">DBSCAN Spatial Analysis & Sustainable Hidden Gem Scoring</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KPI Section */}
        <div className="col-span-1 lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="POIs Analyzed" value={pipelineState.poisScanned} color="text-slate-200" />
          <MetricCard title="DBSCAN Clusters" value={pipelineState.clustersFormed} color="text-indigo-400" />
          <MetricCard title="Gems Discovered" value={pipelineState.gemsIdentified} color="text-emerald-400" />
          <MetricCard title="Sustainability Index" value={`${pipelineState.avgTourismPressure}%`} color="text-green-400" />
        </div>

        {/* DBSCAN Visualization Panel */}
        <div className="col-span-1 lg:col-span-1 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-slate-200">DBSCAN Clustering</h2>
          <div className="space-y-4">
            {clusterData.map((cluster, idx) => (
              <div key={idx} className="p-4 bg-slate-900 rounded-lg border border-slate-700/50">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-slate-200">Cluster {cluster.id}</h3>
                  <span className={`text-xs px-2 py-1 rounded font-semibold ${cluster.type === 'Tourist Trap' ? 'bg-red-900/50 text-red-400' : cluster.type === 'Moderate Zone' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-emerald-900/50 text-emerald-400'}`}>
                    {cluster.type}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Nodes: {cluster.nodes}</span>
                  <span>Sustainability: {cluster.pressure}%</span>
                </div>
                {/* Visual Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div className={`h-full ${cluster.type === 'Tourist Trap' ? 'bg-red-500' : cluster.type === 'Moderate Zone' ? 'bg-yellow-500' : 'bg-emerald-500'}`} style={{ width: `${cluster.pressure}%`}}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-xs text-slate-500 bg-slate-900/50 p-3 rounded">
            <strong>Engine:</strong> eps=1.5km, minPts=3. Isolated points classified as NOISE are pipelined into the Gem Ranker.
          </div>
        </div>

        {/* Hidden Gems Rankings */}
        <div className="col-span-1 lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">Top Ranked Hidden Gems</h2>
          <table className="w-full text-left text-sm text-slate-300 mt-4">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-3">Location Name</th>
                <th className="p-3">Authenticity</th>
                <th className="p-3">Local Econ</th>
                <th className="p-3 text-emerald-400 font-bold">Hidden Gem Score</th>
              </tr>
            </thead>
            <tbody>
              {hiddenGems.map((gem, i) => (
                <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                  <td className="p-3 font-medium text-slate-200">{gem.name}</td>
                  <td className="p-3">{gem.auth}%</td>
                  <td className="p-3">{gem.localEcon}%</td>
                  <td className="p-3 font-mono text-emerald-400 text-lg">{gem.score}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Breakdown / Explanation */}
          <div className="mt-8 p-5 bg-emerald-900/20 border border-emerald-900/50 rounded-lg">
            <h3 className="text-emerald-400 font-bold mb-2">Algorithm Breakdown: Jogni Waterfall Trek</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-3">
              <div><span className="text-slate-400">Rev Quality (25%):</span> <span className="text-white">95/100</span></div>
              <div><span className="text-slate-400">Authenticity (20%):</span> <span className="text-white">98/100</span></div>
              <div><span className="text-slate-400">Accessibility (15%):</span> <span className="text-white">80/100</span></div>
              <div><span className="text-slate-400">Sustainability (15%):</span> <span className="text-white">99/100</span></div>
              <div><span className="text-slate-400">Local Econ (15%):</span> <span className="text-white">95/100</span></div>
              <div><span className="text-slate-400">Pop Inversion (10%):</span> <span className="text-white">100/100</span></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const MetricCard = ({ title, value, color }) => (
  <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col justify-center items-center text-center shadow-lg">
    <h3 className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">{title}</h3>
    <div className={`text-4xl font-bold ${color}`}>{value}</div>
  </div>
);

export default DiscoveryDashboard;
