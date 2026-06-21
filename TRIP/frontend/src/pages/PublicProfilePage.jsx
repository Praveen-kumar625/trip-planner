import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Globe, Sparkles, User, ArrowLeft } from 'lucide-react';
import { TripCard } from '@/features/trips/components/TripCard';
import { useUserPublicTrips } from '@/features/trips/hooks/useCommunityTrips';
import { supabase } from '@/config/supabase';

export function PublicProfilePage() {
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [isFetchingUser, setIsFetchingUser] = useState(true);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useUserPublicTrips(userId, 12);

  useEffect(() => {
    const fetchUser = async () => {
      setIsFetchingUser(true);
      try {
        const { data: userDoc, error } = await supabase.from('users').select('*').eq('id', userId).single();
        if (userDoc && !error) {
          setProfileUser({ id: userDoc.id, ...userDoc });
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
      <div className="min-h-screen bg-[#080D17] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#080D17] text-center px-4 selection:bg-primary-500 selection:text-white">
        <h2 className="text-3xl font-display font-light text-white mb-2 tracking-wide">Traveler Not Found</h2>
        <p className="text-white/50 font-serif italic mb-8">This profile doesn't exist or has been removed.</p>
        <Link to="/community" className="flex items-center gap-2 px-6 py-3 glass-premium text-white rounded-2xl font-bold text-sm hover:bg-white/10 transition-colors border border-white/20 tracking-wider uppercase">
          <ArrowLeft className="w-4 h-4" /> Back to Community
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080D17] pb-24 selection:bg-primary-500 selection:text-white">
      <div className="relative bg-gradient-to-br from-primary-900/40 via-[#080D17] to-[#080D17] pt-24 pb-16 border-b border-white/5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAyYzguODM3IDAgMTYgNy4xNjMgMTYgMTZzLTcuMTYzIDE2LTE2IDE2LTE2LTcuMTYzLTE2LTE2IDcuMTYzLTE2IDE2LTE2eiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIvPjwvZz48L3N2Zz4=')] opacity-20" />
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-center md:items-end gap-8">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-[2rem] bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-black text-4xl md:text-5xl font-display font-bold shadow-[0_0_40px_rgba(255,184,0,0.2)] border-4 border-[#080D17] shrink-0">
            {initials}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-display font-light text-white mb-3 tracking-wide">
              {profileUser.displayName || 'Anonymous Traveler'}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold uppercase tracking-widest text-white/50">
              {profileUser.travelStyles && profileUser.travelStyles.length > 0 ? (
                <div className="flex items-center gap-2 text-primary-400">
                  <Sparkles className="w-4 h-4" />
                  {profileUser.travelStyles.join(' • ')}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-white/30" />
                  Global Explorer
                </div>
              )}
            </div>
            {profileUser.bio && (
              <p className="mt-5 text-white/70 font-serif italic max-w-2xl leading-relaxed text-sm md:text-base">
                {profileUser.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12">
        <h2 className="text-2xl font-display font-light text-white mb-8 tracking-wide">Public Trips</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-dark rounded-[2rem] border border-white/5 h-[340px] animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {(!data?.pages || data.pages[0].data.length === 0) ? (
              <div className="text-center py-20 glass-dark rounded-[2.5rem] border border-white/10 shadow-premium">
                <div className="w-20 h-20 mx-auto bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10 shadow-inner">
                  <MapPin className="w-8 h-8 text-primary-500/50" />
                </div>
                <h3 className="text-2xl font-display font-light text-white mb-3 tracking-wide">No Public Trips</h3>
                <p className="text-white/50 font-serif italic">
                  {profileUser.displayName || 'This traveler'} hasn't shared any trips publicly yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.pages.map((page) => (
                  page.data.map((trip) => (
                    <Link key={trip.id} to={`/trip/${trip.id}`} className="block group">
                      <div className="transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.02]">
                         <TripCard trip={trip} />
                      </div>
                    </Link>
                  ))
                ))}
              </div>
            )}

            {hasNextPage && (
              <div className="mt-16 flex justify-center">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-8 py-4 glass-premium text-white rounded-2xl font-bold text-sm hover:bg-white/10 transition-colors border border-white/20 tracking-wider uppercase disabled:opacity-50"
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
