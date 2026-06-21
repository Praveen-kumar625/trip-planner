import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Leaf, DollarSign, Image } from 'lucide-react';

const getTypeIcon = (type) => {
  switch(type) {
    case 'Fastest': return <Zap className="w-4 h-4" />;
    case 'Scenic': return <Image className="w-4 h-4" />;
    case 'Budget': return <DollarSign className="w-4 h-4" />;
    case 'Eco': return <Leaf className="w-4 h-4" />;
    default: return <Zap className="w-4 h-4" />;
  }
};

export function RouteAlternatives({ alternatives }) {
  const [activeRoute, setActiveRoute] = useState(0);

  return (
    <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
      <h3 className="text-xl font-display font-semibold text-white mb-6">Route Alternatives</h3>
      
      <div className="flex flex-col gap-3">
        {alternatives.map((alt, idx) => (
          <motion.div
            key={idx}
            onClick={() => setActiveRoute(idx)}
            className={`relative overflow-hidden cursor-pointer rounded-2xl p-4 border transition-all duration-300 ${
              activeRoute === idx 
                ? 'bg-white/10 border-white/30' 
                : 'bg-transparent border-white/5 hover:border-white/20 hover:bg-white/5'
            }`}
          >
            {activeRoute === idx && (
              <motion.div 
                layoutId="active-alt-bg"
                className={`absolute inset-0 opacity-10 bg-gradient-to-r ${alt.color}`}
              />
            )}
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${alt.color} text-black`}>
                  {getTypeIcon(alt.type)}
                </div>
                <div>
                  <h4 className="text-white font-medium">{alt.type} Route</h4>
                  <p className="text-sm text-white/50">{alt.distance} • {alt.duration}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">{alt.cost}</p>
                <p className="text-xs text-white/50">Safety: {alt.safety}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
