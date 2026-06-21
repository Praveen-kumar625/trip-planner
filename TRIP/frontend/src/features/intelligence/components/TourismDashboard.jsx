import React from 'react';
import { motion } from 'framer-motion';
import { Star, Hotel, Utensils, IndianRupee, MapPin } from 'lucide-react';

export function TourismDashboard({ tourism }) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-display font-semibold text-white">Local Tourism Dashboard</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nearby Attractions */}
        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <h4 className="text-sm text-white/50 uppercase tracking-wider mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Top Attractions
          </h4>
          <div className="space-y-4">
            {tourism.attractions.map((attr, idx) => (
              <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                <div>
                  <p className="text-white font-medium">{attr.name}</p>
                  <p className="text-xs text-white/50">{attr.type}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/20 text-amber-400 px-2 py-1 rounded-lg text-sm font-bold">
                  <Star className="w-3 h-3 fill-current" /> {attr.rating}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Infrastructure & Cost */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-500/20 rounded-3xl p-5 flex flex-col justify-center items-center text-center">
              <Hotel className="w-6 h-6 text-blue-400 mb-2" />
              <p className="text-2xl font-bold text-white">{tourism.hotels}</p>
              <p className="text-xs text-white/60">Hotels Nearby</p>
            </div>
            <div className="bg-gradient-to-br from-orange-900/40 to-orange-800/20 border border-orange-500/20 rounded-3xl p-5 flex flex-col justify-center items-center text-center">
              <Utensils className="w-6 h-6 text-orange-400 mb-2" />
              <p className="text-2xl font-bold text-white">{tourism.restaurants}</p>
              <p className="text-xs text-white/60">Restaurants</p>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex-1">
            <h4 className="text-sm text-white/50 uppercase tracking-wider mb-4 flex items-center gap-2">
              <IndianRupee className="w-4 h-4" /> Daily Budget Estimate
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-emerald-400 font-medium">Budget</span>
                <span className="text-white font-bold">{tourism.costEstimate.budget}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-blue-400 font-medium">Standard</span>
                <span className="text-white font-bold">{tourism.costEstimate.standard}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-400 font-medium">Luxury</span>
                <span className="text-white font-bold">{tourism.costEstimate.luxury}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
