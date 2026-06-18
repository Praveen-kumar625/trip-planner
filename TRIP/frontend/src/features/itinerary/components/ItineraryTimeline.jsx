import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Sunset, Moon, Coffee, Navigation, Clock } from 'lucide-react';

export function ItineraryTimeline({ itineraryData }) {
  if (!itineraryData || !Array.isArray(itineraryData)) {
    return <div className="text-slate-500 italic">No detailed itinerary available.</div>;
  }

  return (
    <div className="relative border-l-2 border-amber-200 dark:border-amber-900/50 ml-4 md:ml-8 space-y-12 pb-8">
      {itineraryData.map((dayPlan, idx) => (
        <div key={idx} className="relative pl-8 md:pl-12">
          {/* Day Marker */}
          <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30 text-white font-bold text-sm">
            {dayPlan.day || idx + 1}
          </div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Day {dayPlan.day || idx + 1}</h3>

            <div className="space-y-6">
              {/* Morning */}
              {dayPlan.morning && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Morning</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{dayPlan.morning}</p>
                  </div>
                </div>
              )}

              {/* Afternoon */}
              {dayPlan.afternoon && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Sunset className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Afternoon</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{dayPlan.afternoon}</p>
                  </div>
                </div>
              )}

              {/* Evening */}
              {dayPlan.evening && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Evening</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{dayPlan.evening}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Micro Details Container */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              {dayPlan.foodBreaks && (
                <div className="flex items-start gap-3">
                  <Coffee className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Food Breaks</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{dayPlan.foodBreaks}</span>
                  </div>
                </div>
              )}
              {dayPlan.travelTime && (
                <div className="flex items-start gap-3">
                  <Navigation className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Travel Time</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{dayPlan.travelTime}</span>
                  </div>
                </div>
              )}
              {dayPlan.restTime && (
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Rest Time</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{dayPlan.restTime}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
