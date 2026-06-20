import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, ArrowRight, Plus, Sparkles, Navigation } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useTrips } from '@/features/trips/hooks/useTrips';
import { Section, Container } from '@/components/ui/Layout';
import { ProgressiveImage } from '@/components/ui/Image';
import { TripCard } from '@/features/trips/components/TripCard';
import { SkeletonList, SkeletonCard } from '@/components/ui/Skeleton';

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Hero Section */}
      <section className="relative h-[360px] md:h-[400px] w-full overflow-hidden flex items-end pb-12">
        <ProgressiveImage 
          src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop" 
          alt="My Trips" 
          aspectRatio="aspect-none h-full w-full"
          className="absolute inset-0 opacity-80 object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        
        <Container>
          <div className="relative z-10 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-dark mb-4 border border-white/10">
                <Navigation className="w-4 h-4 text-primary-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">Travel Hub</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
                Your <span className="text-gradient-luxury italic font-serif">Journeys</span>
              </h1>
              <p className="text-slate-300 text-lg font-medium">
                Manage your upcoming adventures, revisit past travels, and discover new destinations recommended just for you.
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Trips Content */}
      <Section spacing="default" className="-mt-6">
        <Container>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Upcoming Trips</h2>
            <Link 
              to="/ai-concierge" 
              className="btn-premium btn-primary shadow-lg shadow-primary-500/25"
            >
              <Plus className="w-4 h-4" />
              <span>Plan New Trip</span>
            </Link>
          </div>

          {/* Trips Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
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
                    className="h-full"
                  >
                    <TripCard trip={trip} onClick={handleTripClick} />
                  </motion.div>
                ))}
              </div>
              
              {hasNextPage && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="btn-premium btn-secondary"
                  >
                    {isFetchingNextPage ? 'Loading more...' : 'Load More Trips'}
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 px-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-premium relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-accent-500 to-primary-400" />
              
              <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-primary-100 dark:border-primary-800/30">
                <Sparkles className="w-10 h-10 text-primary-500" />
              </div>
              
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Where to next?</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md text-center text-lg font-medium leading-relaxed">
                You haven't planned any trips yet. Let our AI concierge craft a personalized itinerary for your dream destination.
              </p>
              
              <div className="w-full max-w-4xl px-4 mb-12">
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6 text-center">Popular Inspirations</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { name: 'Kyoto, Japan', image: 'https://images.unsplash.com/photo-1624253321171-1be53e12f5f4?q=80&w=600&auto=format&fit=crop' },
                    { name: 'Amalfi Coast, Italy', image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=600&auto=format&fit=crop' },
                    { name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?q=80&w=600&auto=format&fit=crop' }
                  ].map((dest, i) => (
                    <Link key={dest.name} to="/explore" className="group relative h-36 rounded-2xl overflow-hidden block">
                      <ProgressiveImage src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white font-bold flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary-400" />
                        {dest.name}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <Link 
                to="/ai-concierge" 
                className="btn-premium btn-primary shadow-lg shadow-primary-500/30 text-base px-8 py-4"
              >
                <Sparkles className="w-5 h-5" />
                Plan a New Trip
              </Link>
            </motion.div>
          )}
        </Container>
      </Section>
    </div>
  );
}
