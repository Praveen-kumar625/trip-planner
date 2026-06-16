import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Compass, MapPin, ChevronRight, Search, Heart, Map, Coffee, Mountain, Sun, Sparkles, Wind, ArrowRight } from 'lucide-react';
import Lenis from 'lenis';
import { Section, Container } from '@/components/ui/Layout';

/* 
 * MASTER RESPONSIVE DESIGN PROMPT INTEGRATION
 * =========================================================
 * STRATEGY: Mobile-First + Fluid Typography & Fluid Heights
 * 
 * 1. MOBILE (Default, < 640px)
 *    - Typography: Scaled down (text-4xl to text-5xl for headers).
 *    - Layout: Full width stacks (flex-col). 
 *    - Destinations Grid: 1 Column stack (grid-cols-1), auto-rows at 250px.
 *    - Paddings: Tighter vertical rhythm (py-16, gap-8).
 * 
 * 2. TABLET (sm: >= 640px to md: < 768px)
 *    - Typography: Medium scale (text-5xl to text-6xl).
 *    - Destinations Grid: 2 Columns (sm:grid-cols-2) perfectly balancing the 4 destinations per page.
 * 
 * 3. DESKTOP / LAPTOP (md: >= 768px, lg: >= 1024px)
 *    - Typography: Heroic scale (text-7xl to text-8xl).
 *    - Layout: Side-by-side flex (lg:flex-row).
 *    - Destinations Grid: 3 Columns Bento Grid (md:grid-cols-3) with row spans.
 * =========================================================
 */

