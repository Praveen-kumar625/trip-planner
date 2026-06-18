import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Clock, ArrowRight, X, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGooglePlaces } from '@/hooks/useGooglePlaces';

const recentSearches = ['Goa, India', 'Weekend getaways near Mumbai', 'Budget trip under ₹30000'];

export default function SearchCommand({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { isLoaded, searchPlaces, fetchPlaceById, predictions, isSearching } = useGooglePlaces();
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Debounced search
  const handleQueryChange = useCallback((value) => {
    setQuery(value);
    if (debounceTimer) clearTimeout(debounceTimer);

    if (value.trim().length >= 2 && isLoaded) {
      const timer = setTimeout(() => {
        searchPlaces(value);
      }, 300);
      setDebounceTimer(timer);
    }
  }, [isLoaded, searchPlaces, debounceTimer]);

  // Handle selecting a Google Places prediction
  const handleSelectPrediction = useCallback(async (prediction) => {
    const placeData = await fetchPlaceById(prediction.place_id);
    if (placeData) {
      // Navigate to planner with destination pre-loaded
      // Store destination in sessionStorage for the PlannerPage to pick up
      sessionStorage.setItem('trip_destination', JSON.stringify(placeData));
      onClose();
      navigate('/ai-concierge');
    }
  }, [fetchPlaceById, navigate, onClose]);

  // Handle clicking a recent search
  const handleRecentClick = useCallback((text) => {
    setQuery(text);
    if (isLoaded) {
      searchPlaces(text);
    }
  }, [isLoaded, searchPlaces]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 md:px-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
          />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Input Header */}
            <div className="flex items-center gap-3 p-4 border-b border-neutral-100">
              <Search className="w-6 h-6 text-primary-500 ml-2" />
              <input
                type="text"
                autoFocus
                placeholder="Where do you want to go?"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-lg text-neutral-900 placeholder:text-neutral-400 py-3"
              />
              {isSearching && <Loader2 className="w-5 h-5 text-neutral-400 animate-spin" />}
              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors mr-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results Area */}
            <div className="overflow-y-auto p-4 md:p-6 space-y-8 flex-1">
              {query.length >= 2 && predictions.length > 0 ? (
                <div>
                  <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4 px-2">
                    Destinations
                  </h3>
                  <div className="space-y-1">
                    {predictions.map((prediction) => (
                      <button
                        key={prediction.place_id}
                        onClick={() => handleSelectPrediction(prediction)}
                        className="w-full flex items-center justify-between p-3 hover:bg-neutral-50 rounded-xl transition-colors group text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-amber-500" />
                          </div>
                          <div>
                            <span className="text-neutral-900 font-medium group-hover:text-neutral-900">
                              {prediction.structured_formatting?.main_text || prediction.description}
                            </span>
                            {prediction.structured_formatting?.secondary_text && (
                              <p className="text-sm text-neutral-400">
                                {prediction.structured_formatting.secondary_text}
                              </p>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : query.length >= 2 && !isSearching ? (
                <div className="py-12 text-center text-neutral-500">
                  <MapPin className="w-8 h-8 text-neutral-300 mx-auto mb-4" />
                  <p>No destinations found for "{query}"</p>
                </div>
              ) : query.length === 0 ? (
                <>
                  {/* Recent Searches */}
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4 px-2">
                      Recent Searches
                    </h3>
                    <div className="space-y-1">
                      {recentSearches.map((item, i) => (
                        <button
                          key={i}
                          onClick={() => handleRecentClick(item)}
                          className="w-full flex items-center justify-between p-3 hover:bg-neutral-50 rounded-xl transition-colors group text-left"
                        >
                          <div className="flex items-center gap-4">
                            <Clock className="w-4 h-4 text-neutral-400" />
                            <span className="text-neutral-700 group-hover:text-neutral-900">{item}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4 px-2">
                      Quick Actions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => { onClose(); navigate('/ai-concierge'); }}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-full text-sm font-medium transition-colors border border-amber-200"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Plan a Trip with AI
                      </button>
                    </div>
                  </div>
                </>
              ) : query.length >= 1 && isSearching ? (
                <div className="py-12 text-center text-neutral-500">
                  <Loader2 className="w-8 h-8 text-neutral-300 mx-auto mb-4 animate-spin" />
                  <p>Searching destinations...</p>
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
