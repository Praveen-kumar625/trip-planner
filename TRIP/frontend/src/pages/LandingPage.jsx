import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Map, Wallet, MapPin, Compass, ArrowRight } from 'lucide-react';
import DestinationCard from '@/components/discovery/DestinationCard';
import SearchCommand from '@/components/navigation/SearchCommand';
import { Section, Container } from '@/components/ui/Layout';

// Mock data for luxury feel
const trending = [
  { id: '1', title: 'The Royal Jaipur', location: 'Rajasthan, India', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=2070', rating: 4.9, weather: '28°C Sunny', price: '₹12,000', tag: 'Trending' },
  { id: '2', title: 'Backwaters Retreat', location: 'Kerala, India', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2070', rating: 4.8, weather: '30°C Humid', price: '₹15,000', tag: 'Nature' },
  { id: '3', title: 'Alpine Serenity', location: 'Gulmarg, India', image: 'https://images.unsplash.com/photo-1643194002621-0a6a247e62a0?q=80&w=2070', rating: 4.9, weather: '-2°C Snow', price: '₹22,000', tag: 'Luxury' },
];

export function LandingPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-neutral-50 pb-24">
      {/* Search Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <Container>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold mb-6 border border-primary-100">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Travel Intelligence</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-neutral-900 mb-6 leading-tight">
              Where will your next <span className="text-gradient-luxury">story</span> unfold?
            </h1>
            
            <p className="text-lg md:text-xl text-neutral-500 mb-10 max-w-2xl font-medium">
              Experience the world's most intelligent luxury travel companion. Personalized itineraries, instant insights, and effortless planning.
            </p>

            <button 
              onClick={() => setIsSearchOpen(true)}
              className="w-full max-w-2xl h-16 bg-white/80 backdrop-blur-md rounded-full shadow-premium hover:shadow-premium-hover border border-white flex items-center px-6 transition-all duration-300 group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 animate-shimmer pointer-events-none" />
              <Search className="w-6 h-6 text-primary-500 mr-4 group-hover:scale-110 transition-transform relative z-10" />
              <span className="text-lg text-neutral-400 font-medium relative z-10">Try "Luxury weekend in Udaipur"</span>
              <div className="ml-auto bg-primary-600 text-white rounded-full p-2 group-hover:bg-primary-700 transition-colors relative z-10">
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </motion.div>
        </Container>
      </section>

      {/* AI Quick Actions */}
      <Section spacing="none">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Map, title: "Plan a Trip", desc: "AI-generated itineraries", path: "/planner" },
              { icon: Compass, title: "Discover", desc: "Find hidden gems", path: "/explore" },
              { icon: Sparkles, title: "Concierge", desc: "Ask anything", path: "/ai-concierge" },
              { icon: Wallet, title: "Budget", desc: "Smart expense tracking", path: "/budget" },
            ].map((action, i) => (
              <motion.a
                key={i}
                href={action.path}
                whileHover={{ y: -4 }}
                className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow group flex flex-col items-start gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                  <action.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900">{action.title}</h3>
                  <p className="text-sm text-neutral-500 font-medium mt-1">{action.desc}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </Container>
      </Section>

      {/* Trending Destinations */}
      <Section spacing="default">
        <Container>
          <div className="flex items-end justify-between mb-8 md:mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">Trending Now</h2>
              <p className="text-neutral-500 font-medium mt-2">Curated experiences globally</p>
            </div>
            <button className="hidden md:flex items-center gap-2 font-semibold text-primary-600 hover:text-primary-700 transition-colors">
              Explore All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {trending.map((dest, i) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <DestinationCard {...dest} />
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      <SearchCommand isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
