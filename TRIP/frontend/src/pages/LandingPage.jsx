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
    id: 'tokyo', 
    title: 'Kyoto', 
    location: 'Japan', 
    image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?q=80&w=2070&auto=format&fit=crop', 
    mood: 'Cultural Retreat', 
    bestSeason: 'Spring (March - May)', 
    budget: '₹80,000 - ₹1,50,000' 
  },
  { 
    id: 'amalfi', 
    title: 'Amalfi Coast', 
    location: 'Italy', 
    image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=2070&auto=format&fit=crop', 
    mood: 'Romantic Escape', 
    bestSeason: 'September', 
    budget: '₹1,20,000 - ₹2,50,000' 
  },
  { 
    id: 'bali', 
    title: 'Ubud', 
    location: 'Bali, Indonesia', 
    image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=2070&auto=format&fit=crop', 
    mood: 'Spiritual Sanctuary', 
    bestSeason: 'June - August', 
    budget: '₹40,000 - ₹90,000' 
  },
  { 
    id: 'santorini', 
    title: 'Santorini', 
    location: 'Greece', 
    image: 'https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?q=80&w=2070&auto=format&fit=crop', 
    mood: 'Luxury Seaside', 
    bestSeason: 'May or September', 
    budget: '₹1,50,000 - ₹3,00,000' 
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
    <div className="w-full min-h-screen bg-white dark:bg-slate-950">
      
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
      <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-black py-16">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 rounded-xl flex items-center justify-center text-white dark:text-slate-900 font-bold text-sm shadow-md">
                WS
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-widest uppercase">
                WanderSync AI
              </span>
            </div>
            <div className="flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-slate-500 dark:text-slate-400">
              <Link to="/explore" className="hover:text-slate-900 dark:hover:text-white transition-colors">Explore</Link>
              <Link to="/planner" className="hover:text-slate-900 dark:hover:text-white transition-colors">Concierge</Link>
            </div>
            <p className="text-sm text-slate-400 font-medium tracking-wide">
              © {new Date().getFullYear()} WanderSync AI. Experience the extraordinary.
            </p>
          </div>
        </Container>
      </footer>

      {/* SEARCH COMMAND (NATURAL LANGUAGE INPUT) */}
      <SearchCommand isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
