import React from 'react';

/**
 * System Operations Dashboard
 * Observability cloud UI for backend monitoring.
 */
const SystemOperationsDashboard = () => {
  const sysHealth = {
    cpu: "24%",
    mem: "1.2GB",
    uptime: "14d 6h",
    apiLatency: "45ms (p99)"
  };

  const queues = [
    { name: "travel-dna-sync", pending: 12, active: 4, status: "Healthy" },
    { name: "consensus-solver", pending: 2, active: 1, status: "Healthy" },
    { name: "sse-dispatcher", pending: 0, active: 10, status: "Healthy" }
  ];

  return (
    <div className="p-6 bg-black text-slate-100 min-h-screen font-mono">
      <header className="mb-8 border-b border-slate-800 pb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-emerald-400">Observability Cloud</h1>
        <div className="flex items-center gap-2 text-xs">
           <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
           <span className="text-slate-400">System Nominal</span>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
         <div className="bg-slate-900 border border-slate-800 p-4 rounded">
           <div className="text-slate-500 text-xs mb-1">CPU Load</div>
           <div className="text-xl text-emerald-400">{sysHealth.cpu}</div>
         </div>
         <div className="bg-slate-900 border border-slate-800 p-4 rounded">
           <div className="text-slate-500 text-xs mb-1">Memory</div>
           <div className="text-xl text-blue-400">{sysHealth.mem}</div>
         </div>
         <div className="bg-slate-900 border border-slate-800 p-4 rounded">
           <div className="text-slate-500 text-xs mb-1">API Latency</div>
           <div className="text-xl text-fuchsia-400">{sysHealth.apiLatency}</div>
         </div>
         <div className="bg-slate-900 border border-slate-800 p-4 rounded">
           <div className="text-slate-500 text-xs mb-1">Uptime</div>
           <div className="text-xl text-slate-200">{sysHealth.uptime}</div>
         </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-6 rounded">
        <h2 className="text-lg text-slate-200 border-b border-slate-800 pb-2 mb-4">Queue Monitors (BullMQ)</h2>
        <table className="w-full text-left text-sm">
           <thead>
             <tr className="text-slate-500">
               <th className="pb-2">Queue Name</th>
               <th className="pb-2">Pending</th>
               <th className="pb-2">Active</th>
               <th className="pb-2">Status</th>
             </tr>
           </thead>
           <tbody>
             {queues.map((q, i) => (
                <tr key={i} className="border-b border-slate-800/50">
                  <td className="py-2 text-blue-300">{q.name}</td>
                  <td className="py-2 text-slate-300">{q.pending}</td>
                  <td className="py-2 text-emerald-300">{q.active}</td>
                  <td className="py-2 text-emerald-500">{q.status}</td>
                </tr>
             ))}
           </tbody>
        </table>
      </div>
    </div>
  );
};

export default SystemOperationsDashboard;
