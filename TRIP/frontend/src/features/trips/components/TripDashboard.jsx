import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { TripCard } from './TripCard';
import { useTrips } from '../hooks/useTrips';

export const TripDashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useTrips(6);

  const trips = useMemo(() => {
    return data?.pages.flatMap(page => page.data) || [];
  }, [data]);

  if (isLoading && trips.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Your Journeys</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and plan your upcoming adventures</p>
        </div>
        <button 
          onClick={() => navigate('/trips/new')}
          className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Plan New Trip
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="w-20 h-20 bg-amber-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-10 h-10 text-amber-500 dark:text-amber-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No trips planned yet</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            Ready for your next adventure? Let our AI concierge help you craft the perfect itinerary.
          </p>
          <button 
            onClick={() => navigate('/trips/new')}
            className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors font-medium"
          >
            Start Planning
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard 
                key={trip.id} 
                trip={trip} 
                onClick={(id) => navigate(`/trips/${id}`)}
              />
            ))}
          </div>
          {hasNextPage && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium disabled:opacity-50"
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
