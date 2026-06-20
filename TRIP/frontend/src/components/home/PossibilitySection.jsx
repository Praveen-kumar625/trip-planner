import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Layout';

const PERSONAS = [
  {
    id: 'luxury',
    title: 'The Luxury Escapist',
    subtitle: 'Five-star everything. Zero compromises.',
    description: 'You seek the extraordinary. Private villas, Michelin-starred dining, and seamless travel logistics. Let the AI curate experiences that money can barely buy.',
    image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=2070&auto=format&fit=crop', // Luxury resort
  },
  {
    id: 'nomad',
    title: 'The Digital Nomad',
    subtitle: 'Work from paradise. Fast Wi-Fi guaranteed.',
    description: 'Your office is the world. Our AI finds the perfect balance of inspiring views, reliable internet, and vibrant expat communities for your month-long stints.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop', // Working in cafe/bali
  },
  {
    id: 'adventure',
    title: 'The Thrill Seeker',
    subtitle: 'Off the grid. Into the wild.',
    description: 'You crave adrenaline and untouched landscapes. Discover hidden trails, extreme sports, and raw nature with itineraries built for the bold.',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=2070&auto=format&fit=crop', // Adventure van/mountains
  },
  {
    id: 'culture',
    title: 'The Culture Purist',
    subtitle: 'Local secrets. Authentic heritage.',
    description: 'You want to blend in, not stand out. Uncover secret temples, neighborhood bistros, and authentic traditions that tourists never see.',
    image: 'https://images.unsplash.com/photo-1580404092500-1114d23eb399?q=80&w=2070&auto=format&fit=crop', // Cultural street
  }
];

export default function PossibilitySection() {
  const [activePersona, setActivePersona] = useState(PERSONAS[0]);

  return (
    <section className="relative w-full min-h-screen py-24 md:py-32 bg-black overflow-hidden flex items-center">
      
      {/* Dynamic Background Image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={activePersona.id}
          src={activePersona.image}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.4, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent z-10" />

      <Container className="relative z-20 w-full">
        <div className="flex flex-col mb-16">
          <span className="text-accent-400 font-bold tracking-[0.2em] uppercase text-sm mb-4">
            The Possibility Engine
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-serif font-black text-white leading-tight tracking-tight max-w-3xl">
            What kind of traveler are you becoming?
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          
          {/* Left: Persona List */}
          <div className="w-full lg:w-5/12 flex flex-col gap-2">
            {PERSONAS.map((persona) => (
              <div 
                key={persona.id}
                onMouseEnter={() => setActivePersona(persona)}
                onClick={() => setActivePersona(persona)}
                className={`group cursor-pointer p-6 border-l-4 transition-all duration-500 ${
                  activePersona.id === persona.id 
                    ? 'border-white bg-white/10 backdrop-blur-md' 
                    : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                }`}
              >
                <h3 className={`text-2xl md:text-3xl font-serif font-bold transition-colors duration-500 ${
                  activePersona.id === persona.id ? 'text-white' : 'text-white/40 group-hover:text-white/70'
                }`}>
                  {persona.title}
                </h3>
              </div>
            ))}
          </div>

          {/* Right: Dynamic Storytelling */}
          <div className="w-full lg:w-7/12 min-h-[300px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePersona.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="max-w-xl"
              >
                <h4 className="text-xl md:text-2xl text-accent-300 font-medium mb-6 uppercase tracking-wider">
                  {activePersona.subtitle}
                </h4>
                <p className="text-lg md:text-xl text-white/80 font-light leading-relaxed mb-10">
                  {activePersona.description}
                </p>
                
                <button className="flex items-center gap-4 text-white font-bold uppercase tracking-widest text-sm hover:text-accent-400 transition-colors group">
                  Design Your {activePersona.title.split(' ')[1]} Journey
                  <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center group-hover:border-accent-400 group-hover:bg-accent-400 group-hover:text-black transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </div>
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </Container>
    </section>
  );
}
