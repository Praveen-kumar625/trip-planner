import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Map, CloudSun, Utensils, Bed, Compass } from 'lucide-react';

const RESEARCH_STEPS = [
  { text: "Analyzing destination intelligence...", icon: Map },
  { text: "Checking historical weather patterns...", icon: CloudSun },
  { text: "Curating hidden culinary gems...", icon: Utensils },
  { text: "Finding optimal stay locations...", icon: Bed },
  { text: "Drafting the perfect day-by-day itinerary...", icon: Compass },
  { text: "Applying final polish...", icon: Sparkles }
];

export function AiResearchOverlay({ destinationName }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    // Cycle through steps every 2.5 seconds, but stay on the last step if it takes longer
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < RESEARCH_STEPS.length - 1 ? prev + 1 : prev));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = RESEARCH_STEPS[currentStepIndex].icon;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative z-10"
      >
        <div className="h-2 bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-400 to-orange-500"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStepIndex + 1) / RESEARCH_STEPS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        
        <div className="p-8 text-center flex flex-col items-center">
          <div className="relative mb-8">
            {/* Spinning ring */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border-2 border-dashed border-amber-200 dark:border-amber-900/50 rounded-full"
            />
            {/* Inner icon container */}
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepIndex}
                  initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                  transition={{ duration: 0.3 }}
                >
                  <CurrentIcon className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Crafting your trip to {destinationName || 'your destination'}
          </h3>
          
          <div className="h-8 relative w-full flex justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStepIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-slate-500 dark:text-slate-400 font-medium absolute"
              >
                {RESEARCH_STEPS[currentStepIndex].text}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 w-full flex justify-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
