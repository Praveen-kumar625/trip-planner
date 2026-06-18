import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, ArrowRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockTrips = [
  {
    id: '1',
    destination: 'Kyoto, Japan',
    date: 'Oct 15 - Oct 25, 2026',
    travelers: 2,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    destination: 'Santorini, Greece',
    date: 'Jul 10 - Jul 18, 2026',
    travelers: 4,
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=800&auto=format&fit=crop'
  }
];

export function TripsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // Simulate fetching trips
    const timer = setTimeout(() => {
      setTrips(mockTrips);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
                    src={trip.image} 
                    alt={trip.destination}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full text-neutral-900">
                    {trip.status.toUpperCase()}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">{trip.destination}</h3>
                  <div className="flex flex-col gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{trip.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{trip.travelers} Travelers</span>
                    </div>
                  </div>
                  <Link 
                    to={`/trip/${trip.id}`}
                    className="mt-6 flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
                  >
                    View Itinerary
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">No upcoming trips</h3>
            <p className="text-neutral-500 mb-6">Looks like you haven't planned any trips yet.</p>
            <Link 
              to="/ai-concierge" 
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Ask AI Concierge to Plan One
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
