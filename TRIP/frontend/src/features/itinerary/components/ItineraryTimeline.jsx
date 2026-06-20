import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Sunset, Moon, Coffee, Navigation, Clock, MapPin } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
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
    <div className="relative border-l border-primary-200 dark:border-primary-900/30 ml-4 md:ml-8 space-y-16 pb-12">
      {itineraryData.map((dayPlan, idx) => (
        <div key={idx} className="relative pl-8 md:pl-16">
          
          <div className="absolute -left-[13px] top-2 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center shadow-[0_0_0_8px_white] dark:shadow-[0_0_0_8px_#0A0A0A] text-primary-600 dark:text-primary-400 font-serif text-xs font-bold z-10 border border-primary-300 dark:border-primary-700">
            {dayPlan.day || idx + 1}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-10 tracking-tight flex items-baseline gap-4">
              <span className="text-primary-500 dark:text-primary-400 italic">Day {dayPlan.day || idx + 1}</span>
              <span className="text-slate-300 dark:text-slate-700 font-sans text-xl font-light tracking-wide uppercase">— Exploration</span>
            </h3>

            <div className="space-y-6">
              {dayPlan.morning && (
                <TimelineEvent 
                  icon={Sun} 
                  time="Morning" 
                  title="Morning Activities" 
                  description={dayPlan.morning} 
                  image={MOCK_IMAGES[0]}
                  colorClass="text-primary-600 bg-primary-50 dark:bg-primary-900/20"
                />
              )}
              
              {dayPlan.afternoon && (
                <TimelineEvent 
                  icon={Sunset} 
                  time="Afternoon" 
                  title="Afternoon Discoveries" 
                  description={dayPlan.afternoon} 
                  image={MOCK_IMAGES[1]}
                  colorClass="text-primary-600 bg-primary-50 dark:bg-primary-900/20"
                />
              )}
              
              {dayPlan.evening && (
                <TimelineEvent 
                  icon={Moon} 
                  time="Evening" 
                  title="Evening Leisure" 
                  description={dayPlan.evening} 
                  image={MOCK_IMAGES[2]}
                  colorClass="text-primary-600 bg-primary-50 dark:bg-primary-900/20"
                />
              )}
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-100 dark:border-slate-800/50">
              {dayPlan.foodBreaks && (
                <div className="flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                    <Coffee className="w-4 h-4 text-primary-500" />
                  </div>
                  <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Dining</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-300">{dayPlan.foodBreaks}</span>
                </div>
              )}
              {dayPlan.travelTime && (
                <div className="flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                    <Navigation className="w-4 h-4 text-primary-500" />
                  </div>
                  <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Transit</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-300">{dayPlan.travelTime}</span>
                </div>
              )}
              {dayPlan.restTime && (
                <div className="flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center border border-slate-100 dark:border-slate-800">
                    <Clock className="w-4 h-4 text-primary-500" />
                  </div>
                  <span className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Leisure</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-300">{dayPlan.restTime}</span>
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
  const { id } = useParams();

  return (
    <div className="group relative flex flex-col md:flex-row gap-6 md:gap-10 items-start overflow-hidden py-4">
      
      <div className="w-full md:w-56 shrink-0 aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden relative shadow-premium">
        <ProgressiveImage src={image} className="group-hover:scale-105 transition-transform duration-1000 ease-out" />
        <div className="absolute top-4 left-4 px-3 py-1.5 glass-dark rounded-full text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2 shadow-sm">
          <Icon className="w-3.5 h-3.5" />
          {time}
        </div>
      </div>
      
      <div className="py-2 flex-1 pt-2 md:pt-4">
        <h4 className="font-serif font-bold text-2xl md:text-3xl text-slate-900 dark:text-white mb-4 leading-tight">{title}</h4>
        
        <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed mb-6 font-medium max-w-xl">
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Link 
            to={id ? `/maps?tripId=${id}` : `/maps`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-transparent text-primary-600 dark:text-primary-400 rounded-full text-xs font-bold uppercase tracking-widest border border-primary-200 dark:border-primary-900/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" /> Locate
          </Link>
        </div>
      </div>
    </div>
  );
}
