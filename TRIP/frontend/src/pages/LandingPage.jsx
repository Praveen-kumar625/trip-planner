import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, MapPin, Compass, Search, ArrowRight, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DestinationCard from '@/components/discovery/DestinationCard';
import SearchCommand from '@/components/navigation/SearchCommand';
import { Section, Container } from '@/components/ui/Layout';
import { ProgressiveImage } from '@/components/ui/Image';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2020&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop',
];

const trendingDestinations = [
  { id: 'tokyo', title: 'Tokyo', location: 'Japan', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1994&auto=format&fit=crop', rating: 4.9, weather: '18°C', price: '₹9,500', aiInsight: 'Cherry blossom season is approaching. Perfect for cultural immersion and food.' },
  { id: 'amalfi', title: 'Amalfi Coast', location: 'Italy', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2069&auto=format&fit=crop', rating: 4.8, weather: '24°C', price: '₹15,000', aiInsight: 'Ideal romantic getaway. Rent a vintage car for the coastal drive.' },
  { id: 'bali', title: 'Ubud', location: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2038&auto=format&fit=crop', rating: 4.7, weather: '29°C', price: '₹4,500', aiInsight: 'Spiritual retreat capital. High density of vegan cafes and yoga studios.' },
  { id: 'santorini', title: 'Santorini', location: 'Greece', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=2070&auto=format&fit=crop', rating: 4.9, weather: '26°C', price: '₹12,000', aiInsight: 'Unbeatable sunsets. Book catamaran tours well in advance.' },
];

const categories = [
  { name: 'Hidden Gems', icon: Compass, image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop' },
  { name: 'Luxury Escapes', icon: Sparkles, image: 'https://images.unsplash.com/photo-1542314831-c6a420325142?q=80&w=2070&auto=format&fit=crop' },
  { name: 'Weekend Breaks', icon: MapPin, image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=2068&auto=format&fit=crop' },
  { name: 'Foodie Trails', icon: Star, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop' },
];

export function LandingPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 400]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full min-h-screen bg-white dark:bg-slate-950">
      <section className="relative w-full h-[90vh] md:h-screen min-h-[600px] overflow-hidden flex items-center justify-center">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 w-full h-full"
        >
          {HERO_IMAGES.map((img, idx) => (
            <motion.div
              key={img}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ 
                opacity: currentHeroImage === idx ? 1 : 0,
                scale: currentHeroImage === idx ? 1 : 1.1
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <ProgressiveImage 
                src={img} 
                aspectRatio="aspect-none h-full w-full"
                priority={idx === 0}
              />
            </motion.div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80 z-10" />
        </motion.div>

        <div className="relative z-20 w-full max-w-5xl mx-auto px-6 text-center mt-16 md:mt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium dark:glass-dark mb-8 shadow-2xl border border-white/20">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-bold text-white tracking-wide uppercase">AI Travel Concierge</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-[1.1] drop-shadow-2xl font-serif">
              Where will your <br/>
              <span className="italic font-light text-amber-400">next adventure</span> begin?
            </h1>
            
            <p className="text-lg md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto font-medium drop-shadow-md">
              Discover extraordinary destinations and let our AI craft your perfect itinerary in seconds.
            </p>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsSearchOpen(true)}
              className="w-full max-w-2xl mx-auto h-16 md:h-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-full shadow-2xl hover:shadow-amber-500/20 border border-white/40 flex items-center px-6 md:px-8 transition-all group relative"
            >
              <Search className="w-6 h-6 md:w-8 md:h-8 text-amber-500 mr-4" />
              <div className="flex flex-col items-start">
                <span className="text-sm md:text-base font-bold text-slate-900 dark:text-white">Search destinations</span>
                <span className="text-xs md:text-sm text-slate-500 dark:text-slate-400">Try "Romantic getaway to Paris" or "Tokyo"</span>
              </div>
              <div className="ml-auto w-10 h-10 md:w-12 md:h-12 bg-amber-500 text-white rounded-full flex items-center justify-center group-hover:bg-amber-600 transition-colors shadow-lg">
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </motion.button>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-white dark:bg-slate-950">
        <Container>
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
            {categories.map((cat, i) => (
              <motion.div 
                key={cat.name}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="min-w-[280px] md:min-w-[320px] snap-center group cursor-pointer"
              >
                <div className="relative h-40 md:h-48 rounded-3xl overflow-hidden shadow-premium mb-4">
                  <ProgressiveImage src={cat.image} className="group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                    <cat.icon className="w-8 h-8 mb-3 opacity-90" />
                    <h3 className="text-xl font-bold tracking-wide">{cat.name}</h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-24 bg-slate-50 dark:bg-slate-900/50">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                Trending This Week
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
                The most sought-after destinations right now, curated by our AI travel engine based on global search trends and traveler reviews.
              </p>
            </div>
            <Link to="/explore" className="inline-flex items-center gap-2 font-bold text-amber-600 hover:text-amber-700 transition-colors group">
              Explore All <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {trendingDestinations.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className={i === 0 || i === 3 ? "lg:col-span-2" : ""}
              >
                <DestinationCard {...dest} />
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container>
          <div className="relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl min-h-[500px] flex items-center">
            <ProgressiveImage 
              src="https://images.unsplash.com/photo-1469420200263-7eaf9d443209?q=80&w=2074&auto=format&fit=crop" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 p-10 md:p-20 max-w-3xl">
              <div className="glass-premium dark:glass-dark rounded-3xl p-8 md:p-12 border border-white/20">
                <Sparkles className="w-8 h-8 text-amber-400 mb-6" />
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Don't just visit. <br/> Experience.
                </h2>
                <p className="text-lg text-white/90 mb-8 font-medium">
                  Our AI doesn't just list places. It crafts personalized narratives, finds hidden local gems, and builds itineraries that match your unique travel DNA.
                </p>
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-amber-500/30 flex items-center gap-3"
                >
                  <MapPin className="w-5 h-5" />
                  Start Planning
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <SearchCommand isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
