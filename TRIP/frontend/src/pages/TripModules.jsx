import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { TripWealthDashboard } from '@/features/trips/components/TripWealthDashboard';
import { CinematicTimeline } from '@/features/trips/components/CinematicTimeline';
import { Building2, Wallet, UtensilsCrossed, MapPin, Sparkles } from 'lucide-react';

// Reusable Premium Card Skeleton
function ModuleSkeleton({ count = 3, type = "card" }) {
  return (
    <div className={`grid gap-6 ${type === "card" ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1"}`}>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="glass-dark p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-premium animate-pulse">
          <div className="h-6 w-1/3 bg-white/10 rounded-full mb-4"></div>
          <div className="h-10 w-2/3 bg-white/10 rounded-xl mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 w-full bg-white/5 rounded-full"></div>
            <div className="h-4 w-5/6 bg-white/5 rounded-full"></div>
            <div className="h-4 w-4/6 bg-white/5 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function BudgetModule() {
  const { currentTrip } = useOutletContext();
  const tripSummary = currentTrip?.modules?.overview?.tripSummary;
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 selection:bg-primary-500 selection:text-white">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
          <Wallet className="w-6 h-6 text-emerald-400" />
        </div>
        <h2 className="text-4xl font-display font-light text-white tracking-wide">
          Financial Intelligence
        </h2>
      </div>

      {!tripSummary ? (
        <div className="glass-dark p-12 rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center min-h-[400px] shadow-premium relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-500/5 rounded-full blur-[80px]" />
           <div className="relative w-20 h-20 mb-6">
             <div className="absolute inset-0 rounded-full border-t-2 border-primary-500 animate-spin"></div>
             <div className="absolute inset-2 rounded-full border-b-2 border-primary-300 animate-spin-reverse"></div>
           </div>
           <p className="text-white/40 font-bold tracking-[0.2em] uppercase text-sm">Crunching numbers...</p>
        </div>
      ) : (
        <TripWealthDashboard tripSummary={tripSummary} budget={currentTrip.budget} />
      )}
    </div>
  );
}

export function RoutesModule() {
  const { currentTrip } = useOutletContext();
  const itineraryData = currentTrip?.modules?.timeline?.data || currentTrip?.modules?.routes?.data || [];
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 selection:bg-primary-500 selection:text-white">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
          <MapPin className="w-6 h-6 text-primary-400" />
        </div>
        <h2 className="text-4xl font-display font-light text-white tracking-wide">
          Curated Itinerary
        </h2>
      </div>

      {itineraryData.length > 0 ? (
        <div className="glass-dark rounded-[2.5rem] border border-white/10 shadow-premium overflow-hidden">
          <CinematicTimeline itineraryData={itineraryData} />
        </div>
      ) : (
        <div className="glass-dark p-12 rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center min-h-[400px] shadow-premium relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary-500/5 rounded-full blur-[80px]" />
          <div className="w-16 h-16 bg-white/5 border border-white/10 shadow-inner rounded-2xl flex items-center justify-center mb-6 relative z-10">
            <Sparkles className="w-8 h-8 text-primary-500 animate-pulse" />
          </div>
          <p className="text-white/40 font-bold tracking-[0.2em] uppercase text-sm relative z-10">Orchestrating your journey...</p>
        </div>
      )}
    </div>
  );
}

export function HotelsModule() {
  const { currentTrip } = useOutletContext();
  const hotels = currentTrip?.modules?.hotels?.data?.options || currentTrip?.modules?.hotels?.data || [];
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 selection:bg-primary-500 selection:text-white">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
          <Building2 className="w-6 h-6 text-amber-400" />
        </div>
        <h2 className="text-4xl font-display font-light text-white tracking-wide">
          Premium Stays
        </h2>
      </div>

      {hotels.length === 0 ? (
        <ModuleSkeleton count={3} type="card" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {hotels.map((hotel, i) => (
            <div key={i} className="glass-dark p-8 rounded-[2.5rem] border border-white/10 shadow-premium group hover:border-white/20 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden flex flex-col h-full">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 blur-[60px] group-hover:bg-amber-500/10 transition-colors pointer-events-none" />
              
              <div className="relative z-10 flex-1">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-3">
                  {hotel.tier}
                </h3>
                <p className="text-4xl font-display text-white mb-8 tracking-wide">
                  {hotel.nightlyPriceRange}
                  <span className="text-sm text-white/40 font-sans tracking-normal ml-2">/night</span>
                </p>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Optimal Areas</h4>
                    <p className="text-base text-white/80 font-medium">
                      {hotel.areas?.join(' • ') || 'Various Locations'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Vibe & Suitability</h4>
                    <p className="text-sm text-white/60 font-serif italic leading-relaxed">
                      {hotel.suitability}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-8 pt-6 border-t border-white/5">
                <h4 className="text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-2">Tradeoffs</h4>
                <p className="text-sm text-white/40 font-serif italic">
                  {hotel.tradeoffs}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function FoodModule() {
  const { currentTrip } = useOutletContext();
  const food = currentTrip?.modules?.restaurants?.data || [];
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 selection:bg-primary-500 selection:text-white">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
          <UtensilsCrossed className="w-6 h-6 text-rose-400" />
        </div>
        <h2 className="text-4xl font-display font-light text-white tracking-wide">
          Gastronomy Guide
        </h2>
      </div>

      {food.length === 0 ? (
        <ModuleSkeleton count={4} type="list" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {food.map((f, i) => (
            <div key={i} className="glass-dark p-6 md:p-8 rounded-3xl border border-white/10 shadow-premium hover:border-white/20 transition-all duration-300 flex items-start gap-5 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[40px] group-hover:bg-rose-500/10 transition-colors pointer-events-none" />
              <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 shadow-inner flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform relative z-10">
                <span className="text-sm font-bold text-white/40 group-hover:text-rose-400">0{i + 1}</span>
              </div>
              <p className="text-white/80 font-serif italic leading-relaxed pt-1 relative z-10">
                {f}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MapsModule() {
  return (
    <div className="h-[60vh] min-h-[400px] w-full flex flex-col items-center justify-center glass-dark rounded-[2.5rem] border border-white/10 shadow-premium relative overflow-hidden selection:bg-primary-500 selection:text-white">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-luminosity"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#080D17] via-transparent to-transparent"></div>
      
      <div className="relative z-10 flex flex-col items-center text-center p-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="w-20 h-20 bg-[#080D17] border border-white/20 rounded-[2rem] flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(255,184,0,0.2)]">
          <MapPin className="w-10 h-10 text-primary-500" />
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-light text-white tracking-wide mb-4">
          Interactive Atlas
        </h2>
        <p className="text-white/50 font-serif italic max-w-md">
          Map intelligence module is initializing its global coordinates...
        </p>
      </div>
    </div>
  );
}
