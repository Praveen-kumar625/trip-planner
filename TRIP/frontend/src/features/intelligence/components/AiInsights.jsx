import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Info } from 'lucide-react';

export function AiInsights({ insights }) {
  return (
    <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-3xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full" />
      
      <h3 className="text-xl font-display font-semibold text-white mb-6 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-400" /> AI Travel Insights
      </h3>

      <div className="space-y-3">
        {insights.map((insight, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + idx * 0.1 }}
            className="flex items-start gap-3 bg-black/40 p-3 rounded-xl border border-white/5"
          >
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-white/80 leading-relaxed">{insight}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
