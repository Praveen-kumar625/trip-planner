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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-12 pb-8 px-4 md:px-8 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-bold tracking-wide uppercase mb-4">
              <Globe className="w-4 h-4" />
              Community
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
              Discover the World
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
              Get inspired by incredible AI-generated itineraries shared by travelers around the globe.
            </p>
          </div>
          <button
            onClick={() => navigate('/planner')}
            className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-6 py-3.5 rounded-2xl text-base font-bold shadow-lg shadow-amber-500/25 transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-5 h-5" />
            Plan a Trip
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-slate-200 dark:bg-slate-800 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {(!data?.pages || data.pages[0].data.length === 0) ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <Globe className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-6" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Community Trips Yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                  Be the first to share your amazing travel plans with the WanderSync community!
                </p>
                <button
                  onClick={() => navigate('/planner')}
                  className="inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Create a Trip
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-8 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl font-bold transition-all shadow-sm disabled:opacity-50"
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
