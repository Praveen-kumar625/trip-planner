import React from 'react';
import { Calendar, MapPin, Users, ArrowRight, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ProgressiveImage } from '@/components/ui/Image';
import { GlassCard } from '@/components/ui/GlassCard';
import { Link } from 'react-router-dom';

export const TripCard = ({ trip, onClick }) => {
  const startDate = new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const endDate = new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  
  const daysUntil = Math.ceil((new Date(trip.startDate) - new Date()) / (1000 * 60 * 60 * 24));
  const isUpcoming = daysUntil > 0;

  const getCoverImage = () => {
    if (trip.coverImage) return trip.coverImage;
    if (trip.image) return trip.image;
    if (trip.itinerary) {
      try {
        const parsed = typeof trip.itinerary === 'string' ? JSON.parse(trip.itinerary) : trip.itinerary;
        const url = parsed?.destinationOverview?.imageUrl || parsed?.tripSummary?.imageUrl;
        if (url && url !== 'undefined' && url !== 'null') return url;
      } catch (e) {
        // ignore
      }
    }
    return null;
  };

  const imageSrc = getCoverImage();

  const handleCardClick = (e) => {
    // Prevent link navigation if they click a specific action button (if added later)
    if (onClick) onClick(trip.id);
  };

  return (
    <GlassCard 
      variant="solid"
      className="group relative flex flex-col h-full cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative w-full aspect-[16/10] overflow-hidden p-3 pb-0">
        <div className="relative w-full h-full rounded-[1rem] overflow-hidden">
          {imageSrc ? (
            <ProgressiveImage 
              src={imageSrc} 
              alt={trip.title || 'Trip'} 
              aspectRatio="aspect-none h-full w-full"
              className="group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
              <MapPin className="w-12 h-12 text-white/50" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
          
          <div className="absolute top-4 right-4 z-20">
            <span className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-white text-[10px] font-bold tracking-[0.2em] uppercase border border-white/10 shadow-sm">
              {trip.status ? trip.status : 'Planned'}
            </span>
          </div>

          {isUpcoming && daysUntil <= 30 && (
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-xs font-semibold border border-white/20 shadow-sm">
              <Clock className="w-3.5 h-3.5" />
              In {daysUntil} days
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-primary-400 text-xs font-bold uppercase tracking-widest mb-3 line-clamp-1">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          {trip.destinations?.map(d => d.name).join(', ') || trip.destination?.city || 'Various Destinations'}
        </div>
        
        <h3 className="text-2xl font-serif font-bold tracking-tight text-white mb-2 line-clamp-2 leading-snug">
          {trip.title || `${trip.destination?.city} Getaway`}
        </h3>

        {trip.authorName && (
          <div className="text-sm font-medium text-white/50 mb-4">
            by <Link to={`/u/${trip.userId}`} onClick={(e) => e.stopPropagation()} className="text-primary-400 hover:underline">{trip.authorName}</Link>
          </div>
        )}
        
        <div className="space-y-3 mt-auto pb-5 border-b border-white/10">
          <div className="flex items-center text-sm text-white/70 font-medium">
            <Calendar className="w-4 h-4 mr-3 text-white/40" />
            <span>{startDate} <span className="mx-1 text-white/30">—</span> {endDate}</span>
          </div>
          
          <div className="flex items-center text-sm text-white/70 font-medium">
            <Users className="w-4 h-4 mr-3 text-white/40" />
            <span>{trip.travelers?.length || trip.travelers || 1} {trip.travelers === 1 ? 'Traveler' : 'Travelers'}</span>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <span className="text-white font-bold text-xs tracking-widest uppercase group-hover:text-primary-400 transition-colors">
            View Itinerary
          </span>
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-primary-500 group-hover:bg-primary-900/20 transition-all duration-300">
            <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
