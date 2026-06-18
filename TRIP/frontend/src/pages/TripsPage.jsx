import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, ArrowRight, Plus, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useTrips } from '@/features/trips/hooks/useTrips';

export function TripsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const { 
    data, 
    isLoading, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useTrips(10);

  const trips = useMemo(() => {
    return data?.pages.flatMap(page => page.data) || [];
  }, [data]);

  const handleTripClick = (tripId) => {
    navigate(`/trip/${tripId}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-20">
      {/* Hero Section */}
      <div className="relative h-[300px] w-full overflow-hidden bg-neutral-900">
        <img 
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2000&auto=format&fit=crop" 
          alt="Travel" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Your Journeys
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-neutral-300 text-lg max-w-2xl"
          >
            Manage your upcoming adventures, revisit past travels, and discover new destinations recommended just for you.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Upcoming Trips</h2>
          <Link 
            to="/ai-concierge" 
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-full font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Plan New Trip</span>
          </Link>
        </div>

        {/* Trips Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-neutral-900 rounded-2xl h-[300px] border border-neutral-200 dark:border-neutral-800" />
            ))}
          </div>
        ) : trips.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip, idx) => (
                <motion.div 
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:shadow-xl transition-all"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={trip.image || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=800&auto=format&fit=crop'} 
                      alt={trip.destination?.city || 'Trip'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full text-neutral-900">
                      {(trip.status || 'upcoming').toUpperCase()}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                      {trip.destination?.city ? `${trip.destination.city}, ${trip.destination.country}` : trip.title || 'Unknown Destination'}
                    </h3>
                    <div className="flex flex-col gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{trip.startDate} - {trip.endDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{trip.travelers} Travelers</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleTripClick(trip.id)}
                      className="mt-6 flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
                    >
                      View Itinerary
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            {hasNextPage && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-6 py-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-full font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  {isFetchingNextPage ? 'Loading more...' : 'Load More Trips'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />
            
            <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Sparkles className="w-10 h-10 text-amber-500" />
            </div>
            
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Where to next?</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md text-center text-lg">
              You haven't planned any trips yet. Let our AI concierge craft a personalized itinerary for your dream destination.
            </p>
            
            <div className="w-full max-w-3xl px-6 mb-12">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-6 text-center">Popular Destinations</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: 'Kyoto, Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=600&auto=format&fit=crop' },
                  { name: 'Amalfi Coast, Italy', image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=600&auto=format&fit=crop' },
                  { name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop' }
                ].map(dest => (
                  <Link key={dest.name} to="/planner" className="group relative h-32 rounded-2xl overflow-hidden block">
                    <img src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {dest.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Link 
              to="/planner" 
              className="inline-flex items-center gap-3 bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-lg shadow-amber-600/30"
            >
              <Sparkles className="w-5 h-5" />
              Plan a New Trip
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
