import React, { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MapPin, Navigation, Loader2 } from 'lucide-react';

const LocationAutocomplete = lazy(() => import('@/features/location/components/LocationAutocomplete').then(m => ({ default: m.LocationAutocomplete })));

export function DestinationHeroInput({ onDestinationSelect }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-md mb-8 shadow-sm">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-orange-500 dark:from-amber-400 dark:to-orange-400">
            AI Travel Concierge
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
          Where to <span className="italic font-serif text-amber-500">next?</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light">
          Experience the world's most intelligent trip planner. Tell us your destination, and let our AI craft your perfect itinerary.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className={`w-full max-w-2xl transition-all duration-500 relative ${
          isFocused ? 'scale-[1.02]' : 'scale-100'
        }`}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div 
          className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl p-2 shadow-2xl transition-all overflow-visible"
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            // Need a slight delay to allow click events on dropdown to fire before collapsing focus styles
            setTimeout(() => setIsFocused(false), 200);
          }}
        >
          <div className="flex items-center px-4 py-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 ml-4 h-14 relative z-50">
              <Suspense fallback={
                <div className="w-full h-full flex items-center pl-12 text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin mr-3" /> Loading destinations...
                </div>
              }>
                <LocationAutocomplete 
                  onPlaceSelect={onDestinationSelect}
                  placeholder="Search any city, country, or landmark..."
                  className="w-full h-full"
                  inputClassName="w-full h-full pl-12 pr-12 text-xl md:text-2xl bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                />
              </Suspense>
            </div>
            <button className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center shrink-0 hover:scale-105 transition-transform cursor-pointer shadow-md">
              <Navigation className="w-5 h-5 text-white dark:text-slate-900 ml-0.5" />
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="mt-12 flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400"
      >
        <span>Popular:</span>
        <div className="flex gap-4">
          {['Kyoto, Japan', 'Amalfi Coast, Italy', 'Bali, Indonesia'].map((place) => (
            <button 
              key={place}
              onClick={() => {
                const [city, country] = place.split(', ');
                onDestinationSelect({
                  name: city,
                  city: city,
                  country: country,
                  formattedAddress: place,
                  // We don't have lat/lng here, but providing dummy or omitting them allows the app to proceed
                  latitude: 0,
                  longitude: 0
                });
              }}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              {place}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
