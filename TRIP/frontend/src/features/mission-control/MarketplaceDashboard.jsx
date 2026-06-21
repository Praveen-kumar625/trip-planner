import React from 'react';
import { datasetRegistry } from '../../../../backend-node/src/modules/marketplace/datasetRegistry.js';

/**
 * Tourism Data Marketplace Dashboard
 * Where intelligence is monetized and packaged for enterprise consumption.
 */
const MarketplaceDashboard = () => {
  const revenue = { total: "$1.4M", api: "$450K", enterprise: "$950K", activeCustomers: 312 };

  return (
    <div className="p-6 bg-slate-900 text-slate-100 min-h-screen font-sans">
      <header className="mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-amber-400">Tourism Data Marketplace</h1>
        <p className="text-slate-400">Monetization & Intelligence Distribution Center</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="text-sm text-slate-400">Total Revenue</div>
          <div className="text-3xl font-bold text-amber-400">{revenue.total}</div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="text-sm text-slate-400">Enterprise Contracts</div>
          <div className="text-3xl font-bold text-emerald-400">{revenue.enterprise}</div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="text-sm text-slate-400">API Subscriptions</div>
          <div className="text-3xl font-bold text-blue-400">{revenue.api}</div>
        </div>
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <div className="text-sm text-slate-400">Active Customers</div>
          <div className="text-3xl font-bold text-fuchsia-400">{revenue.activeCustomers}</div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-200 mb-4">Dataset Catalog</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {datasetRegistry.map((ds) => (
          <div key={ds.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg hover:border-amber-500/50 transition">
            <div className="flex justify-between items-start mb-2">
              <span className="px-2 py-1 bg-slate-700 text-xs rounded text-slate-300">{ds.category}</span>
              <span className={`px-2 py-1 text-xs rounded font-bold ${ds.pricingTier === 'Enterprise' ? 'bg-fuchsia-900/50 text-fuchsia-400' : 'bg-emerald-900/50 text-emerald-400'}`}>
                {ds.pricingTier}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">{ds.name}</h3>
            <div className="text-sm text-slate-400 mb-4">Region: {ds.region}</div>
            <div className="flex justify-between text-xs text-slate-500 border-t border-slate-700 pt-3">
              <span>{ds.records} Records</span>
              <span>{ds.freshness}</span>
              <span>{ds.accessLevel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceDashboard;
