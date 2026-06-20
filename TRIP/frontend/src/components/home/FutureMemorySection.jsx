import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Container } from '@/components/ui/Layout';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { ProgressiveImage } from '@/components/ui/Image';

const MEMORY_IMAGES = [
  'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2070&auto=format&fit=crop', // Couple overlooking valley
  'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2070&auto=format&fit=crop', // Woman in desert
  'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2070&auto=format&fit=crop', // Roadtrip
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2070&auto=format&fit=crop', // Tropical beach walk
];

export default function FutureMemorySection({ onSearchOpen }) {
  const { scrollYProgress } = useScroll();
  
  return (
    <section className="relative w-full min-h-[120vh] bg-black overflow-hidden flex flex-col justify-center py-32">
      
      {/* Parallax Background Grid of Memories */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 opacity-30 mix-blend-screen pointer-events-none">
        {MEMORY_IMAGES.map((img, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, delay: idx * 0.2, ease: "easeOut" }}
            className={`w-full h-full ${idx % 2 === 0 ? 'md:-translate-y-12' : 'md:translate-y-12'}`}
          >
            <ProgressiveImage 
              src={img} 
              className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black z-10" />

      <Container className="relative z-20 flex flex-col items-center text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <span className="text-accent-400 font-bold tracking-[0.4em] uppercase text-xs md:text-sm mb-12 drop-shadow-lg">
            The Future
          </span>
          
          <h2 className="text-4xl md:text-6xl lg:text-[6rem] font-serif font-light text-white leading-[1.1] tracking-tight max-w-5xl mb-12 drop-shadow-2xl">
            Imagine looking back at this moment <br className="hidden md:block"/>
            <span className="italic font-bold text-accent-300">5 years from now.</span>
          </h2>
          
          <p className="text-lg md:text-2xl text-white/70 font-sans font-light leading-relaxed max-w-3xl mx-auto mb-16">
            We don't sell flights. We don't sell hotel rooms. We engineer the exact moments you will remember for the rest of your life.
          </p>

          {/* Interactive Future Input */}
          <div className="w-full max-w-2xl relative group">
            <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl group-hover:bg-white/10 transition-colors duration-700"></div>
            <div className="relative bg-black/40 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl transition-all duration-500 hover:border-white/40">
              <div className="flex-1 flex flex-col items-start w-full">
                <label className="text-accent-400 text-xs font-bold uppercase tracking-widest mb-3">Your Future Memory</label>
                <div className="flex items-center w-full text-xl md:text-2xl font-serif text-white">
                  <span className="mr-3 opacity-80 whitespace-nowrap">"I will be</span>
                  <input 
                    type="text" 
                    placeholder="sailing the Greek islands..."
                    className="w-full bg-transparent border-b border-white/30 focus:border-white focus:outline-none placeholder-white/30 italic text-accent-100 py-1"
                    onClick={(e) => {
                      e.preventDefault();
                      // Trigger full search/concierge when they try to interact, for a seamless flow
                      onSearchOpen();
                    }}
                  />
                  <span className="ml-2 opacity-80">"</span>
                </div>
              </div>
              <button 
                onClick={onSearchOpen}
                className="shrink-0 w-16 h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 hover:bg-accent-100 transition-transform duration-500 shadow-xl"
              >
                <PlayCircle className="w-8 h-8" />
              </button>
            </div>
          </div>
        </motion.div>

      </Container>
    </section>
  );
}
