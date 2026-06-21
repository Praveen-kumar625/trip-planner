import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Navigation, Hotel, Wallet, Coffee, Map, ArrowRight } from 'lucide-react';

export function TripPage() {
  const { currentTrip } = useOutletContext();
  const { user } = useAuthStore();
  const isOwner = user?.uid === currentTrip?.userId;

  if (!currentTrip) return null;

  // Extract high-level metrics for dashboard widgets
  const tripSummary = currentTrip?.modules?.overview?.tripSummary;
  const itineraryData = currentTrip?.modules?.timeline?.data || currentTrip?.modules?.routes?.data || [];
  const hotels = currentTrip?.modules?.hotels?.data?.options || currentTrip?.modules?.hotels?.data || [];
  
  const quickLinks = [
    { name: 'Itinerary', path: 'routes', icon: Navigation, count: itineraryData.length ? `${itineraryData.length} Days` : 'Pending', color: 'text-primary-400' },
    { name: 'Stays', path: 'hotels', icon: Hotel, count: hotels.length ? `${hotels.length} Options` : 'Pending', color: 'text-amber-400' },
    { name: 'Gastronomy', path: 'food', icon: Coffee, count: 'Curated', color: 'text-rose-400' },
    { name: 'Finances', path: 'budget', icon: Wallet, count: currentTrip.budget, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 selection:bg-primary-500 selection:text-white">
      
      {/* Welcome & Context */}
      <div className="glass-dark p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-premium relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary-500/20 transition-colors duration-700 -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-4">
            Mission Overview
          </h2>
          <p className="text-4xl md:text-6xl font-display font-light text-white leading-tight mb-6 tracking-wide">
            Your {currentTrip.durationDays}-Day Escape to <span className="font-serif italic text-primary-400">{currentTrip.destination?.city || 'the Unknown'}</span>
          </p>
          <p className="text-lg md:text-xl text-white/60 font-serif italic max-w-2xl leading-relaxed">
            Curated specifically for {currentTrip.targetAudience} exploring in {currentTrip.season}.
          </p>
        </div>
      </div>

      {/* Intelligence Snapshot */}
      {tripSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-dark p-8 rounded-3xl border border-white/10 shadow-premium group hover:border-white/20 transition-all">
            <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-3 group-hover:text-primary-500/80 transition-colors">Estimated Cost</p>
            <p className="text-3xl font-display text-white tracking-wide">{tripSummary.estimatedTotalCost || 'Calculating...'}</p>
          </div>
          <div className="glass-dark p-8 rounded-3xl border border-white/10 shadow-premium lg:col-span-3 group hover:border-white/20 transition-all">
            <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-3 group-hover:text-primary-500/80 transition-colors">The Vibe</p>
            <p className="text-xl font-serif text-white/70 italic leading-relaxed">{tripSummary.vibe || 'Analyzing destination aura...'}</p>
          </div>
        </div>
      )}

      {/* Quick Navigation Modules */}
      <div>
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-6">
          Access Modules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className="glass-dark p-8 rounded-3xl border border-white/10 shadow-premium hover:border-white/20 hover:-translate-y-1 transition-all duration-300 group flex flex-col items-start relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-primary-500/10 transition-colors" />
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                  <Icon className={`w-6 h-6 ${link.color}`} />
                </div>
                <h4 className="text-xl font-display font-light text-white mb-2 tracking-wide group-hover:text-primary-400 transition-colors">
                  {link.name}
                </h4>
                <p className="text-sm font-bold uppercase tracking-wider text-white/40 group-hover:text-white/60 transition-colors">
                  {link.count}
                </p>
                <ArrowRight className="w-5 h-5 text-white/20 absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 group-hover:text-primary-400" />
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Map Preview Module */}
      <div className="glass-dark rounded-[2.5rem] border border-white/10 shadow-premium overflow-hidden relative group">
        <div className="h-64 md:h-80 w-full bg-[#080D17] relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity transition-opacity duration-700 group-hover:opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#080D17] to-transparent"></div>
          
          <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-primary-500 mb-3">Interactive Intelligence</p>
              <h4 className="text-3xl font-display font-light text-white tracking-wide">Explore the Atlas</h4>
            </div>
            <Link to="maps" className="glass-premium px-8 py-4 rounded-2xl text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-3 w-full md:w-auto hover:bg-white/10 transition-colors border border-white/20 shadow-[0_0_20px_rgba(255,184,0,0.1)]">
              <Map className="w-4 h-4" />
              Open Map
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
