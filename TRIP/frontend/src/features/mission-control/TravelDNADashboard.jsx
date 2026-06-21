import React, { useState, useEffect } from 'react';

/**
 * Travel DNA Dashboard
 * Mission Control UI visualizing the learning engine and persistent persona tracking.
 */
const TravelDNADashboard = () => {
  // Mock Data demonstrating the self-learning DNA outputs
  const [dnaState, setDnaState] = useState({
    primaryPersona: "Nature Seeker",
    secondaryPersona: "Photographer",
    confidence: 91,
    predictedDestination: "Spiti Valley",
    predictionConfidence: 84,
    reasons: ["Nature affinity", "Photography affinity", "Previous mountain trips"]
  });

  const radarData = [
    { label: 'Adventure', value: 85 },
    { label: 'Luxury', value: 30 },
    { label: 'Nature', value: 92 },
    { label: 'Food', value: 55 },
    { label: 'Culture', value: 60 },
    { label: 'Photography', value: 88 },
    { label: 'Budget', value: 75 },
    { label: 'Comfort', value: 45 }
  ];

  const affinities = [
    { label: 'Mountains', value: 92, color: 'bg-emerald-500' },
    { label: 'Wildlife', value: 83, color: 'bg-emerald-400' },
    { label: 'Adventure Sports', value: 85, color: 'bg-orange-500' },
    { label: 'Food Experiences', value: 78, color: 'bg-yellow-500' },
    { label: 'Historical Sites', value: 60, color: 'bg-amber-600' },
    { label: 'Road Trips', value: 55, color: 'bg-slate-400' },
    { label: 'Spiritual', value: 45, color: 'bg-purple-400' },
    { label: 'Beaches', value: 41, color: 'bg-cyan-500' },
  ];

  const timeline = [
    { date: '10 mins ago', event: 'Viewed article: "Top 10 Himalayan Treks"', impact: 'Mountain Affinity +2' },
    { date: '2 days ago', event: 'Completed Trip: Meghalaya Backpacking', impact: 'Adventure Score +5' },
    { date: '1 week ago', event: 'Booked Photography Workshop', impact: 'Secondary Persona shifted to Photographer' },
    { date: '1 month ago', event: 'Saved: Zanskar Valley', impact: 'Added to pgvector embeddings' },
  ];

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen font-sans">
      <header className="mb-8 border-b border-slate-700 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-emerald-400">Travel DNA Intelligence</h1>
          <p className="text-slate-400">Persistent Behavior Tracking & Vector Embeddings</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400 uppercase">DNA Confidence</div>
          <div className="text-2xl font-mono text-emerald-400 font-bold">{dnaState.confidence}%</div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Section 1: Identity & Prediction */}
        <div className="col-span-1 flex flex-col gap-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h2 className="text-sm uppercase tracking-wider text-slate-400 mb-2">Traveler Identity</h2>
            <div className="text-2xl font-bold text-emerald-400 mb-1">{dnaState.primaryPersona}</div>
            <div className="text-lg text-slate-300">/ {dnaState.secondaryPersona}</div>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex-1">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">Predicted Next Trip</h2>
            <div className="bg-slate-900 p-4 rounded-lg border border-emerald-900/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 text-emerald-500 font-mono text-sm">{dnaState.predictionConfidence}% Match</div>
              <div className="text-2xl font-bold text-white mb-3 mt-4">{dnaState.predictedDestination}</div>
              <ul className="space-y-2">
                {dnaState.reasons.map((reason, i) => (
                  <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section 2 & 3: Radar & Affinity Matrix */}
        <div className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-slate-200">DNA Radar Metrics</h2>
            <div className="space-y-3">
              {radarData.map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="font-mono text-emerald-400">{item.value}</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${item.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-slate-200">Affinity Matrix</h2>
            <div className="space-y-3">
              {affinities.map(item => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-24 text-xs text-slate-300 truncate">{item.label}</div>
                  <div className="flex-1 bg-slate-700 rounded-full h-3 flex items-center">
                    <div className={`h-3 rounded-full ${item.color}`} style={{ width: `${item.value}%` }}></div>
                  </div>
                  <div className="w-8 text-right font-mono text-xs text-slate-400">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Section 4: Behavior Timeline */}
        <div className="col-span-1 lg:col-span-3 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-slate-200">Behavior Timeline & Vector Updates</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {timeline.map((item, idx) => (
              <div key={idx} className="bg-slate-900 p-4 rounded border border-slate-700">
                <div className="text-xs text-slate-500 mb-2">{item.date}</div>
                <div className="text-sm font-medium text-slate-200 mb-2">{item.event}</div>
                <div className="text-xs text-emerald-400 flex items-center gap-1">
                  <span>↳</span> {item.impact}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TravelDNADashboard;
