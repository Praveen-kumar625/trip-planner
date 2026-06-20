import { useInfiniteQuery } from '@tanstack/react-query';
import { tripsService } from '../../../services/api/trips.service';

export const useCommunityTrips = (limit = 10) => {
  return useInfiniteQuery({
    queryKey: ['trips', 'community'],
    queryFn: async ({ pageParam = null }) => {
      const response = await tripsService.getPublicTrips(limit, pageParam);
      return response;
    },
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.lastDocId : undefined,
  });
};

export const useUserPublicTrips = (userId, limit = 10) => {
  return useInfiniteQuery({
    queryKey: ['trips', 'public', userId],
    queryFn: async ({ pageParam = null }) => {
      const response = await tripsService.getUserPublicTrips(userId, limit, pageParam);
      return response;
    },
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.lastDocId : undefined,
    enabled: !!userId,
  });
};
