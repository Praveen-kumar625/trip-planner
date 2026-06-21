import React, { useState } from 'react';

/**
 * Travel Graph Explorer Dashboard
 * Visualizes the Travel Intelligence Graph, Communities, and Recommendation Traversals.
 */
const TravelGraphDashboard = () => {
  // Mock Data
  const graphStats = [
    { label: "Total Nodes", value: "1.2M", color: "text-blue-400" },
    { label: "Total Relationships", value: "8.5M", color: "text-indigo-400" },
    { label: "Communities Found", value: "12", color: "text-emerald-400" },
    { label: "Vector Embeddings", value: "1.2M", color: "text-fuchsia-400" },
  ];

  const similarUsers = [
    { name: "usr_819", persona: "Nature Seeker", similarity: 92 },
    { name: "usr_211", persona: "Nature Seeker", similarity: 88 },
    { name: "usr_404", persona: "Adventure Explorer", similarity: 85 },
  ];

  const communities = [
    { name: 'Nature Seekers', size: '1.4k', main: 'Mountains, Lakes' },
    { name: 'Photographers', size: '850', main: 'Landscapes, Arch.' },
    { name: 'Food Nomads', size: '640', main: 'Street Food, Local' },
  ];

  const coOccurrences = ['Jibhi', 'Kalga', 'Shoja'];

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen font-sans">
      <header className="mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-blue-400">Travel Intelligence Graph</h1>
        <p className="text-slate-400">Relationship Discovery & Vector Similarity Explorer</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Section 1: Graph Overview */}
        <div className="col-span-1 lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {graphStats.map((stat, idx) => (
             <div key={idx} className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col justify-center items-center text-center shadow-lg">
               <h3 className="text-xs text-slate-400 mb-2 uppercase tracking-wider font-semibold">{stat.label}</h3>
               <div className={`text-4xl font-bold ${stat.color}`}>{stat.value}</div>
             </div>
          ))}
        </div>

        {/* Section 2: Traveler Network */}
        <div className="col-span-1 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg relative">
          <h2 className="text-xl font-semibold mb-6 text-slate-200">Traveler Network</h2>
          <div className="flex flex-col items-center space-y-4 relative">
             <div className="px-6 py-3 bg-blue-900/40 border border-blue-500 rounded-full text-blue-300 font-bold z-10">Current User</div>
             <div className="h-6 w-0.5 bg-slate-600"></div>
             <div className="px-4 py-1 text-xs text-slate-400 bg-slate-900 rounded border border-slate-700">SIMILAR_TO</div>
             <div className="h-6 w-0.5 bg-slate-600"></div>
             
             <div className="flex gap-3 z-10">
               {similarUsers.map((u, i) => (
                 <div key={i} className="px-3 py-2 bg-indigo-900/30 border border-indigo-700/50 rounded text-xs text-indigo-300 text-center">
                   <div>{u.name}</div>
                   <div className="opacity-70 mt-1">{u.similarity}%</div>
                 </div>
               ))}
             </div>

             <div className="h-6 w-0.5 bg-slate-600"></div>
             <div className="px-4 py-1 text-xs text-slate-400 bg-slate-900 rounded border border-slate-700">VISITED</div>
             <div className="h-6 w-0.5 bg-slate-600"></div>
             
             <div className="px-6 py-3 bg-emerald-900/40 border border-emerald-500 rounded-full text-emerald-300 font-bold z-10">Tirthan Valley</div>
          </div>
        </div>

        {/* Section 3 & 5: Communities & Co-occurrences */}
        <div className="col-span-1 flex flex-col gap-6">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-slate-200">Community Detection</h2>
            <div className="space-y-3">
              {communities.map((c, i) => (
                 <div key={i} className="flex justify-between items-center p-3 bg-slate-900 rounded-lg border border-slate-700/50">
                   <div>
                     <div className="font-bold text-emerald-400">{c.name}</div>
                     <div className="text-xs text-slate-400">{c.main}</div>
                   </div>
                   <div className="text-xs text-slate-500">{c.size} nodes</div>
                 </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
             <h2 className="text-lg font-semibold mb-2 text-slate-200">Graph Insights</h2>
             <div className="p-4 bg-blue-900/20 border border-blue-900/50 rounded-lg text-sm text-blue-200">
               Users similar to you often visit <strong className="text-blue-400">Tirthan Valley</strong>. Those users also frequently visit:
               <div className="mt-3 flex gap-2">
                 {coOccurrences.map((place, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-900/50 rounded text-xs">{place}</span>
                 ))}
               </div>
             </div>
          </div>
        </div>

        {/* Section 4: Recommendation Traversal */}
        <div className="col-span-1 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-slate-200">Recommendation Traversal</h2>
          <div className="bg-slate-900 p-5 rounded-lg font-mono text-sm border border-slate-700 overflow-x-auto text-slate-300">
             <div className="mb-4">
               <span className="text-fuchsia-400">SELECT</span> target.name <br/>
               <span className="text-fuchsia-400">FROM</span> Users u <br/>
               <span className="text-fuchsia-400">JOIN</span> SimilarityEdges se <br/>
               &nbsp;&nbsp;<span className="text-fuchsia-400">ON</span> u.id = se.source_id <br/>
               <span className="text-fuchsia-400">JOIN</span> UserRelationships ur <br/>
               &nbsp;&nbsp;<span className="text-fuchsia-400">ON</span> se.target_id = ur.user_id <br/>
               <span className="text-fuchsia-400">WHERE</span> u.id = 'active_user' <br/>
               &nbsp;&nbsp;<span className="text-fuchsia-400">AND</span> ur.relationship_type = 'VISITED'
             </div>
             <div className="border-t border-slate-700 pt-4 text-emerald-400">
               // Executed Traversal Path: <br/>
               User <br/>
               &nbsp;↳ SIMILAR_TO (Nature Seekers) <br/>
               &nbsp;&nbsp;&nbsp;↳ VISITED <br/>
               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↳ <strong className="text-emerald-300">Tirthan Valley</strong>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TravelGraphDashboard;
