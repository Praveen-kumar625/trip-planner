import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Plus, Sparkles } from 'lucide-react';
import { TripCard } from '@/features/trips/components/TripCard';
import { useCommunityTrips } from '@/features/trips/hooks/useCommunityTrips';

export function CommunityPage() {
  const navigate = useNavigate();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useCommunityTrips(12);

  const handleTripClick = (tripId) => {
    navigate(`/trip/${tripId}`);
  };

  return (
    <div className="min-h-screen bg-[#080D17] pb-20 selection:bg-primary-500 selection:text-white">
      <div className="bg-black/40 border-b border-white/10 pt-16 pb-12 px-4 md:px-8 mb-12 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/20 via-transparent to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(255,184,0,0.15)]">
              <Globe className="w-4 h-4" />
              Community
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-light text-white mb-4 tracking-wide">
              Discover the <span className="font-serif italic text-primary-400">World</span>
            </h1>
            <p className="text-white/50 text-lg md:text-xl max-w-2xl font-serif italic">
              Get inspired by incredible AI-generated itineraries shared by travelers around the globe.
            </p>
          </div>
          <button
            onClick={() => navigate('/planner')}
            className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-400 text-black px-8 py-4 rounded-2xl text-base font-bold shadow-[0_0_30px_rgba(255,184,0,0.3)] transition-all active:scale-[0.98] tracking-wider uppercase"
          >
            <Sparkles className="w-5 h-5" />
            Plan a Trip
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="glass-dark rounded-3xl h-80 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <>
            {(!data?.pages || data.pages[0].data.length === 0) ? (
              <div className="text-center py-24 glass-dark rounded-[2.5rem] border border-white/10 shadow-premium relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50" />
                <div className="relative z-10">
                  <Globe className="w-20 h-20 mx-auto text-white/10 mb-8" />
                  <h3 className="text-3xl font-display font-light text-white mb-4 tracking-wide">No Community <span className="font-serif italic text-primary-400">Trips Yet</span></h3>
                  <p className="text-white/50 mb-10 max-w-md mx-auto font-serif italic text-lg">
                    Be the first to share your amazing travel plans with the WanderSync community!
                  </p>
                  <button
                    onClick={() => navigate('/planner')}
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-black px-8 py-4 rounded-2xl font-bold transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] tracking-wider uppercase text-sm"
                  >
                    <Plus className="w-5 h-5" />
                    Create a Trip
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {data.pages.map((page) => (
                  page.data.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      onClick={() => handleTripClick(trip.id)}
                    />
                  ))
                ))}
              </div>
            )}

            {hasNextPage && (
              <div className="mt-16 flex justify-center">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-10 py-4 glass-dark hover:bg-white/10 text-white border border-white/20 hover:border-white/40 rounded-2xl font-bold tracking-widest uppercase text-sm transition-all shadow-premium disabled:opacity-50"
                >
                  {isFetchingNextPage ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
