import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes of fresh data
      gcTime: 1000 * 60 * 60 * 24, // Keep in garbage collection cache for 24 hours
      retry: (failureCount, error) => {
        // Don't retry on 401/403 or 404 errors
        if (error?.status === 401 || error?.status === 403 || error?.status === 404) return false;
        return failureCount < 3; // Retry up to 3 times
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff max 30s
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Aggressive caching: rely on staleTime
    },
    mutations: {
      retry: 1,
    }
  },
});

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-primary-950">
          <div className="w-12 h-12 border-4 border-accent-500/30 border-t-accent-500 rounded-full animate-spin" />
        </div>
      }>
        {children}
      </Suspense>
    </QueryClientProvider>
  );
}
