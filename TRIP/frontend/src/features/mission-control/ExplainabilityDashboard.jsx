import React, { useState } from 'react';

/**
 * Explainability Dashboard (XAI)
 * Surfaces the "Why" behind AI decisions. Exposes factor weights, logic traces, and alternatives.
 */
const ExplainabilityDashboard = () => {
  // Mock XAI Payload from the ExplainabilityEngine
  const xaiPayload = {
    action: "Recommend Tirthan Valley",
    confidence: 0.93,
    humanReadable: "This location strongly matches your Nature Seeker persona, has very low tourism pressure right now, and is highly rated by travelers with similar interests.",
    contributingFactors: [
      { factor: "Nature Affinity", weight: 0.25, score: 92, color: "bg-emerald-500" },
      { factor: "Hidden Gem Score", weight: 0.20, score: 88, color: "bg-blue-500" },
      { factor: "Community Graph Match", weight: 0.15, score: 85, color: "bg-indigo-500" },
      { factor: "Seasonality Optimal", weight: 0.10, score: 95, color: "bg-yellow-500" }
    ],
    alternatives: ["Jibhi", "Kalga", "Shangarh"],
    trace: {
      flow: [
        { step: "Input Analysis", description: "Parsed constraints and user preferences.", status: "ok" },
        { step: "Travel DNA Match", description: "Matched user against Persona Database.", status: "ok" },
        { step: "Graph Similarity", description: "Found 14 similar travelers.", status: "ok" },
        { step: "Hidden Gem Discovery", description: "Identified 3 high-authenticity, low-pressure locations.", status: "ok" },
        { step: "Ranking Engine", description: "Scored alternatives based on Formula v2.", status: "ok" },
        { step: "Final Selection", description: "Selected Tirthan Valley with 93% confidence.", status: "ok" }
      ],
      executionTimeMs: 145
    }
  };

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen font-sans">
      <header className="mb-8 border-b border-slate-700 pb-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-fuchsia-400">Explainable AI (XAI) Layer</h1>
            <p className="text-slate-400">Trust, Transparency, and Algorithmic Accountability</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-center shadow-lg">
             <div className="text-xs text-slate-400 uppercase tracking-wide font-bold">Total Confidence</div>
             <div className="text-3xl font-bold text-fuchsia-400">{(xaiPayload.confidence * 100).toFixed(0)}%</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Section 1: The Decision & Why */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold mb-2 text-slate-200">{xaiPayload.action}</h2>
            <p className="text-slate-300 bg-slate-900/50 p-4 rounded-lg border border-slate-700 text-lg leading-relaxed">
              "{xaiPayload.humanReadable}"
            </p>
          </div>

          {/* Contributing Factors */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
             <h2 className="text-xl font-semibold mb-6 text-slate-200">Factor Contributions</h2>
             <div className="space-y-6">
               {xaiPayload.contributingFactors.map((factor, idx) => (
                 <div key={idx}>
                   <div className="flex justify-between text-sm mb-1">
                     <span className="font-semibold text-slate-300">{factor.factor} (Weight: {factor.weight * 100}%)</span>
                     <span className="text-slate-400">Score: {factor.score}/100</span>
                   </div>
                   <div className="w-full bg-slate-700 rounded-full h-2.5">
                     <div className={`${factor.color} h-2.5 rounded-full`} style={{ width: `${factor.score}%` }}></div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Section 2: Decision Trace Tree */}
        <div className="col-span-1 flex flex-col gap-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-slate-200">Decision Trace Engine</h2>
            <div className="relative border-l border-slate-600 ml-3 space-y-6">
              {xaiPayload.trace.flow.map((step, idx) => (
                <div key={idx} className="pl-6 relative">
                  <div className="absolute w-3 h-3 bg-fuchsia-400 rounded-full -left-[1.5px] top-1.5 shadow-[0_0_10px_rgba(232,121,249,0.8)]"></div>
                  <h3 className="text-sm font-bold text-fuchsia-300">{step.step}</h3>
                  <p className="text-xs text-slate-400 mt-1">{step.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-right text-xs text-slate-500 font-mono">
               Execution Time: {xaiPayload.trace.executionTimeMs}ms
            </div>
          </div>

          {/* Alternatives */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-slate-200">Considered Alternatives</h2>
            <ul className="space-y-2">
              {xaiPayload.alternatives.map((alt, idx) => (
                 <li key={idx} className="bg-slate-900 border border-slate-700 px-4 py-2 rounded text-sm text-slate-400 flex items-center gap-2">
                   <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                   {alt}
                 </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExplainabilityDashboard;
