import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import { ProgressiveImage } from '@/components/ui/Image';

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop", // Coastal Villa
  "https://images.unsplash.com/photo-1542314831-c6a420325142?q=80&w=2070&auto=format&fit=crop", // Mountain Retreat
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop", // Swiss Alps Train
  "https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=2070&auto=format&fit=crop", // Overwater Villa
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop"  // Luxury Resort
];

export default function CinematicHero({ onSearchOpen }) {
  const { scrollY } = useScroll();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000); // 6 seconds per image
    return () => clearInterval(interval);
  }, []);
  // Layer 1 & Background Motion: Gliding forward
  const bgScale = useTransform(scrollY, [0, 800], [1.05, 1.15]);
  const bgY = useTransform(scrollY, [0, 1000], [0, 150]);
  
  // Layer 4: Typography Monument (Subtle, elegant push forward)
  const textScale = useTransform(scrollY, [0, 600], [1, 1.4]);
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const textY = useTransform(scrollY, [0, 600], [0, 100]);
  
  // Layer 5/7: Foreground Elements fade out elegantly
  const foregroundOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const foregroundY = useTransform(scrollY, [0, 300], [0, -20]);

  // Layer 2: Atmospheric gradient deepening
  const overlayOpacity = useTransform(scrollY, [0, 600], [0.4, 0.9]);

  return (
    <section className="relative w-full h-[150vh] bg-black">
      {/* Sticky container for smooth cinematic hold */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center">
        
        {/* LAYER 1: Luxury Background Imagery (Infinite Crossfade Loop) */}
        <motion.div 
          style={{ y: bgY, scale: bgScale }}
          className="absolute inset-0 w-full h-full transform-origin-bottom"
        >
          <AnimatePresence>
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <ProgressiveImage 
                src={HERO_IMAGES[currentImageIndex]} 
                aspectRatio="none"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* LAYER 2: Atmospheric Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent z-10" />
        <motion.div 
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-black z-10 mix-blend-multiply" 
        />
        
        {/* LAYER 3: Soft Cinematic Fog (Static noise/texture overlay) */}
        <div className="absolute inset-0 opacity-[0.03] z-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        {/* LAYER 4: Typography Monument */}
        <motion.div 
          style={{ scale: textScale, opacity: textOpacity, y: textY }}
          className="relative z-20 flex flex-col items-center justify-center pointer-events-none w-full px-4"
        >
          <h1 className="text-[12vw] md:text-[8rem] lg:text-[10rem] font-serif font-black text-white leading-[0.85] tracking-tighter uppercase drop-shadow-2xl">
            WanderSync
          </h1>
          <h2 className="mt-8 text-white/90 text-sm md:text-xl font-serif italic drop-shadow-lg text-center max-w-2xl">
            Curated journeys designed around your dreams.
          </h2>
        </motion.div>

        {/* LAYER 5 & 7: Glassmorphism Concierge & Foreground Interactions */}
        <motion.div 
          style={{ opacity: foregroundOpacity, y: foregroundY }}
          className="absolute z-30 bottom-12 md:bottom-20 w-full flex flex-col items-center px-4 md:px-8"
        >
          {/* Apple Glass Concierge Desk */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={onSearchOpen}
            className="w-full max-w-3xl mx-auto bg-white/[0.08] backdrop-blur-2xl rounded-3xl md:rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/[0.15] cursor-text overflow-hidden group relative flex items-center p-3 md:p-4 transition-all duration-500 hover:bg-white/[0.12] hover:border-white/[0.25]"
          >
            {/* Subtle Reflection */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -translate-x-full group-hover:translate-x-full ease-in-out" />
            
            <div className="flex-1 flex items-center px-4 md:px-6">
              <Search className="w-5 h-5 md:w-6 md:h-6 text-white/70 mr-4 shrink-0 group-hover:text-white transition-colors" />
              <div className="flex flex-col items-start w-full">
                <span className="text-sm md:text-lg text-white/80 font-medium truncate group-hover:text-white transition-colors font-serif">
                  "I want to wake up in a glass cabin in Norway..."
                </span>
              </div>
            </div>
            
            <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-white/90 text-slate-900 rounded-full flex items-center justify-center group-hover:bg-white transition-colors duration-500 shadow-lg group-hover:shadow-xl">
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </motion.div>
          
          {/* Layer 6: Subtle Travel Particles / Scroll Indicator */}
          <div className="mt-12 flex flex-col items-center gap-4 opacity-60">
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white font-bold">The Journey Begins</span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
