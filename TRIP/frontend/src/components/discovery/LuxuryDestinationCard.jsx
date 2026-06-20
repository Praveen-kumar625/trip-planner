import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Wallet } from 'lucide-react';
import { ProgressiveImage } from '@/components/ui/Image';

export default function LuxuryDestinationCard({ 
  id, 
  title, 
  location, 
  image, 
  mood, 
  bestSeason, 
  budget 
}) {
  return (
    <motion.div 
      className="group relative w-full aspect-[2/3] rounded-[2rem] overflow-hidden cursor-pointer"
      whileHover="hover"
      initial="initial"
    >
      <motion.div 
        className="absolute inset-0 w-full h-full origin-center"
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.05 }
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <ProgressiveImage 
          src={image} 
          alt={title}
          aspectRatio="w-full h-full"
          className="object-cover"
        />
      </motion.div>
      
      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Mood Chip - Top Right */}
      <div className="absolute top-6 right-6 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 ease-out">
        <div className="glass-premium px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20">
          <span className="text-xs font-bold text-white uppercase tracking-widest">{mood}</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end">
        {/* Destination Info */}
        <motion.div 
          className="mb-4"
          variants={{
            initial: { y: 20 },
            hover: { y: 0 }
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-accent-400" />
            <span className="text-sm font-medium tracking-wide text-white/80 uppercase">{location}</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-white leading-none drop-shadow-md">{title}</h3>
        </motion.div>

        {/* Details revealed on hover */}
        <motion.div 
          className="flex flex-col gap-3 overflow-hidden"
          variants={{
            initial: { height: 0, opacity: 0 },
            hover: { height: 'auto', opacity: 1 }
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-12 h-[1px] bg-white/30 my-2" />
          
          <div className="flex items-center gap-3 text-white/90">
            <Calendar className="w-4 h-4 text-white/60" />
            <span className="text-sm font-medium">Best in {bestSeason}</span>
          </div>
          <div className="flex items-center gap-3 text-white/90">
            <Wallet className="w-4 h-4 text-white/60" />
            <span className="text-sm font-medium">{budget}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