const DESTINATIONS = [
  // Page 1
  { name: 'Udaipur, Rajasthan', img: 'https://images.unsplash.com/photo-1615836245337-f839dffdbac3?q=80&w=1200&auto=format&fit=crop', tag: 'Royal Heritage', label: 'Luxury', className: 'md:col-span-2 md:row-span-2' },
  { name: 'Munnar, Kerala', img: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=1200&auto=format&fit=crop', tag: 'Emerald Estates', label: 'Nature', className: 'md:col-span-1 md:row-span-1' },
  { name: 'Gulmarg, Kashmir', img: 'https://images.unsplash.com/photo-1583151811568-a006c07802b5?q=80&w=1200&auto=format&fit=crop', tag: 'Mist & Mountains', label: 'Winter', className: 'md:col-span-1 md:row-span-1' },
  { name: 'South Goa', img: 'https://images.unsplash.com/photo-1590528659858-692decfd0bfa?q=80&w=1200&auto=format&fit=crop', tag: 'Coastal Serenity', label: 'Weekend', className: 'md:col-span-2 md:row-span-1' },
  // Page 2
  { name: 'Varanasi, UP', img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200&auto=format&fit=crop', tag: 'Spiritual Capital', label: 'Culture', className: 'md:col-span-2 md:row-span-2' },
  { name: 'Leh Ladakh', img: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1200&auto=format&fit=crop', tag: 'High Desert', label: 'Adventure', className: 'md:col-span-1 md:row-span-1' },
  { name: 'Andaman Islands', img: 'https://images.unsplash.com/photo-1586555198084-fb5f52ce799d?q=80&w=1200&auto=format&fit=crop', tag: 'Crystal Waters', label: 'Tropical', className: 'md:col-span-1 md:row-span-1' },
  { name: 'Ranthambore', img: 'https://images.unsplash.com/photo-1563223552-30d01adceac3?q=80&w=1200&auto=format&fit=crop', tag: 'Tiger Safari', label: 'Wildlife', className: 'md:col-span-2 md:row-span-1' },
  // Page 3
  { name: 'Rishikesh', img: 'https://images.unsplash.com/photo-1600018596009-4eeccb95a8f4?q=80&w=1200&auto=format&fit=crop', tag: 'Yoga Capital', label: 'Wellness', className: 'md:col-span-2 md:row-span-2' },
  { name: 'Darjeeling', img: 'https://images.unsplash.com/photo-1544634076-a90160ddf44a?q=80&w=1200&auto=format&fit=crop', tag: 'Queen of Hills', label: 'Nature', className: 'md:col-span-1 md:row-span-1' },
  { name: 'Hampi, Karnataka', img: 'https://images.unsplash.com/photo-1600100397608-f010f41cb8ea?q=80&w=1200&auto=format&fit=crop', tag: 'Ancient Ruins', label: 'History', className: 'md:col-span-1 md:row-span-1' },
  { name: 'Pondicherry', img: 'https://images.unsplash.com/photo-1586940026600-b6159c3a9f0e?q=80&w=1200&auto=format&fit=crop', tag: 'French Riviera', label: 'Weekend', className: 'md:col-span-2 md:row-span-1' },
];

const HERO_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop', title: 'Taj Mahal, Agra', subtitle: 'Golden Triangle Route' },
  { url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&auto=format&fit=crop', title: 'Hawa Mahal, Jaipur', subtitle: 'The Pink City' },
  { url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop', title: 'Kerala Backwaters', subtitle: 'God\'s Own Country' },
  { url: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?q=80&w=1200&auto=format&fit=crop', title: 'Varanasi Ghats', subtitle: 'Spiritual Capital' }
];

export function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [currentDestPage, setCurrentDestPage] = useState(0);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const heroTimer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000); // Change image every 4 seconds

    const destTimer = setInterval(() => {
      setCurrentDestPage((prev) => (prev + 1) % Math.ceil(DESTINATIONS.length / 4));
    }, 6000); // Change destinations grid every 6 seconds

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(heroTimer);
      clearInterval(destTimer);
      lenis.destroy();
    };
  }, []);

  const fadeUp = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <div className="flex min-h-screen flex-col bg-mesh text-primary-50 overflow-x-hidden font-sans relative" ref={containerRef}>
      
      {/* Background glowing orbs */}
      <div className="fixed top-[10%] left-[5%] w-96 h-96 bg-accent-500/10 rounded-full blur-[120px] pointer-events-none animate-float" />
      <div className="fixed top-[40%] right-[5%] w-[30rem] h-[30rem] bg-second-500/5 rounded-full blur-[150px] pointer-events-none animate-float-delayed" />
      
      {/* --- NAVBAR --- */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'glass-nav py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1200px] mx-auto px-6 w-full flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-accent-400 border border-white/20 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500" aria-hidden="true" />
            </div>
            <span className="font-black text-2xl tracking-tight text-white drop-shadow-md">WANDERSYNC</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-10">
            <a href="#destinations" className="text-sm font-bold uppercase tracking-wider text-primary-200 hover:text-white transition-colors drop-shadow-sm">Destinations</a>
            <a href="#experience" className="text-sm font-bold uppercase tracking-wider text-primary-200 hover:text-white transition-colors drop-shadow-sm">Experience</a>
            <a href="#ai" className="text-sm font-bold uppercase tracking-wider text-primary-200 hover:text-white transition-colors drop-shadow-sm">AI Planner</a>
          </nav>

          <button className="btn-outline hidden md:inline-flex" onClick={() => navigate('/planner')}>
            Plan a Trip
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col w-full relative z-10 pt-32">
        
        {/* --- HERO SECTION --- */}
        <Section className="pb-16 sm:pb-24 lg:pb-32 min-h-[85vh] flex items-center">
          <Container className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 w-full">
            <motion.div 
              className="flex-1 text-left z-10"
              variants={stagger}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeUp} className="mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-md text-xs font-bold text-accent-400 uppercase tracking-widest border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                <Sparkles className="w-4 h-4" aria-hidden="true" /> The Next Generation of Travel
              </motion.div>

              <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 leading-[1.05] drop-shadow-xl">
                Plan Smarter. <br/>
                <span className="text-brand-gradient">Travel Better.</span>
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg sm:text-xl md:text-2xl text-primary-200 font-medium leading-relaxed max-w-xl mb-10 md:mb-12 drop-shadow-md">
                Discover Incredible India effortlessly. Tell our AI where you want to go, and get a beautifully curated, personalized itinerary in seconds.
              </motion.p>

              <motion.div variants={fadeUp} className="w-full max-w-lg glass-card flex items-center p-2 group hover:border-accent-500/50 transition-colors">
                <div className="pl-4 pr-2">
                  <Search className="w-6 h-6 text-primary-400 group-hover:text-accent-400 transition-colors" aria-hidden="true" />
                </div>
                <input 
                  type="text" 
                  className="w-full bg-transparent border-none outline-none py-4 text-lg font-bold text-white placeholder:text-primary-400/70"
                  placeholder="Where would you like to go?"
                  onFocus={() => navigate('/planner')}
                />
                <button 
                  className="btn-primary rounded-xl p-4 !px-4"
                  onClick={() => navigate('/planner')}
                  aria-label="Start Planning"
                >
                  <ChevronRight className="w-6 h-6" aria-hidden="true" />
                </button>
              </motion.div>
            </motion.div>

          <motion.div 
            className="flex-1 w-full relative h-[400px] sm:h-[500px] lg:h-[700px] flex items-center justify-center perspective-[1000px]"
            initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
          >
            {/* Main Hero Image Slider */}
            <div className="absolute inset-0 w-full h-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              <motion.div 
                className="absolute inset-0 w-full h-full"
                style={{ y, opacity }}
              >
                <AnimatePresence>
                  <motion.img 
                    key={currentHeroIndex}
                    src={HERO_IMAGES[currentHeroIndex].url} 
                    alt={HERO_IMAGES[currentHeroIndex].title}
                    className="absolute inset-0 w-full h-full object-cover scale-105"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1.05 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&auto=format&fit=crop' }}
                  />
                </AnimatePresence>
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/20 to-transparent"></div>
              
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentHeroIndex}
                  className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white z-20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="font-black text-2xl md:text-4xl mb-2 md:mb-3 drop-shadow-lg">{HERO_IMAGES[currentHeroIndex].title}</div>
                  <div className="flex items-center gap-2 text-sm md:text-base font-bold text-accent-400 drop-shadow-md"><MapPin className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" /> {HERO_IMAGES[currentHeroIndex].subtitle}</div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Floating Glass UI Elements removed as per user request */}
          </motion.div>
          </Container>
        </Section>

        {/* --- MOODS --- */}
        <Section variant="gradient" spacing="default">
          <Container>
            <h3 className="text-center text-xs md:text-sm font-black text-primary-400 uppercase tracking-[0.2em] mb-10 md:mb-16 drop-shadow-sm">Explore India by Mood</h3>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10">
              {[
                { icon: Mountain, label: 'Himalayan', color: 'from-blue-400 to-blue-600' },
                { icon: Sun, label: 'Heritage', color: 'from-orange-400 to-orange-600' },
                { icon: Wind, label: 'Beaches', color: 'from-cyan-400 to-cyan-600' },
                { icon: Coffee, label: 'Cafes', color: 'from-amber-700 to-amber-900' },
                { icon: Heart, label: 'Romantic', color: 'from-rose-400 to-rose-600' }
              ].map((mood, idx) => (
                <motion.div 
                  key={idx} 
                  className="group flex flex-col items-center gap-5 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-[1.5rem] bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex items-center justify-center transition-all duration-300 group-hover:-translate-y-2 group-hover:bg-white/10 group-hover:border-white/20 group-hover:shadow-[0_15px_35px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-br ${mood.color}`} />
                    <mood.icon className="w-8 h-8 md:w-10 md:h-10 text-primary-300 group-hover:text-white transition-colors duration-300 relative z-10" aria-hidden="true" />
                  </div>
                  <span className="font-bold text-xs md:text-sm uppercase tracking-wider text-primary-300 group-hover:text-white transition-colors">{mood.label}</span>
                </motion.div>
              ))}
            </div>
          </Container>
        </Section>

        {/* --- DESTINATIONS BENTO GRID --- */}
        <Section id="destinations" spacing="lg">
          <Container>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6">
              <div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs font-bold text-second-400 uppercase tracking-widest mb-4"
                >
                  Curated Escapes
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg"
                >
                  Popular Destinations
                </motion.h2>
              </div>
              <motion.button 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 text-accent-400 font-bold hover:text-accent-300 transition-colors group text-sm md:text-base"
                onClick={() => navigate('/planner')}
              >
                View all destinations <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </motion.button>
            </div>
            
            <div className="relative h-[1050px] sm:h-[550px] md:h-[650px] w-full">
              <AnimatePresence>
                <motion.div 
                  key={currentDestPage}
                  className="absolute inset-0 w-full h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[250px] md:auto-rows-[300px]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  {DESTINATIONS.slice(currentDestPage * 4, currentDestPage * 4 + 4).map((dest, idx) => (
                    <div 
                      key={dest.name} 
                      className={`group relative rounded-[2rem] overflow-hidden cursor-pointer shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-white/10 bg-primary-800 ${dest.className}`}
                    >
                      <img 
                        src={dest.img} 
                        alt={dest.name}
                        className="w-full h-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-110"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200&auto=format&fit=crop' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-950/20 to-transparent transition-opacity duration-500 group-hover:opacity-80 pointer-events-none" />
                    
                    <div className="absolute top-6 left-6 z-10">
                      <span className="px-4 py-2 bg-white/10 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest rounded-xl border border-white/20 shadow-lg">
                        {dest.label}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 z-10 transform transition-transform duration-500 group-hover:-translate-y-2">
                      <h3 className="text-2xl md:text-3xl font-black text-white mb-2 md:mb-3 drop-shadow-md">{dest.name}</h3>
                      <p className="text-accent-400 font-bold text-xs md:text-sm flex items-center gap-2 drop-shadow-md">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" /> {dest.tag}
                      </p>
                    </div>
                  </div>
                ))}
                  </motion.div>
                </AnimatePresence>
              </div>
          </Container>
        </Section>

        {/* --- AI CONCIERGE --- */}
        <Section id="ai" spacing="lg">
          <div className="absolute inset-0 bg-primary-900/30 backdrop-blur-3xl border-y border-white/5" />
          <Container>
            <div className="flex flex-col lg:flex-row gap-12 md:gap-20 items-center">
              
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md text-[10px] md:text-xs font-black text-second-400 uppercase tracking-widest mb-6 md:mb-8 border border-white/10 shadow-lg">
                  Intelligent Planning
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 md:mb-8 leading-[1.1] text-white drop-shadow-xl">
                  Like talking to a <br className="hidden md:block"/>
                  <span className="text-brand-gradient">local expert.</span>
                </h2>
                <p className="text-primary-200 font-medium text-lg md:text-xl mb-10 md:mb-12 max-w-lg leading-relaxed">
                  Skip the endless research. Tell the AI what you like, who you're with, and your budget. It creates a personalized day-by-day itinerary instantly.
                </p>
                
                <ul className="space-y-6">
                  {[
                    'Optimized routing to save travel time',
                    'Hidden gem restaurant recommendations',
                    'Realistic budget estimations',
                    'Interactive map integrations'
                  ].map((item, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-center gap-4 md:gap-5 text-white font-bold text-base md:text-lg"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + (i * 0.1) }}
                    >
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-second-400 to-second-600 flex items-center justify-center text-white border border-white/20 shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0">✓</div>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div 
                className="flex-1 w-full max-w-lg mx-auto"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="glass-panel p-6 sm:p-8 md:p-10 relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="flex items-center gap-4 md:gap-5 mb-8 md:mb-10 pb-6 md:pb-8 border-b border-white/10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-[0_0_20px_rgba(245,143,10,0.4)]">
                      <Sparkles className="w-7 h-7 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-black text-xl text-white">Wandersync AI</div>
                      <div className="text-sm font-bold text-second-400 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-second-400 animate-pulse" /> Always active
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 md:space-y-6 mb-8 md:mb-10">
                    <motion.div 
                      className="bg-white/5 backdrop-blur-md p-4 sm:p-6 rounded-3xl rounded-tr-sm text-sm sm:text-base font-bold border border-white/10 ml-2 sm:ml-8 text-primary-100 shadow-md"
                      initial={{ opacity: 0, scale: 0.9, originX: 1, originY: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 }}
                    >
                      "I need a 3-day quiet trip to Coorg for my parents, under ₹20k total."
                    </motion.div>
                    <motion.div 
                      className="bg-gradient-to-br from-primary-800 to-primary-900 p-4 sm:p-6 rounded-3xl rounded-tl-sm text-sm sm:text-base font-bold text-white border border-white/10 mr-2 sm:mr-8 shadow-lg relative overflow-hidden"
                      initial={{ opacity: 0, scale: 0.9, originX: 0, originY: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1 }}
                    >
                      <div className="absolute inset-0 bg-white/5 animate-pulse" />
                      <span className="relative z-10">"Perfect. I've found a serene homestay in Madikeri and planned light walking activities with beautiful viewpoints. Generating the itinerary now."</span>
                    </motion.div>
                  </div>
                  
                  <button className="w-full btn-primary text-lg py-4" onClick={() => navigate('/planner')}>
                    Try it yourself
                  </button>
                </div>
              </motion.div>
            </div>
          </Container>
        </Section>

        {/* --- FINAL CTA --- */}
        <Section spacing="xl" className="flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-950 pointer-events-none" />
          <div className="absolute bottom-0 w-full h-1/2 bg-accent-500/5 blur-[150px] pointer-events-none" />
          
          <Container size="sm" className="flex flex-col items-center justify-center">
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 md:mb-8 text-white tracking-tight drop-shadow-xl">
              Ready for your <br className="hidden sm:block"/><span className="text-brand-gradient">next trip?</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-primary-200 font-medium mb-10 md:mb-12 drop-shadow-md">
              Join thousands of travelers planning their journeys effortlessly.
            </p>
            <button className="btn-primary text-lg md:text-xl px-10 md:px-14 py-5 md:py-6" onClick={() => navigate('/planner')}>
              Start Planning for Free
            </button>
            </motion.div>
          </Container>
        </Section>
      </main>
      
      {/* --- FOOTER --- */}
      <footer className="w-full relative bg-primary-950/80 backdrop-blur-xl border-t border-white/10 pt-16 md:pt-20 pb-8 md:pb-10 z-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-start gap-12 md:gap-16">
          <div className="flex flex-col gap-4 md:gap-6 max-w-sm">
            <div className="flex items-center gap-3">
              <Compass className="w-7 h-7 md:w-8 md:h-8 text-accent-500" aria-hidden="true" />
              <span className="font-black text-xl md:text-2xl text-white tracking-tight">WANDERSYNC</span>
            </div>
            <p className="font-medium text-primary-300 text-sm md:text-base leading-relaxed">
              Your intelligent travel companion for discovering the beauty of India through seamless, AI-powered planning.
            </p>
          </div>
          <div className="flex gap-16">
            <div className="flex flex-col gap-5">
              <h4 className="font-black text-white text-sm uppercase tracking-widest opacity-80">Product</h4>
              <a href="#ai" className="font-bold text-sm text-primary-400 hover:text-white transition-colors">AI Planner</a>
              <a href="#destinations" className="font-bold text-sm text-primary-400 hover:text-white transition-colors">Destinations</a>
            </div>
            <div className="flex flex-col gap-5">
              <h4 className="font-black text-white text-sm uppercase tracking-widest opacity-80">Legal</h4>
              <a href="#" className="font-bold text-sm text-primary-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="font-bold text-sm text-primary-400 hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 mt-20 pt-8 border-t border-white/10 text-center">
          <div className="font-bold text-xs text-primary-500 uppercase tracking-widest">
            © {new Date().getFullYear()} Wandersync. Designed for travelers.
          </div>
        </div>
      </footer>
    </div>
  );
}