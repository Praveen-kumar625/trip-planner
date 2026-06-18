import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, CloudSun } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DestinationCard({ id, title, location, image, rating, weather, price, tag }) {
  return (
    <Link to={`/explore/${id}`}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative w-full h-80 md:h-96 rounded-3xl overflow-hidden cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] bg-neutral-100"
      >
        <img 
          src={image} 
          alt={title} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          {tag && (
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold tracking-wider uppercase border border-white/30">
              {tag}
            </span>
          )}
          <div className="flex gap-2 ml-auto">
            <span className="flex items-center gap-1 px-2.5 py-1 bg-white/90 rounded-full text-neutral-900 text-xs font-bold shadow-sm">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              {rating}
            </span>
          </div>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col gap-2 text-white transform transition-transform duration-300 group-hover:-translate-y-2">
          <div className="flex items-center gap-1.5 text-white/80 text-sm font-medium">
            <MapPin className="w-4 h-4" />
            {location}
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-balance leading-tight">
            {title}
          </h3>
          
          <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-2 text-sm text-white/90">
              <CloudSun className="w-4 h-4" />
              {weather}
            </div>
            <div className="text-sm font-medium">
              From <span className="font-bold">{price}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
