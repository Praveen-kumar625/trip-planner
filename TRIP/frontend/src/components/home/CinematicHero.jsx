import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, MapPin } from 'lucide-react';
import { ProgressiveImage } from '@/components/ui/Image';

const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=2070&auto=format&fit=crop",
    label: "Taj Lake Palace, Udaipur"
  },
  {
    src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop",
    label: "Zermatt, Switzerland"
  },
  {
    src: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2070&auto=format&fit=crop",
    label: "Backwaters, Kerala"
  },
  {
    src: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2070&auto=format&fit=crop",
    label: "Nubra Valley, Ladakh"
  },
  {
    src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
    label: "Amanpuri, Phuket"
  }
];

export default function CinematicHero({ onSearchOpen }) {
  const { scrollY } = useScroll();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 7000); // 7 seconds per image for slower cinematic feel
    return () => clearInterval(interval);
  }, []);
  
  // Layer 1 & Background Motion: Gliding forward
  const bgScale = useTransform(scrollY, [0, 800], [1.02, 1.15]);
  const bgY = useTransform(scrollY, [0, 1000], [0, 120]);
  
  // Layer 4: Typography Monument (Subtle, elegant push forward)
  const textScale = useTransform(scrollY, [0, 600], [1, 1.3]);
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const textY = useTransform(scrollY, [0, 600], [0, 80]);
  
  // Layer 5/7: Foreground Elements fade out elegantly
  const foregroundOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const foregroundY = useTransform(scrollY, [0, 300], [0, -20]);

  // Layer 2: Atmospheric gradient deepening
  const overlayOpacity = useTransform(scrollY, [0, 600], [0.3, 0.95]);

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
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <ProgressiveImage 
                src={HERO_IMAGES[currentImageIndex].src} 
                aspectRatio="none"
                containerClassName="w-full h-full"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* LAYER 2: Atmospheric Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent z-10" />
        <motion.div 
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-black z-10 mix-blend-multiply" 
        />
        
        {/* LAYER 3: Soft Cinematic Fog (Static noise/texture overlay) */}
        <div className="absolute inset-0 opacity-[0.04] z-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        {/* Location Tag */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute top-24 md:top-32 left-0 right-0 z-20 flex justify-center pointer-events-none"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 1 }}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-premium"
            >
              <MapPin className="w-3.5 h-3.5 text-white/80" />
              <span className="text-xs tracking-widest text-white/90 font-medium uppercase">
                {HERO_IMAGES[currentImageIndex].label}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* LAYER 4: Typography Monument */}
        <motion.div 
          style={{ scale: textScale, opacity: textOpacity, y: textY }}
          className="relative z-20 flex flex-col items-center justify-center pointer-events-none w-full px-4"
        >
          <h1 className="text-display-xl font-display font-light text-white leading-[0.85] tracking-tight uppercase drop-shadow-2xl">
            Wander<span className="font-semibold text-gradient-luxury">Sync</span>
          </h1>
          <h2 className="mt-8 text-white/80 text-sm md:text-xl font-serif italic drop-shadow-lg text-center max-w-2xl">
            Elevated journeys. Designed around your life.
          </h2>
        </motion.div>

        {/* LAYER 5 & 7: Glassmorphism Concierge & Foreground Interactions */}
        <motion.div 
          style={{ opacity: foregroundOpacity, y: foregroundY }}
          className="absolute z-30 bottom-12 md:bottom-20 w-full flex flex-col items-center px-4 md:px-8"
        >
          {/* Apple Glass Concierge Desk */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSearchOpen}
            className="w-full max-w-3xl mx-auto glass-premium dark:glass-dark rounded-[2rem] shadow-premium border border-white/30 cursor-text overflow-hidden group relative flex items-center p-2.5 md:p-3 transition-all duration-500 hover:border-primary-500/50 hover:shadow-glow-saffron"
          >
            {/* Subtle Reflection */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -translate-x-full group-hover:translate-x-full ease-in-out" />
            
            <div className="flex-1 flex items-center px-4 md:px-6">
              <Search className="w-5 h-5 md:w-6 md:h-6 text-white/70 mr-4 shrink-0 group-hover:text-amber-400 transition-colors" />
              <div className="flex flex-col items-start w-full">
                <span className="text-sm md:text-lg text-white/80 font-medium truncate group-hover:text-white transition-colors font-serif">
                  "A luxury weekend in Udaipur under ₹1,50,000..."
                </span>
              </div>
            </div>
            
            <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 bg-amber-500 text-black rounded-full flex items-center justify-center group-hover:bg-amber-400 transition-colors duration-500 shadow-premium group-hover:shadow-glow-saffron">
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            </div>
          </motion.div>
          
          {/* Layer 6: Subtle Travel Particles / Scroll Indicator */}
          <div className="mt-12 flex flex-col items-center gap-4 opacity-60">
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white font-bold">Begin Exploration</span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
