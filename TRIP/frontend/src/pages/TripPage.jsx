import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTripStore } from '@/store/tripStore';
import { useAuthStore } from '@/store/authStore';
import { tripsService } from '@/services/api/trips.service';
import { TripHero } from '@/features/trips/components/TripHero';
import { CinematicTimeline } from '@/features/trips/components/CinematicTimeline';
import { TripWealthDashboard } from '@/features/trips/components/TripWealthDashboard';
import { AiConciergeLayer } from '@/features/trips/components/AiConciergeLayer';

export function TripPage() {
  const { id } = useParams();
  const { currentTrip, fetchTripById, isLoading, updateTrip } = useTripStore();
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTripById(id);
    }
  }, [id, fetchTripById]);

  const isOwner = user?.uid === currentTrip?.userId;

  const handleShare = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTogglePrivacy = async () => {
    if (!isOwner) return;
    setIsToggling(true);
    try {
      const newStatus = !currentTrip.isPublic;
      await tripsService.toggleTripPrivacy(currentTrip.id, newStatus);
      // Update local state by calling fetch again or direct manipulation
      fetchTripById(currentTrip.id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsToggling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!currentTrip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-center px-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Trip Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">The trip you are looking for does not exist or has been deleted.</p>
        <Link to="/planner" className="flex items-center gap-2 text-amber-600 font-medium hover:text-amber-700">
          <ArrowLeft className="w-4 h-4" /> Back to My Trips
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black pb-32">
      
      {/* 1. The Hero Experience */}
      <TripHero 
        currentTrip={currentTrip}
        isOwner={isOwner}
        handleShare={handleShare}
        handleTogglePrivacy={handleTogglePrivacy}
        isToggling={isToggling}
        copied={copied}
      />

      {/* 2. The Living Canvas */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-24 relative z-20">
        
        {(() => {
          if (!currentTrip.itinerary) {
            return <p className="text-slate-500 dark:text-slate-400 italic">No future memories generated yet.</p>;
          }

          try {
            let parsed = JSON.parse(currentTrip.itinerary);
            let itineraryData = Array.isArray(parsed) ? parsed : parsed.itinerary;
            let tripSummary = parsed.tripSummary;
            
            return (
              <div className="space-y-12">
                {/* Cinematic Chapters */}
                {itineraryData && Array.isArray(itineraryData) && (
                  <CinematicTimeline itineraryData={itineraryData} />
                )}

                {/* Trip Wealth & Intelligence */}
                {tripSummary && (
                  <TripWealthDashboard tripSummary={tripSummary} budget={currentTrip.budget} />
                )}
              </div>
            );
            
          } catch (e) {
            return (
              <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentTrip.itinerary}
              </div>
            );
          }
        })()}
        
      </div>

      {/* 3. The Concierge Layer */}
      <AiConciergeLayer />

    </div>
  );
}
