import React, { useEffect } from 'react';
import { useParams, Outlet, Link, useLocation } from 'react-router-dom';
import { useTripStore } from '@/store/tripStore';
import { LayoutDashboard, Map, Wallet, Hotel, Coffee, Navigation, Sparkles, ChevronRight, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function TripDashboardShell() {
  const { id } = useParams();
  const { currentTrip, fetchTripById, isLoading } = useTripStore();
  const location = useLocation();

  useEffect(() => {
    if (id) fetchTripById(id);
  }, [id, fetchTripById]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#080D17]">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 rounded-full border-t-2 border-primary-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-b-2 border-primary-300 animate-spin-reverse"></div>
        </div>
        <p className="mt-6 font-serif text-white/50 animate-pulse italic">Initializing Command Center...</p>
      </div>
    );
  }

  if (!currentTrip) {
    return <div className="min-h-screen flex items-center justify-center bg-[#080D17] font-display text-2xl text-white/40 tracking-widest uppercase">Trip Not Found</div>;
  }

  const navItems = [
    { name: 'Overview', path: `/trip/${id}`, icon: LayoutDashboard },
    { name: 'Itinerary', path: `/trip/${id}/routes`, icon: Navigation },
    { name: 'Stays', path: `/trip/${id}/hotels`, icon: Hotel },
    { name: 'Gastronomy', path: `/trip/${id}/food`, icon: Coffee },
    { name: 'Finances', path: `/trip/${id}/budget`, icon: Wallet },
    { name: 'Atlas', path: `/trip/${id}/maps`, icon: Map },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] bg-[#080D17] overflow-hidden relative selection:bg-primary-500 selection:text-white">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-72 flex-col z-10 glass-dark border border-white/5 m-4 mr-0 rounded-[2rem] shadow-premium overflow-hidden">
        
        {/* Trip Header */}
        <div className="p-6 relative overflow-hidden group border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h2 className="text-2xl font-display font-light text-white truncate relative z-10 tracking-wide">
            {currentTrip.destination?.city || 'Bespoke Journey'}
          </h2>
          <div className="flex items-center gap-2 mt-2 relative z-10">
            <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] uppercase tracking-widest font-bold text-white/50 border border-white/10">
              {currentTrip.durationDays} Days
            </span>
            <span className="px-2 py-1 rounded-md bg-primary-900/20 text-[10px] uppercase tracking-widest font-bold text-primary-400 border border-primary-500/20">
              {currentTrip.targetAudience}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4 px-2">Command Modules</p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== `/trip/${id}` && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 group overflow-hidden ${
                  isActive 
                    ? 'text-white shadow-sm' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-white/10 border border-white/20 shadow-inner rounded-2xl backdrop-blur-md"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary-400' : 'opacity-70 group-hover:opacity-100'}`} />
                  <span className="tracking-wide">{item.name}</span>
                </div>
                {isActive && <ChevronRight className="relative z-10 w-4 h-4 text-primary-400/50" />}
              </Link>
            );
          })}
        </nav>

        {/* Quick AI Action */}
        <div className="p-4 mt-auto border-t border-white/5">
          <button className="w-full btn-premium btn-primary shadow-glow-saffron text-sm py-3 flex justify-between items-center group">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Ask Concierge
            </span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors shadow-inner">
              <span className="text-[10px] font-bold tracking-wider">⌘K</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-10 p-4 md:p-8 md:pl-4 pb-24 md:pb-8 scrollbar-hide">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
          {/* Top Bar Area for Context (Optional, mostly handled by modules) */}
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-display font-light text-white tracking-wide">
                {navItems.find(i => location.pathname === i.path || (i.path !== `/trip/${id}` && location.pathname.startsWith(i.path)))?.name || 'Dashboard'}
              </h1>
            </div>
            <div className="flex gap-3">
              <button className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors shadow-inner">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </header>

          <div className="flex-1 glass-dark rounded-[2.5rem] p-6 shadow-premium-lg border border-white/10 relative overflow-hidden">
            <Outlet context={{ currentTrip }} />
          </div>
        </div>
      </main>

      {/* Bottom Nav (Mobile) - Glassmorphic */}
      <nav className="md:hidden fixed bottom-6 left-4 right-4 z-50 glass-dark border border-white/10 rounded-[2rem] shadow-premium-lg pb-safe">
        <div className="flex items-center justify-around p-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path || (item.path !== `/trip/${id}` && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative flex flex-col items-center p-2 rounded-xl text-[10px] font-medium transition-all duration-300 ${
                  isActive ? 'text-primary-400' : 'text-white/50 hover:text-white/80'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="mobile-nav-active"
                    className="absolute inset-0 bg-primary-900/20 rounded-xl border border-primary-500/20"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 mb-1 relative z-10 ${isActive ? 'fill-primary-900/40' : ''}`} />
                <span className="relative z-10 tracking-widest uppercase">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
