import React from 'react';
import { motion } from 'framer-motion';
import { ProgressiveImage } from '../ui/Image';
import { Sparkles, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EditorialDestinationCard({ 
  id, 
  title, 
  location, 
  image, 
  mood, 
  description,
  bestSeason,
  isLarge = false
}) {
  return (
    <Link to="/trip-planner" className="group block relative w-full h-full overflow-hidden rounded-2xl md:rounded-[32px] bg-black">
      {/* Background Image with Zoom on Hover */}
      <div className="absolute inset-0 w-full h-full">
        <ProgressiveImage
          src={image}
          alt={title}
          aspectRatio="none"
          containerClassName="w-full h-full"
          className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
        />
      </div>

      {/* Gradients for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 transition-opacity duration-700 opacity-80 group-hover:opacity-95" />
      
      {/* Top Floating Tags */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent-400" />
          <span className="text-xs font-medium text-white tracking-widest uppercase">{mood}</span>
        </motion.div>
      </div>

      {/* Content Container (Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 lg:p-10 flex flex-col justify-end transform transition-transform duration-700 translate-y-4 group-hover:translate-y-0">
        
        {/* Location Label */}
        <div className="flex items-center gap-2 text-white/70 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          <MapPin className="w-4 h-4 text-primary-400" />
          <span className="text-xs font-semibold tracking-widest uppercase">{location}</span>
        </div>

        {/* Title */}
        <h3 className={`font-serif text-white mb-4 leading-tight transition-colors duration-500 group-hover:text-primary-50
          ${isLarge ? 'text-4xl md:text-5xl lg:text-6xl' : 'text-3xl md:text-4xl'}
        `}>
          {title}
        </h3>

        {/* Description & Details (Revealed on hover) */}
        <div className="overflow-hidden">
          <div className="opacity-0 group-hover:opacity-100 transform translate-y-8 group-hover:translate-y-0 transition-all duration-700 ease-out delay-75">
            {description && (
              <p className="text-white/80 text-sm md:text-base leading-relaxed mb-6 line-clamp-2 max-w-lg font-light">
                {description}
              </p>
            )}

            <div className="flex items-center justify-between border-t border-white/20 pt-5 mt-auto">
              {bestSeason && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-white/50" />
                  <span className="text-xs text-white/70 uppercase tracking-widest">Season: {bestSeason}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-primary-400 font-medium text-sm group-hover:translate-x-1 transition-transform duration-500">
                Explore <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
