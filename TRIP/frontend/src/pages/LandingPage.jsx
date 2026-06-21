import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/Layout';
import SearchCommand from '@/components/navigation/SearchCommand';
import CinematicHero from '@/components/home/CinematicHero';
import AiConciergePreview from '@/components/home/AiConciergePreview';
import PossibilitySection from '@/components/home/PossibilitySection';
import MemoryStackSection from '@/components/home/MemoryStackSection';
import FutureMemorySection from '@/components/home/FutureMemorySection';
import { Link } from 'react-router-dom';

const TRENDING_DESTINATIONS = [
  { 
    id: 'udaipur', 
    title: 'Udaipur', 
    location: 'Rajasthan, India', 
    image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=2070&auto=format&fit=crop', 
    mood: 'Royal Heritage', 
    bestSeason: 'October - March', 
    budget: '₹80,000 - ₹1,50,000' 
  },
  { 
    id: 'kerala', 
    title: 'Munnar & Backwaters', 
    location: 'Kerala, India', 
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2070&auto=format&fit=crop', 
    mood: 'Nature Retreat', 
    bestSeason: 'September - March', 
    budget: '₹60,000 - ₹1,20,000' 
  },
  { 
    id: 'amalfi', 
    title: 'Amalfi Coast', 
    location: 'Italy', 
    image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=2070&auto=format&fit=crop', 
    mood: 'Romantic Escape', 
    bestSeason: 'September', 
    budget: '₹2,20,000 - ₹3,50,000' 
  },
  { 
    id: 'kyoto', 
    title: 'Kyoto', 
    location: 'Japan', 
    image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=2070&auto=format&fit=crop', 
    mood: 'Cultural Sanctuary', 
    bestSeason: 'March - May', 
    budget: '₹1,50,000 - ₹2,50,000' 
  },
];

export function LandingPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="w-full min-h-screen bg-background">
      
      {/* 1. HERO PARALLAX SECTION */}
      <CinematicHero onSearchOpen={() => setIsSearchOpen(true)} />

      {/* 2. THE LIVING CONCIERGE */}
      <AiConciergePreview />

      {/* 3. THE POSSIBILITY SECTION */}
      <PossibilitySection />

      {/* 4. THE MEMORY STACK (MAGAZINE EDITORIAL) */}
      <MemoryStackSection />

      {/* 5. FUTURE MEMORY SECTION (CLIMAX) */}
      <FutureMemorySection onSearchOpen={() => setIsSearchOpen(true)} />

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#080D17] py-20">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl flex items-center justify-center text-white font-display font-bold text-lg shadow-glow-saffron">
                WS
              </div>
              <div className="flex flex-col">
                <span className="font-display font-semibold text-xl text-white tracking-wider uppercase">
                  WanderSync
                </span>
                <span className="text-xs text-primary-600 dark:text-primary-400 font-serif italic">Infinity UX OS v25</span>
              </div>
            </div>
            
            <div className="flex items-center gap-10 text-sm font-medium uppercase tracking-[0.2em] text-white/40">
              <Link to="/explore" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Destinations</Link>
              <Link to="/planner" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">AI Concierge</Link>
            </div>
            
            <p className="text-sm text-white/40 font-medium tracking-wide">
              © {new Date().getFullYear()} WanderSync. Designed for the extraordinary.
            </p>
          </div>
        </Container>
      </footer>

      {/* SEARCH COMMAND (NATURAL LANGUAGE INPUT) */}
      <SearchCommand isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
