import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Lock, Share2, Check, CloudSun, MapPin, Users, Heart } from 'lucide-react';
import { ProgressiveImage } from '@/components/ui/Image';

const calculateDaysUntil = (startDateStr) => {
  if (!startDateStr) return 0;
  const start = new Date(startDateStr);
  const now = new Date();
  const diffTime = start - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

const getFutureMemoryHeadline = (days, city) => {
  if (days === 0) return `Today, your story in ${city} begins.`;
  if (days === 1) return `Tomorrow, you will wake up in ${city}.`;
  if (days <= 7) return `In just ${days} days, your life in ${city} begins.`;
  if (days <= 30) return `In ${days} days, you'll be making memories in ${city}.`;
  return `In ${days} days, you will be walking the streets of ${city}.`;
};

export function TripHero({ currentTrip, isOwner, handleShare, handleTogglePrivacy, isToggling, copied }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const daysUntil = calculateDaysUntil(currentTrip.startDate);
  const cityName = currentTrip.destination?.city || 'your destination';
  const headline = getFutureMemoryHeadline(daysUntil, cityName);

  const coverUrl = currentTrip.coverImage ||
                   currentTrip.image ||
                   (() => { 
                     try { 
                       const parsed = typeof currentTrip.itinerary === 'string' ? JSON.parse(currentTrip.itinerary) : currentTrip.itinerary;
                       return parsed?.destinationOverview?.imageUrl || null; 
                     } catch { 
                       return null; 
                     } 
                   })() || 
                   'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop';

  return (
    <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-black selection:bg-white/30">
      
      {/* Parallax Background Image */}
      <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
        <img 
          src={coverUrl}
          alt={cityName}
          className="w-full h-full object-cover scale-105"
        />
      </motion.div>

      {/* Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-10" />

      {/* Content */}
      <motion.div 
        style={{ opacity }}
        className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 lg:p-16 z-20"
      >
        {/* Top Bar Navigation & Actions */}
        <div className="max-w-7xl mx-auto w-full flex justify-between items-start">
          <Link to="/planner" className="group inline-flex items-center gap-3 text-white/70 hover:text-white transition-colors text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md bg-black/20 px-4 py-2 rounded-full border border-white/10">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
            <span>Back to Reality</span>
          </Link>
          
          <div className="flex items-center gap-3">
            {isOwner && (
              <button 
                onClick={handleTogglePrivacy}
                disabled={isToggling}
                className="inline-flex items-center gap-2 bg-black/30 hover:bg-black/50 backdrop-blur-xl border border-white/20 text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
              >
                {currentTrip.isPublic ? <Lock className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                {currentTrip.isPublic ? 'Make Private' : 'Publish Memory'}
              </button>
            )}
            <button 
              onClick={handleShare}
              className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? 'Link Copied' : 'Share Journey'}
            </button>
          </div>
        </div>

        {/* Hero Typography & Future Memory */}
        <div className="max-w-7xl mx-auto w-full flex flex-col justify-end pb-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold uppercase tracking-[0.2em]">
                <Globe className="w-3.5 h-3.5" />
                {currentTrip.destination?.country || 'Destination'}
              </span>
              <div className="h-px w-12 bg-white/30" />
              <span className="text-white/60 text-xs font-medium uppercase tracking-widest">
                {currentTrip.startDate} — {currentTrip.endDate}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-serif font-bold text-white leading-[0.9] tracking-tight drop-shadow-2xl mb-8">
              {cityName}
            </h1>

            <div className="max-w-2xl">
              <p className="text-xl md:text-3xl font-light text-white/90 leading-relaxed font-serif italic">
                "{headline}"
              </p>
            </div>
          </motion.div>

          {/* Luxury Editorial Metadata Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center gap-8 md:gap-16 pt-8 border-t border-white/10"
          >
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em]">Atmosphere</span>
              <span className="text-white text-sm font-medium flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-amber-200" /> Perfect 24°C
              </span>
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em]">Travelers</span>
              <span className="text-white text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-white/70" /> {currentTrip.travelers} Companions
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em]">Trip Mood</span>
              <span className="text-white text-sm font-medium flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-300" /> Ultra-Luxury
              </span>
            </div>

            <div className="flex flex-col gap-2 ml-auto">
              <span className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em]">Anticipation</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-white/50 to-white rounded-full"
                  />
                </div>
                <span className="text-white text-xs font-bold tracking-wider">85%</span>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>

    </div>
  );
}
