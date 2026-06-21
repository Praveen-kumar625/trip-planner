import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Search, MapPin, ArrowRight, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProgressiveImage } from '@/components/ui/Image';
import InfiniteDestinationFeed from '@/components/discovery/InfiniteDestinationFeed';

// -------------------------------------------------------------
// 1. CINEMATIC HERO COMPONENT
// -------------------------------------------------------------
function CinematicHero({ searchQuery, setSearchQuery, onSearchSubmit }) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 400]);
  const opacity = useTransform(scrollY, [0, 800], [1, 0]);
  const scale = useTransform(scrollY, [0, 1000], [1, 1.2]);

  return (
    <section className="relative w-full h-[100svh] overflow-hidden bg-black">
      {/* Background Cinematic Image */}
      <motion.div
        style={{ y: y1, scale, opacity }}
        className="absolute inset-0 w-full h-full"
      >
        <ProgressiveImage
          src="https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=2069&auto=format&fit=crop"
          aspectRatio="none"
          containerClassName="w-full h-full"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-black/40" />
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
          <h1 className="text-[15vw] md:text-[12vw] leading-none font-display font-bold uppercase mb-4"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=2000&auto=format&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              display: 'inline-block'
            }}>
            Discover
          </h1>

          <p className="text-xl md:text-3xl text-white/80 font-serif italic mb-16">
            The extraordinary awaits
          </p>

          {/* Minimalist Glass Search */}
          <form onSubmit={onSearchSubmit} className="relative w-full max-w-2xl mx-auto group">
            <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl transition-all duration-700 group-hover:bg-primary-500/20 group-hover:blur-3xl" />
            <div className="relative flex items-center glass-dark border border-white/20 rounded-full p-2 md:p-3 transition-all duration-700 group-hover:border-white/40 group-focus-within:border-primary-500/50">
              <div className="pl-6 pr-4 text-white/50 group-focus-within:text-primary-400 transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <input
                type="text"
                placeholder="Where does your soul want to go?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none text-white text-lg md:text-xl font-display font-light placeholder:text-white/40 focus:outline-none focus:ring-0 py-4 px-2"
              />
              <button
                type="submit"
                className="flex items-center justify-center bg-white text-black w-14 h-14 md:w-16 md:h-16 rounded-full hover:scale-105 hover:bg-primary-50 transition-all duration-500"
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
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/50"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </motion.div>
    </section>
  );
}

// -------------------------------------------------------------
// 2. HORIZONTAL SCROLL EDITORIAL SECTION
// -------------------------------------------------------------
const editorialCards = [
  { 
    id: 'udaipur',
    headline: 'Royal Heritage',
    location: 'Udaipur, Rajasthan',
    image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=2070&auto=format&fit=crop',
    mood: 'Luxury',
    budget: 'Premium'
  },
  { 
    id: 'kerala',
    headline: 'Emerald Waters',
    location: 'Kerala Backwaters',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2070&auto=format&fit=crop',
    mood: 'Serenity',
    budget: 'Luxe'
  },
  { 
    id: 'ladakh',
    headline: 'High Altitude',
    location: 'Leh Ladakh',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop',
    mood: 'Adventure',
    budget: 'Premium'
  },
  { 
    id: 'varanasi',
    headline: 'Spiritual Core',
    location: 'Varanasi, UP',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2076&auto=format&fit=crop',
    mood: 'Culture',
    budget: 'Moderate'
  },
];

function HorizontalScrollEditorial() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const x = useTransform(smoothProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-[#080D17]">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center">

        {/* Background typographic noise */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full text-[20vw] font-display font-black text-white/[0.02] uppercase leading-none whitespace-nowrap pointer-events-none select-none flex">
          <motion.div style={{ x: useTransform(smoothProgress, [0, 1], ["0%", "-50%"]) }}>
            INCREDIBLE INDIA AND BEYOND
          </motion.div>
        </div>

        {/* The horizontally moving container */}
        <motion.div style={{ x }} className="flex w-[400vw] h-full items-center">
          {editorialCards.map((card, index) => {
            return (
              <div key={index} className="w-[100vw] h-full flex flex-col items-center justify-center px-4 md:px-24">
                <div className="relative w-full max-w-6xl aspect-[4/5] md:aspect-[21/9] group overflow-hidden rounded-3xl shadow-premium-lg">
                  <ProgressiveImage
                    src={card.image}
                    aspectRatio="none"
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover transition-transform duration-[3s] ease-out group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-16">
                    <div className="flex justify-between items-start text-white/80">
                      <span className="text-sm font-bold tracking-[0.2em] uppercase text-primary-400">{String(index + 1).padStart(2, '0')}</span>
                      <span className="text-sm font-bold tracking-[0.2em] uppercase flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-500" /> {card.location}</span>
                    </div>

                    <div>
                      <h2 className="text-5xl md:text-8xl font-display font-light text-white mb-6 uppercase tracking-wide drop-shadow-lg">
                        {card.headline}
                      </h2>
                      <div className="flex items-center gap-4 text-white/80">
                        <span className="text-xs font-bold tracking-[0.2em] uppercase">{card.mood}</span>
                        <div className="w-12 h-[1px] bg-white/30" />
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary-400">{card.budget}</span>
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
    <section ref={mapRef} className="relative w-full h-[120vh] bg-black overflow-hidden flex items-center justify-center">
      <motion.div style={{ scale, opacity }} className="absolute inset-0 w-full h-full">
        <ProgressiveImage
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop"
          aspectRatio="none"
          containerClassName="w-full h-full"
          className="w-full h-full object-cover mix-blend-screen opacity-50 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </motion.div>

      <div className="relative z-10 text-center flex flex-col items-center">
        <h2 className="text-4xl md:text-7xl font-serif italic text-white mb-8 tracking-wide">
          Explore The Atlas
        </h2>
        <button className="group flex items-center gap-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full transition-all duration-500 shadow-premium">
          <span className="text-sm font-bold tracking-[0.2em] uppercase">Open Interactive Map</span>
          <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform">
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
      navigate('/ai-concierge', { state: { initialPrompt: searchQuery } });
    }
  };

  return (
    <div className="w-full bg-[#080D17] selection:bg-primary-500 selection:text-white">

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
      <section className="bg-[#080D17] pt-32 pb-48 relative z-20">
        <div className="mb-24 text-center px-4 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-display font-light text-white mb-8 tracking-wide">
            The Discovery Feed
          </h2>
          <p className="text-xl text-white/50 font-serif italic">
            An endless curation of the world's most breathtaking escapes.
          </p>
        </div>

        <div className="w-full px-4 md:px-12 lg:px-24">
          <InfiniteDestinationFeed />
        </div>
      </section>

    </div>
  );
}
