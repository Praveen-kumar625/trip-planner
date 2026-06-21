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
    <div className="min-h-screen bg-[#080D17] pb-20 selection:bg-primary-500 selection:text-white">
      {/* Hero Section */}
      <section className="relative h-[450px] md:h-[500px] w-full overflow-hidden flex items-end pb-16">
        <ProgressiveImage 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop" 
          alt="My Trips" 
          aspectRatio="aspect-none h-full w-full"
          className="absolute inset-0 opacity-80 object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080D17] via-[#080D17]/60 to-transparent" />
        
        <Container>
          <div className="relative z-10 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark mb-6 border border-white/20">
                <Navigation className="w-4 h-4 text-primary-400" />
                <span className="text-xs font-bold text-white uppercase tracking-[0.2em]">Travel Hub</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-light text-white mb-6 tracking-wide drop-shadow-lg">
                Your <span className="text-primary-400 italic font-serif">Journeys</span>
              </h1>
              <p className="text-white/70 text-lg md:text-xl font-serif italic max-w-xl">
                Curate your upcoming adventures and relive past memories in your personal travel archive.
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Trips Content */}
      <Section spacing="default" className="-mt-12 relative z-20">
        <Container>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-wide">Upcoming Trips</h2>
            <Link 
              to="/ai-concierge" 
              className="group flex items-center gap-3 bg-white hover:bg-primary-50 text-black px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 shadow-premium"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300 text-primary-500" />
              <span>Plan New Trip</span>
            </Link>
          </div>

          {/* Trips Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : trips.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trips.map((trip, idx) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                    className="h-full group"
                  >
                    <div className="h-full rounded-3xl overflow-hidden glass-dark border border-white/10 hover:border-white/30 transition-all duration-500 hover:shadow-premium-lg">
                      <TripCard trip={trip} onClick={handleTripClick} />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {hasNextPage && (
                <div className="mt-16 flex justify-center">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="btn-premium glass-dark text-white border-white/20 hover:border-white/40 px-10 py-4 rounded-full uppercase tracking-widest font-bold text-sm"
                  >
                    {isFetchingNextPage ? 'Loading more...' : 'Load More Trips'}
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center justify-center py-24 px-6 glass-premium rounded-[2.5rem] border border-white/10 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50" />
              
              <div className="w-24 h-24 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-primary-500/20 backdrop-blur-md">
                <Sparkles className="w-12 h-12 text-primary-400" />
              </div>
              
              <h3 className="text-4xl font-display font-light text-white mb-4 tracking-wide">Where to next?</h3>
              <p className="text-white/60 mb-12 max-w-md text-center text-lg font-serif italic">
                Your archive is empty. Allow our AI concierge to curate a personalized itinerary for your next unforgettable escape.
              </p>
              
              <div className="w-full max-w-5xl px-4 mb-16">
                <p className="text-sm font-bold text-white/50 uppercase tracking-[0.2em] mb-8 text-center">Popular Inspirations</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { name: 'Jaipur, Rajasthan', image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?q=80&w=600&auto=format&fit=crop' },
                    { name: 'Kerala Backwaters', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600&auto=format&fit=crop' },
                    { name: 'Goa, India', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop' }
                  ].map((dest, i) => (
                    <Link key={dest.name} to="/explore" className="group relative h-48 rounded-2xl overflow-hidden block border border-white/10 hover:border-white/30 transition-colors">
                      <ProgressiveImage src={dest.image} alt={dest.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute bottom-6 left-6 text-white flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary-400" />
                          <span className="font-bold tracking-wide">{dest.name}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <Link 
                to="/ai-concierge" 
                className="group flex items-center gap-3 bg-white hover:bg-primary-50 text-black px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 shadow-premium hover:shadow-premium-lg"
              >
                <Sparkles className="w-5 h-5 text-primary-500" />
                Plan Your First Trip
              </Link>
            </motion.div>
          )}
        </Container>
      </Section>
    </div>
  );
}
