import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Play } from 'lucide-react';

import { DummyRouteEngine } from '../data/routes';
import { RouteMap } from '../features/intelligence/components/RouteMap';
import { RouteSummaryCard } from '../features/intelligence/components/RouteSummaryCard';
import { TransportOptions } from '../features/intelligence/components/TransportOptions';
import { RouteAlternatives } from '../features/intelligence/components/RouteAlternatives';
import { TravelTimeline } from '../features/intelligence/components/TravelTimeline';
import { TourismDashboard } from '../features/intelligence/components/TourismDashboard';
import { AiInsights } from '../features/intelligence/components/AiInsights';

export default function IntelligenceDemoPage() {
  const { destinationId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulate complex calculation for the demo effect
    const timer = setTimeout(() => {
      const intelligenceData = DummyRouteEngine.getRouteIntelligence(destinationId);
      setData(intelligenceData);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [destinationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-6" />
        <h2 className="text-2xl font-display font-bold">Synthesizing Travel Intelligence...</h2>
        <p className="text-white/50 mt-2">Loading route geometry and tourism data</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden selection:bg-amber-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/10 rounded-full transition-colors border border-white/5"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-amber-500">
                Route Intelligence
              </h1>
              <p className="text-xs text-white/50">WanderSync Demo Engine</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-bold flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live
             </span>
             <button onClick={() => navigate('/planner')} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-full text-sm font-bold transition-all shadow-glow-saffron">
               <Play className="w-4 h-4" /> Start Trip
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24">
        
        {/* Title Section */}
        <div className="mb-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold text-white mb-4"
          >
            {data.route.destination}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-xl text-white/60 max-w-2xl mx-auto"
          >
            {data.route.description}
          </motion.p>
        </div>

        {/* Top Grid: Map & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <RouteMap route={data.route} />
          </div>
          <div>
            <RouteSummaryCard route={data.route} />
          </div>
        </div>

        {/* Transport Options */}
        <div className="mb-6">
          <TransportOptions transports={data.transport} />
        </div>

        {/* Middle Grid: Alternatives, Timeline, Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1 space-y-6">
            <RouteAlternatives alternatives={data.alternatives} />
            <AiInsights insights={data.insights} />
          </div>
          <div className="lg:col-span-2">
            <TourismDashboard tourism={data.tourism} />
            <div className="mt-6">
               <TravelTimeline timeline={data.timeline} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
