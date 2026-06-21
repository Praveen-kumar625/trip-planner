import { useInfiniteQuery } from '@tanstack/react-query';
import { tripsService } from '@/services/api/trips.service';
import { useAuthStore } from '@/store/authStore';

export const useTrips = (limit = 10) => {
  const { user } = useAuthStore();
  const userId = user?.uid;

  return useInfiniteQuery({
    queryKey: ['trips', userId],
    queryFn: async ({ pageParam = null }) => {
      const response = await tripsService.getAllTrips(userId, limit, pageParam);
      return response;
    },
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.lastDocId : undefined,
    enabled: !!userId,
  });
};
