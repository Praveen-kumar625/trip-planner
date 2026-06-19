import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Coffee, Sparkles } from 'lucide-react';
import { ProgressiveImage } from '@/components/ui/Image';

export function HotelCard({ hotel }) {
  const { name, rating, location, price, image, tags, aiInsight } = hotel;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-premium border border-slate-100 dark:border-slate-800 transition-all duration-300"
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden p-2 pb-0">
        <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden">
          <ProgressiveImage 
            src={image} 
            alt={name} 
            aspectRatio="aspect-none h-full w-full"
            className="group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-20">
            {tags && tags[0] && (
              <span className="px-2.5 py-1 glass-premium rounded-full text-slate-900 dark:text-white text-[10px] uppercase font-bold tracking-wider shadow-sm">
                {tags[0]}
              </span>
            )}
            <div className="ml-auto">
              <span className="flex items-center gap-1 px-2.5 py-1 glass-premium rounded-full text-slate-900 dark:text-white text-xs font-bold shadow-sm">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {rating}
              </span>
            </div>
          </div>

          {aiInsight && (
            <div className="absolute inset-x-3 bottom-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
              <div className="glass-premium dark:glass-dark rounded-xl p-2.5 shadow-lg border border-white/40 dark:border-white/10 flex gap-2 items-start">
                <Sparkles className="w-3.5 h-3.5 text-primary-500 shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium text-slate-800 dark:text-slate-200 leading-snug">
                  {aiInsight}
                </p>
              </div>
            </div>
          )}
          
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white mb-1 line-clamp-1">
          {name}
        </h3>
        
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium mb-auto">
          <MapPin className="w-3.5 h-3.5 text-primary-500" />
          <span className="truncate">{location}</span>
        </div>
        
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/50 flex justify-between items-end">
          <div className="flex gap-1">
            {tags?.slice(1, 3).map((tag, i) => (
               <span key={i} className="text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                 {tag}
               </span>
            ))}
          </div>
          <div className="text-right">
            <span className="text-lg font-black text-slate-900 dark:text-white">{price}</span>
            <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wide">/ night</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function RestaurantCard({ restaurant }) {
  const { name, rating, cuisine, priceLevel, image, aiInsight } = restaurant;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative flex bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-premium border border-slate-100 dark:border-slate-800 transition-all duration-300"
    >
      <div className="relative w-1/3 aspect-square min-w-[120px] p-2 pr-0">
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          <ProgressiveImage 
            src={image} 
            alt={name} 
            aspectRatio="aspect-none h-full w-full"
            className="group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 justify-center">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 pr-2">
            {name}
          </h3>
          <span className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded-md text-amber-600">
            <Star className="w-3 h-3 fill-amber-500" />
            {rating}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
          <span>{cuisine}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span className="text-primary-600 font-bold tracking-widest">{priceLevel}</span>
        </div>
        
        {aiInsight && (
          <div className="mt-auto bg-slate-50 dark:bg-slate-800/50 rounded-xl p-2.5 flex items-start gap-2">
            <Coffee className="w-3.5 h-3.5 text-primary-500 shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
              {aiInsight}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
