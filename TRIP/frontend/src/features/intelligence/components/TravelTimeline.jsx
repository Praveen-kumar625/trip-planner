import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export function TravelTimeline({ timeline }) {
  return (
    <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
      <h3 className="text-xl font-display font-semibold text-white mb-8">Journey Timeline</h3>
      
      <div className="relative pl-8">
        {/* Vertical Line */}
        <div className="absolute top-2 bottom-2 left-[15px] w-[2px] bg-white/10" />
        
        <div className="space-y-8">
          {timeline.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15 }}
              className="relative"
            >
              {/* Dot */}
              <div className="absolute -left-10 mt-1.5">
                <div className="w-4 h-4 rounded-full bg-black border-2 border-amber-400 z-10 relative">
                  {idx === 0 && <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-50" />}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-amber-400/80 mb-1 block">{item.time}</span>
                <h4 className="text-white font-medium text-lg">{item.title}</h4>
                <p className="text-sm text-white/50 mt-1">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
