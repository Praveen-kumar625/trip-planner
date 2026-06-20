import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Globe, Sparkles, User, ArrowLeft } from 'lucide-react';
import { TripCard } from '@/features/trips/components/TripCard';
import { useUserPublicTrips } from '@/features/trips/hooks/useCommunityTrips';
import { db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export function PublicProfilePage() {
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [isFetchingUser, setIsFetchingUser] = useState(true);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useUserPublicTrips(userId, 12);

  useEffect(() => {
    const fetchUser = async () => {
      setIsFetchingUser(true);
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setProfileUser({ id: userDoc.id, ...userDoc.data() });
        } else {
          setProfileUser(null);
        }
      } catch (e) {
        console.error("Failed to fetch user profile:", e);
      } finally {
        setIsFetchingUser(false);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const initials = profileUser?.displayName
    ? profileUser.displayName.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  if (isFetchingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-center px-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Traveler Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">This profile doesn't exist or has been removed.</p>
        <Link to="/community" className="flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700">
          <ArrowLeft className="w-4 h-4" /> Back to Community
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 pt-16 pb-12 px-4 md:px-8 mb-8 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-8 relative z-10">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-3xl md:text-5xl font-bold shadow-xl shadow-primary-500/25 border-4 border-white dark:border-slate-900 shrink-0">
            {initials}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {profileUser.displayName || 'Anonymous Traveler'}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400">
              {profileUser.travelStyles && profileUser.travelStyles.length > 0 ? (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary-500" />
                  {profileUser.travelStyles.join(' • ')}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Global Explorer
                </div>
              )}
            </div>
            {profileUser.bio && (
              <p className="mt-4 text-slate-600 dark:text-slate-300 max-w-2xl">
                {profileUser.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Public Trips</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-slate-200 dark:bg-slate-800 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {(!data?.pages || data.pages[0].data.length === 0) ? (
              <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                <MapPin className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Public Trips</h3>
                <p className="text-slate-500 dark:text-slate-400">
                  {profileUser.displayName || 'This traveler'} hasn't shared any trips publicly yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.pages.map((page) => (
                  page.data.map((trip) => (
                    <Link key={trip.id} to={`/trip/${trip.id}`} className="block">
                      <TripCard trip={trip} />
                    </Link>
                  ))
                ))}
              </div>
            )}

            {hasNextPage && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-8 py-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-xl font-bold transition-all shadow-sm disabled:opacity-50"
                >
                  {isFetchingNextPage ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
