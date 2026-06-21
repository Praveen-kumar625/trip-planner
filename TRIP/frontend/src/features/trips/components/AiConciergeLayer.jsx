import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2 } from 'lucide-react';

export function AiConciergeLayer() {
  const [query, setQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate AI Concierge processing the request
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      setQuery('');
      
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl px-4 pointer-events-none">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto w-full"
      >
        <div className="relative group">
          
          {/* Ambient Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 via-primary-500/20 to-rose-500/20 rounded-full blur-md opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          
          <form 
            onSubmit={handleSubmit}
            className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full p-2 flex items-center shadow-2xl"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 ml-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            
            <AnimatePresence mode="wait">
              {showSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex-1 px-4 text-sm font-medium text-emerald-400 font-serif italic"
                >
                  "I've updated your itinerary perfectly."
                </motion.div>
              ) : (
                <motion.input 
                  key="input"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., 'Make Day 3 more romantic' or 'Add hidden gems'"
                  className="flex-1 bg-transparent border-none focus:outline-none px-4 text-white placeholder:text-white/40 text-sm font-medium"
                  disabled={isProcessing}
                />
              )}
            </AnimatePresence>

            <button 
              type="submit"
              onClick={handleSubmit}
              disabled={isProcessing || !query.trim()}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-white/90"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 text-black animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-black ml-0.5" />
              )}
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
}
