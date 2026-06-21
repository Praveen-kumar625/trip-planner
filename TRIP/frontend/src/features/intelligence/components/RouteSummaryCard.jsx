import React from 'react';
import { motion } from 'framer-motion';
import { Navigation, Clock, ShieldCheck, Activity, MapPin, Wind } from 'lucide-react';

export function RouteSummaryCard({ route }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full" />
      
      <h3 className="text-xl font-display font-semibold text-white mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-amber-400" /> Route Overview
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <p className="text-xs text-white/50 uppercase tracking-wider flex items-center gap-1"><MapPin className="w-3 h-3"/> Distance</p>
          <p className="text-2xl font-display font-bold text-white">{route.distance}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-white/50 uppercase tracking-wider flex items-center gap-1"><Clock className="w-3 h-3"/> Travel Time</p>
          <p className="text-2xl font-display font-bold text-white">{route.duration}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-white/50 uppercase tracking-wider flex items-center gap-1"><ShieldCheck className="w-3 h-3"/> Safety Score</p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-display font-bold text-emerald-400">{route.safetyScore}</p>
            <span className="text-sm text-white/40 mb-1">/100</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-white/50 uppercase tracking-wider">Traffic</p>
          <p className={`text-lg font-medium ${route.traffic === 'Light' ? 'text-emerald-400' : route.traffic === 'Heavy' ? 'text-red-400' : 'text-amber-400'}`}>
            {route.traffic}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-white/50 uppercase tracking-wider flex items-center gap-1"><Navigation className="w-3 h-3"/> Road Condition</p>
          <p className="text-lg font-medium text-blue-300">{route.roadCondition}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-white/50 uppercase tracking-wider flex items-center gap-1"><Wind className="w-3 h-3"/> Weather</p>
          <p className="text-lg font-medium text-white/90">{route.weather}</p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
        <div>
          <p className="text-xs text-white/50 uppercase tracking-wider">Est. Fuel Cost</p>
          <p className="text-xl font-bold text-amber-400">{route.fuelCost}</p>
        </div>
        <div>
          <p className="text-xs text-white/50 uppercase tracking-wider">Tolls</p>
          <p className="text-xl font-bold text-white/90">{route.tollCost}</p>
        </div>
        <div>
          <p className="text-xs text-white/50 uppercase tracking-wider">Crowd Level</p>
          <p className="text-xl font-bold text-white/90">{route.crowdLevel}</p>
        </div>
      </div>
    </motion.div>
  );
}
