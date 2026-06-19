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
                <span className="px-3 py-1.5 glass-premium rounded-full text-slate-900 dark:text-white text-xs font-bold tracking-wide shadow-sm">
                  {tag}
                </span>
              )}
              <div className="flex gap-2 ml-auto">
                <span className="flex items-center gap-1.5 px-3 py-1.5 glass-premium rounded-full text-slate-900 dark:text-white text-xs font-bold shadow-sm">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
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

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm font-medium mb-1.5">
            <MapPin className="w-4 h-4 text-primary-500" />
            {location}
          </div>
          
          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-auto line-clamp-1">
            {title}
          </h3>
          
          <div className="flex items-end justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
              <CloudSun className="w-4 h-4 text-amber-500" />
              {weather}
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium mb-0.5">Average Daily</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">{price}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
