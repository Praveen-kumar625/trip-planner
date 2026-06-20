import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, CloudSun, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProgressiveImage } from '@/components/ui/Image';

export default function DestinationCard({ id, title, location, image, rating, weather, price, tag, aiInsight }) {
  return (
    <Link to={`/explore/${id}`} className="block h-full">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative flex flex-col h-full bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden cursor-pointer shadow-premium hover:shadow-premium-hover border border-slate-100 dark:border-slate-800 transition-all duration-300"
      >
        <div className="relative w-full aspect-[4/5] sm:aspect-square overflow-hidden p-3 pb-0">
          <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
            <ProgressiveImage 
              src={image} 
              alt={title} 
              aspectRatio="aspect-none h-full w-full"
              className="group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
              {tag && (
                <span className="px-3 py-1.5 glass-dark rounded-full text-white text-[10px] uppercase tracking-[0.2em] font-bold shadow-sm">
                  {tag}
                </span>
              )}
              <div className="flex gap-2 ml-auto">
                <span className="flex items-center gap-1.5 px-3 py-1.5 glass-dark rounded-full text-white text-[11px] font-bold shadow-sm">
                  <Star className="w-3.5 h-3.5 text-accent-400 fill-accent-400" />
                  {rating}
                </span>
              </div>
            </div>

            {aiInsight && (
              <div className="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                <div className="glass-premium dark:glass-dark rounded-2xl p-3 shadow-lg border border-white/40 dark:border-white/10 flex gap-2 items-start">
                  <Sparkles className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug">
                    {aiInsight}
                  </p>
                </div>
              </div>
            )}
            
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 text-xs font-bold tracking-[0.1em] uppercase mb-2">
            <MapPin className="w-3.5 h-3.5" />
            {location}
          </div>
          
          <h3 className="text-2xl font-serif font-bold tracking-tight text-slate-900 dark:text-white mb-auto line-clamp-1">
            {title}
          </h3>
          
          <div className="flex items-end justify-between mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/50">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Best Time</span>
              <div className="flex items-center gap-1.5 text-sm text-slate-900 dark:text-slate-300 font-medium">
                <CloudSun className="w-4 h-4 text-accent-500" />
                {weather}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-1">From</span>
              <span className="text-base font-bold text-slate-900 dark:text-white">{price}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
