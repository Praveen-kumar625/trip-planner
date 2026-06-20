import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui/Layout';

const DESTINATIONS = {
  "Bali": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2070&auto=format&fit=crop",
  "Kyoto": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop",
  "Iceland": "https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=2070&auto=format&fit=crop",
  "Amalfi": "https://images.unsplash.com/photo-1533682805518-48d1f5b8cb3a?q=80&w=2070&auto=format&fit=crop",
  "Zermatt": "https://images.unsplash.com/photo-1531366936336-62fc674baa3e?q=80&w=2070&auto=format&fit=crop",
};

const STYLES = ["Romantic", "Adventurous", "Luxurious", "Relaxing"];
const DURATIONS = ["5 Days", "1 Week", "2 Weeks", "A Weekend"];

export default function AiConciergePreview() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("Amalfi");
  const [dates, setDates] = useState("next month");
  const [travelStyle, setTravelStyle] = useState("luxurious");
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const currentBg = DESTINATIONS[destination] || "https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=2070&auto=format&fit=crop";

  const STEPS = [
    "Analyzing historical climate data...",
    `Scanning exclusive boutique hotels in ${destination}...`,
    "Curating culinary reservations...",
    "Optimizing budget and finalising luxury itinerary..."
  ];

  const handleGenerate = () => {
    setIsProcessing(true);
    setProcessingStep(0);
  };

  useEffect(() => {
    if (isProcessing && processingStep < STEPS.length) {
      const timer = setTimeout(() => {
        setProcessingStep(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    } else if (processingStep >= STEPS.length) {
      const timer = setTimeout(() => {
        navigate(`/explore?dest=${encodeURIComponent(destination)}&dates=${encodeURIComponent(dates)}&style=${encodeURIComponent(travelStyle)}`);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isProcessing, processingStep, navigate, destination, dates, travelStyle]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <section className="relative w-full min-h-[100vh] py-24 md:py-32 overflow-hidden flex items-center justify-center bg-black">
      
      {/* Background Image that reacts to State */}
      <AnimatePresence mode="sync">
        <motion.img 
          key={currentBg}
          src={currentBg}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.6, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/40 z-10" />

      <Container className="relative z-20">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center">
          
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white">
              The Living Concierge
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-[4.5rem] font-serif font-bold text-white leading-[1.3] tracking-tight mb-16 flex flex-wrap justify-center items-center gap-y-6">
            <span>I want to escape to</span>
            <span className="relative inline-block mx-3">
              <input 
                type="text"
                value={destination} 
                onChange={e => { setDestination(e.target.value); setIsProcessing(false); }}
                onKeyDown={handleKeyDown}
                size={Math.max(4, destination.length)}
                className="bg-transparent border-b-2 border-white/30 text-white font-serif text-center focus:outline-none focus:border-white px-1 pb-1 hover:bg-white/5 transition-colors placeholder:text-white/30"
                placeholder="Where to?"
              />
            </span>
            <span>during</span>
            <span className="relative inline-block mx-3">
              <input 
                type="text"
                value={dates} 
                onChange={e => { setDates(e.target.value); setIsProcessing(false); }}
                onKeyDown={handleKeyDown}
                size={Math.max(5, dates.length)}
                className="bg-transparent border-b-2 border-white/30 text-white font-serif text-center focus:outline-none focus:border-white px-1 pb-1 hover:bg-white/5 transition-colors placeholder:text-white/30"
                placeholder="When?"
              />
            </span>
            <br className="hidden lg:block w-full" />
            <span>and I want it to feel</span>
            <span className="relative inline-block mx-3">
              <input 
                type="text"
                value={travelStyle} 
                onChange={e => { setTravelStyle(e.target.value); setIsProcessing(false); }}
                onKeyDown={handleKeyDown}
                size={Math.max(5, travelStyle.length)}
                className="italic font-light text-accent-300 bg-transparent border-b-2 border-accent-300/30 text-center focus:outline-none focus:border-accent-300 px-1 pb-1 hover:bg-white/5 transition-colors placeholder:text-accent-300/30"
                placeholder="How?"
              />
            </span>.
          </h2>

          {!isProcessing ? (
            <motion.button 
              onClick={handleGenerate}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-white rounded-full flex items-center gap-4 shadow-2xl hover:shadow-white/20 transition-all duration-500"
            >
              <span className="font-bold uppercase tracking-widest text-sm text-black">Generate My Dream</span>
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white group-hover:bg-accent-500 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-lg bg-black/40 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-white/20 text-left shadow-2xl"
            >
              <div className="flex flex-col gap-5">
                {STEPS.map((step, idx) => (
                  <div key={idx} className={`flex items-center gap-4 transition-all duration-500 ${processingStep >= idx ? 'opacity-100' : 'opacity-0 translate-y-2'}`}>
                    {processingStep > idx ? (
                      <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-accent-400 border-t-transparent animate-spin shrink-0" />
                    )}
                    <span className="text-white/90 font-mono text-xs md:text-sm">{step}</span>
                  </div>
                ))}
              </div>
              
              {processingStep >= STEPS.length && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 w-full py-4 bg-white/10 text-white font-bold uppercase tracking-widest text-sm rounded-xl text-center border border-white/20"
                >
                  Redirecting to Itinerary...
                </motion.div>
              )}
            </motion.div>
          )}
          
        </div>
      </Container>
    </section>
  );
}
