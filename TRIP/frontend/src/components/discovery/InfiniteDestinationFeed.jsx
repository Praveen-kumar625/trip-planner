import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressiveImage } from '@/components/ui/Image';
import { globalDestinations } from '@/data/globalDestinations';
import { MapPin, Calendar, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

const GRID_SIZE = 10;

// Utility to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function InfiniteDestinationFeed() {
  const [activeItems, setActiveItems] = useState([]);
  
  // Initialize with 10 random items
  useEffect(() => {
    const initial = shuffleArray(globalDestinations).slice(0, GRID_SIZE).map(item => ({
      ...item,
      gridId: Math.random().toString() // unique key for the slot
    }));
    setActiveItems(initial);
  }, []);

  // Continually change one random image every 4 seconds to maintain mystery and dynamic feel
  useEffect(() => {
    if (activeItems.length === 0) return;

    const interval = setInterval(() => {
      setActiveItems(current => {
        // Find destinations not currently shown
        const currentIds = current.map(item => item.id);
        const available = globalDestinations.filter(item => !currentIds.includes(item.id));
        
        if (available.length === 0) return current;

        // Pick one random active slot to replace
        const slotToReplace = Math.floor(Math.random() * GRID_SIZE);
        // Pick one random new destination
        const newDest = available[Math.floor(Math.random() * available.length)];

        const newItems = [...current];
        newItems[slotToReplace] = {
          ...newDest,
          gridId: Math.random().toString() // forces AnimatePresence to crossfade
        };

        return newItems;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [activeItems.length]);

  // A carefully crafted asymmetric bento grid for 10 items
  // On mobile: 1 column. Tablet: 2 cols. Desktop: 4 cols.
  // We apply different row spans to create a mosaic effect.
  const getGridSpan = (index) => {
    // A beautiful recurring pattern for 10 items
    const spans = [
      'col-span-1 md:col-span-2 row-span-2 aspect-square md:aspect-auto', // 0: Large square
      'col-span-1 row-span-1 aspect-[4/5]', // 1: Portrait
      'col-span-1 row-span-1 aspect-[4/5]', // 2: Portrait
      'col-span-1 md:col-span-2 row-span-1 aspect-video md:aspect-auto', // 3: Wide
      'col-span-1 row-span-2 aspect-[3/4]', // 4: Tall
      'col-span-1 row-span-1 aspect-square', // 5: Square
      'col-span-1 md:col-span-2 row-span-2 aspect-square md:aspect-auto', // 6: Large square
      'col-span-1 row-span-1 aspect-[4/5]', // 7: Portrait
      'col-span-1 row-span-1 aspect-[4/5]', // 8: Portrait
      'col-span-1 md:col-span-2 row-span-1 aspect-video md:aspect-[21/9]', // 9: Very Wide bottom
    ];
    return spans[index % 10];
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-6 auto-rows-[250px]">
        {activeItems.map((dest, index) => (
          <div key={index} className={`relative rounded-none md:rounded-2xl overflow-hidden group bg-black shadow-2xl ${getGridSpan(index)}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={dest.gridId}
                initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <Link to="/trip-planner" className="block w-full h-full cursor-none md:cursor-pointer">
                  {/* Clean Image - No initial text */}
                  <ProgressiveImage
                    src={dest.image}
                    alt="Mystery Destination"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                  />
                  
                  {/* Heavy dark gradient that ONLY appears on hover to reveal text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-500 ease-out" />
                  
                  {/* Content Container - Strictly visible on hover */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    
                    {/* Mood tag fades in from top */}
                    <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transform -translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100">
                      <span className="px-3 py-1 text-xs font-medium bg-white/10 backdrop-blur-md text-white border border-white/20 uppercase tracking-widest letter-spacing-2">
                        {dest.mood}
                      </span>
                    </div>

                    <h3 className="font-serif text-3xl md:text-4xl text-white mb-2 font-light tracking-wide">
                      {dest.title}
                    </h3>
                    
                    <div className="flex items-center text-white/70 text-sm mb-4 font-light tracking-widest uppercase">
                      <MapPin className="w-4 h-4 mr-2 text-primary-400" />
                      <span>{dest.location}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-white/50 uppercase tracking-widest mb-1 flex items-center">
                          <Calendar className="w-3 h-3 mr-1"/> Best Season
                        </span>
                        <span className="text-sm font-medium text-white/90">{dest.bestSeason}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-white/50 uppercase tracking-widest mb-1 flex items-center">
                          <Wallet className="w-3 h-3 mr-1"/> Est. Budget
                        </span>
                        <span className="text-sm font-medium text-white/90">{dest.budget}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
