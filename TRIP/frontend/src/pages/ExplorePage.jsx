import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Search, MapPin, ArrowRight, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProgressiveImage } from '@/components/ui/Image';
import InfiniteDestinationFeed from '@/components/discovery/InfiniteDestinationFeed';
import { globalDestinations } from '@/data/globalDestinations';

// -------------------------------------------------------------
// 1. CINEMATIC HERO COMPONENT
// -------------------------------------------------------------
function CinematicHero({ searchQuery, setSearchQuery, onSearchSubmit }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 800], [1, 0]);
  const scale = useTransform(scrollY, [0, 1000], [1, 1.2]);

  return (
    <section className="relative w-full h-[100svh] overflow-hidden bg-[#050505]">
      {/* Background Cinematic Image */}
      <motion.div
        style={{ y: y1, scale, opacity }}
        className="absolute inset-0 w-full h-full"
      >
        <ProgressiveImage
          src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2070&auto=format&fit=crop"
          aspectRatio="none"
          containerClassName="w-full h-full"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-[#050505]/40" />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="w-full max-w-[90vw]"
        >
          {/* Masked Typography Effect */}
          <h1 className="text-[15vw] md:text-[12vw] leading-none font-black font-serif tracking-tighter uppercase mb-4"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2000&auto=format&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              display: 'inline-block'
            }}>
            Wander
          </h1>

          <p className="text-xl md:text-3xl text-white/60 font-light tracking-widest uppercase mb-16">
            The world is waiting
          </p>

          {/* Minimalist Glass Search */}
          <form onSubmit={onSearchSubmit} className="relative w-full max-w-2xl mx-auto group">
            <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl transition-all duration-700 group-hover:bg-white/10 group-hover:blur-3xl" />
            <div className="relative flex items-center bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full p-2 md:p-3 transition-all duration-700 group-hover:border-white/30 group-focus-within:border-white/50 group-focus-within:bg-black/60">
              <div className="pl-6 pr-4 text-white/40 group-focus-within:text-white/80 transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <input
                type="text"
                placeholder="Where does your soul want to go?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none text-white text-lg md:text-xl font-light placeholder:text-white/30 focus:outline-none focus:ring-0 py-4 px-2"
              />
              <button
                type="submit"
                className="flex items-center justify-center bg-white text-black w-14 h-14 md:w-16 md:h-16 rounded-full hover:scale-105 transition-transform duration-500"
              >
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/30"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent" />
      </motion.div>
    </section>
  );
}

// -------------------------------------------------------------
// 2. HORIZONTAL SCROLL EDITORIAL SECTION
// -------------------------------------------------------------
const editorialCards = [
  { ...globalDestinations.find(d => d.id === 'it-amalfi'), headline: 'The Riviera' },
  { ...globalDestinations.find(d => d.id === 'jp-kyoto'), headline: 'Zen Serenity' },
  { ...globalDestinations.find(d => d.id === 'ch-zermatt'), headline: 'Alpine Peaks' },
  { ...globalDestinations.find(d => d.id === 'mv-maldives'), headline: 'Ocean Void' },
];

function HorizontalScrollEditorial() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  // Create a buttery smooth spring for the scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Transform scroll progress (0 to 1) into horizontal translation (-0% to -75%)
  // Since we have 4 items, we scroll 3 screen widths to see them all
  const x = useTransform(smoothProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-[#050505]">
      {/* Sticky container that stays on screen while we scroll down 400vh */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center">

        {/* Background typographic noise */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full text-[20vw] font-black text-white/[0.02] font-serif leading-none whitespace-nowrap pointer-events-none select-none flex">
          <motion.div style={{ x: useTransform(smoothProgress, [0, 1], ["0%", "-50%"]) }}>
            LUXURY ESCAPES AROUND THE WORLD
          </motion.div>
        </div>

        {/* The horizontally moving container */}
        <motion.div style={{ x }} className="flex w-[400vw] h-full items-center">
          {editorialCards.map((card, index) => {
            if (!card) return null;
            return (
              <div key={index} className="w-[100vw] h-full flex flex-col items-center justify-center px-4 md:px-24">
                <div className="relative w-full max-w-6xl aspect-[4/5] md:aspect-[21/9] group overflow-hidden rounded-sm">
                  <ProgressiveImage
                    src={card.image}
                    aspectRatio="none"
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover transition-transform duration-[3s] ease-out group-hover:scale-105 opacity-60 group-hover:opacity-100"
                  />

                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-16">
                    <div className="flex justify-between items-start text-white/80">
                      <span className="text-sm font-light tracking-[0.2em] uppercase">{String(index + 1).padStart(2, '0')}</span>
                      <span className="text-sm font-light tracking-[0.2em] uppercase flex items-center gap-2"><MapPin className="w-4 h-4" /> {card.location}</span>
                    </div>

                    <div>
                      <h2 className="text-5xl md:text-8xl font-serif text-white mb-6 uppercase tracking-tighter mix-blend-overlay">
                        {card.headline}
                      </h2>
                      <div className="flex items-center gap-4 text-white/60">
                        <span className="text-xs tracking-[0.2em] uppercase">{card.mood}</span>
                        <div className="w-12 h-[1px] bg-white/30" />
                        <span className="text-xs tracking-[0.2em] uppercase">{card.budget}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}

// -------------------------------------------------------------
// 3. DEEP PARALLAX MAP TEASER
// -------------------------------------------------------------
function ParallaxMapTeaser() {
  const mapRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: mapRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  return (
    <section ref={mapRef} className="relative w-full h-[120vh] bg-[#050505] overflow-hidden flex items-center justify-center">
      <motion.div style={{ scale, opacity }} className="absolute inset-0 w-full h-full">
        {/* Using a stark, abstract dark satellite image or globe rendering */}
        <ProgressiveImage
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
          aspectRatio="none"
          containerClassName="w-full h-full"
          className="w-full h-full object-cover mix-blend-screen opacity-50 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
      </motion.div>

      <div className="relative z-10 text-center flex flex-col items-center">
        <h2 className="text-4xl md:text-7xl font-serif text-white mb-8 tracking-tighter">
          Explore The Globe
        </h2>
        <button className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white px-10 py-5 rounded-full transition-all duration-500">
          <span className="text-sm tracking-[0.2em] uppercase font-light">Open Interactive Map</span>
          <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </section>
  );
}

// -------------------------------------------------------------
// MAIN PAGE COMPONENT
// -------------------------------------------------------------
export function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/trip-planner', { state: { initialPrompt: searchQuery } });
    }
  };

  return (
    <div className="w-full bg-[#050505] selection:bg-white selection:text-black">

      {/* 1. HERO */}
      <CinematicHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* 2. HORIZONTAL EDITORIAL */}
      <HorizontalScrollEditorial />

      {/* 3. PARALLAX MAP TEASER */}
      <ParallaxMapTeaser />

      {/* 4. THE GLOBAL MOSAIC */}
      <section className="bg-[#050505] pt-32 pb-48 relative z-20">
        <div className="mb-24 text-center px-4 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-serif text-white mb-8 tracking-tighter">
            The Global Mosaic
          </h2>
          <p className="text-xl text-white/40 font-light tracking-wide">
            A limitless collection of luxury hidden gems.
          </p>
        </div>

        {/* Massive padding for luxury feel */}
        <div className="w-full px-4 md:px-12 lg:px-24">
          <InfiniteDestinationFeed />
        </div>
      </section>

    </div>
  );
}
