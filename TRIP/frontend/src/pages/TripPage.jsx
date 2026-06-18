import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Users, IndianRupee } from 'lucide-react';
import { useTripStore } from '@/store/tripStore';
import { ItineraryTimeline } from '@/features/itinerary/components/ItineraryTimeline';

export function TripPage() {
  const { id } = useParams();
  const { currentTrip, fetchTripById, isLoading } = useTripStore();

  useEffect(() => {
    if (id) {
      fetchTripById(id);
    }
  }, [id, fetchTripById]);

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Header Banner */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden">
        <img 
          src={currentTrip.image || 'https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=1200&auto=format&fit=crop'} 
          alt={currentTrip.destination?.city || 'Trip'} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex flex-col justify-end p-6 md:p-12">
          <div className="max-w-4xl mx-auto w-full">
            <Link to="/planner" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Trips
            </Link>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
              {currentTrip.destination?.city ? `${currentTrip.destination.city}, ${currentTrip.destination.country}` : 'Trip Destination'}
            </h1>
            <div className="flex flex-wrap gap-4 text-white/90 text-sm">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {currentTrip.startDate} - {currentTrip.endDate}</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {currentTrip.travelers} Travelers</span>
              {currentTrip.budget && <span className="flex items-center gap-1.5"><IndianRupee className="w-4 h-4" /> {currentTrip.budget.toLocaleString('en-IN')}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Itinerary Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Generated Itinerary</h2>
          {(() => {
            if (!currentTrip.itinerary) {
              return <p className="text-slate-500 dark:text-slate-400 italic">No itinerary details available for this trip.</p>;
            }

            try {
              // Try to parse the itinerary string as JSON. It might be a full AI structured output or just an array.
              let parsed = JSON.parse(currentTrip.itinerary);
              
              // If it's a full structured output from Phase 2, the itinerary is inside `parsed.itinerary`
              let itineraryData = Array.isArray(parsed) ? parsed : parsed.itinerary;
              
              if (itineraryData && Array.isArray(itineraryData)) {
                return <ItineraryTimeline itineraryData={itineraryData} />;
              }
              
              // Fallback if structure is unexpected
              return (
                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentTrip.itinerary}
                </div>
              );
            } catch (e) {
              // If it's not valid JSON (e.g. from an older text-based prompt), render as text
              return (
                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
                  {currentTrip.itinerary}
                </div>
              );
            }
          })()}
        </div>
      </div>
    </div>
  );
}
