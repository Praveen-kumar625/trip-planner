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

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

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

  const handleSelectPrediction = useCallback(async (prediction) => {
    const placeData = await fetchPlaceById(prediction.place_id);
    if (placeData) {
      sessionStorage.setItem('trip_destination', JSON.stringify(placeData));
      onClose();
      navigate('/ai-concierge');
    }
  }, [fetchPlaceById, navigate, onClose]);

  const handleRecentClick = useCallback((text) => {
    setQuery(text);
    if (isLoaded) {
      searchPlaces(text);
    }
  }, [isLoaded, searchPlaces]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 md:px-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md"
          />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-950 rounded-3xl shadow-premium-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[70vh]"
          >
            {/* Input Header */}
            <div className="flex items-center gap-4 p-6 border-b border-slate-100 dark:border-slate-800/50">
              <Search className="w-6 h-6 text-primary-500" />
              <input
                type="text"
                autoFocus
                placeholder="Where to next?"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-2xl md:text-3xl font-serif text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 py-2"
              />
              {isSearching && <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />}
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results Area */}
            <div className="overflow-y-auto p-6 space-y-8 flex-1">
              {query.length >= 2 && predictions.length > 0 ? (
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">
                    Destinations
                  </h3>
                  <div className="space-y-1">
                    {predictions.map((prediction) => (
                      <button
                        key={prediction.place_id}
                        onClick={() => handleSelectPrediction(prediction)}
                        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-2xl transition-colors group text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-primary-500" />
                          </div>
                          <div>
                            <span className="text-slate-900 dark:text-white font-serif text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {prediction.structured_formatting?.main_text || prediction.description}
                            </span>
                            {prediction.structured_formatting?.secondary_text && (
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                {prediction.structured_formatting.secondary_text}
                              </p>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 group-hover:text-primary-500 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : query.length >= 2 && !isSearching ? (
                <div className="py-16 text-center text-slate-500 dark:text-slate-400">
                  <MapPin className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p>No destinations found for "{query}"</p>
                </div>
              ) : query.length === 0 ? (
                <>
                  {/* Recent Searches */}
                  <div>
                    <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">
                      Recent Searches
                    </h3>
                    <div className="space-y-1">
                      {recentSearches.map((item, i) => (
                        <button
                          key={i}
                          onClick={() => handleRecentClick(item)}
                          className="w-full flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 rounded-xl transition-colors group text-left"
                        >
                          <div className="flex items-center gap-4">
                            <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                            <span className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">{item}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="pt-4">
                    <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">
                      AI Concierge
                    </h3>
                    <div className="flex flex-wrap gap-2 px-2">
                      <button
                        onClick={() => { onClose(); navigate('/ai-concierge'); }}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/40 text-primary-700 dark:text-primary-400 rounded-full text-sm font-bold tracking-wide transition-colors border border-primary-100 dark:border-primary-900/50"
                      >
                        <Sparkles className="w-4 h-4" />
                        Plan a Custom Trip
                      </button>
                    </div>
                  </div>
                </>
              ) : query.length >= 1 && isSearching ? (
                <div className="py-16 text-center text-slate-500 dark:text-slate-400">
                  <Loader2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-4 animate-spin" />
                  <p>Searching for luxury destinations...</p>
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
