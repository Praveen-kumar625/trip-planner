import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Sunset, Moon, Coffee, Navigation, Clock, MapPin } from 'lucide-react';
import { ProgressiveImage } from '@/components/ui/Image';

const MOCK_IMAGES = [
  'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517400508447-f8dd518b86db?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800&auto=format&fit=crop',
];

export function ItineraryTimeline({ itineraryData }) {
  if (!itineraryData || !Array.isArray(itineraryData)) {
    return <div className="text-slate-500 italic p-8 text-center bg-slate-50 rounded-3xl">No detailed itinerary available yet.</div>;
  }

  return (
    <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-8 space-y-12 pb-12">
      {itineraryData.map((dayPlan, idx) => (
        <div key={idx} className="relative pl-8 md:pl-12">
          
          <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center shadow-[0_0_0_4px_white] dark:shadow-[0_0_0_4px_rgb(15,23,42)] text-white font-bold text-sm z-10">
            {dayPlan.day || idx + 1}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 font-serif tracking-tight">
              Day {dayPlan.day || idx + 1} <span className="text-slate-400 font-sans text-lg font-medium ml-2">— Exploration</span>
            </h3>

            <div className="space-y-6">
              {dayPlan.morning && (
                <TimelineEvent 
                  icon={Sun} 
                  time="Morning" 
                  title="Morning Activities" 
                  description={dayPlan.morning} 
                  image={MOCK_IMAGES[0]}
                  colorClass="text-amber-500 bg-amber-50 dark:bg-amber-500/10"
                />
              )}
              
              {dayPlan.afternoon && (
                <TimelineEvent 
                  icon={Sunset} 
                  time="Afternoon" 
                  title="Afternoon Discoveries" 
                  description={dayPlan.afternoon} 
                  image={MOCK_IMAGES[1]}
                  colorClass="text-orange-500 bg-orange-50 dark:bg-orange-500/10"
                />
              )}
              
              {dayPlan.evening && (
                <TimelineEvent 
                  icon={Moon} 
                  time="Evening" 
                  title="Evening Leisure" 
                  description={dayPlan.evening} 
                  image={MOCK_IMAGES[2]}
                  colorClass="text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                />
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              {dayPlan.foodBreaks && (
                <div className="glass-premium dark:glass-dark p-4 rounded-2xl flex items-start gap-3">
                  <Coffee className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Dining</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dayPlan.foodBreaks}</span>
                  </div>
                </div>
              )}
              {dayPlan.travelTime && (
                <div className="glass-premium dark:glass-dark p-4 rounded-2xl flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Transit</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dayPlan.travelTime}</span>
                  </div>
                </div>
              )}
              {dayPlan.restTime && (
                <div className="glass-premium dark:glass-dark p-4 rounded-2xl flex items-start gap-3">
                  <Clock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Leisure</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{dayPlan.restTime}</span>
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

function TimelineEvent({ icon: Icon, time, title, description, image, colorClass }) {
  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-3 shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col md:flex-row gap-5 overflow-hidden">
      
      <div className="w-full md:w-48 shrink-0 h-48 md:h-auto rounded-2xl overflow-hidden relative">
        <ProgressiveImage src={image} className="group-hover:scale-105 transition-transform duration-700" />
        <div className="absolute top-3 left-3 px-2.5 py-1 glass-premium rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
          <Icon className="w-3.5 h-3.5" />
          {time}
        </div>
      </div>
      
      <div className="py-2 pr-4 flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colorClass}`}>
            <Icon className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h4>
        </div>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
          {description}
        </p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-semibold border border-slate-100 dark:border-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
            <MapPin className="w-3 h-3" /> View on map
          </span>
        </div>
      </div>
    </div>
  );
}
