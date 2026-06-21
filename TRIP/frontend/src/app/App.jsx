import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ReactLenis } from 'lenis/react';
import { router } from '@/app/router';
import { ErrorBoundary } from '@/core/ErrorBoundary';
import { ThemeProvider } from '@/core/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 60 * 24,
      retry: (failureCount, error) => {
        if (error?.status === 401 || error?.status === 403 || error?.status === 404) return false;
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
    }
  },
});

function App() {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <Suspense fallback={
              <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-3 border-primary-200 dark:border-primary-800 border-t-primary-500 rounded-full animate-spin" />
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading WanderSync...</p>
                </div>
              </div>
            }>
              <RouterProvider 
                router={router} 
                fallbackElement={
                  <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-slate-950">
                    <div className="w-12 h-12 border-3 border-primary-200 dark:border-primary-800 border-t-primary-500 rounded-full animate-spin" />
                  </div>
                }
              />
            </Suspense>
            <Toaster
              position="bottom-right"
              expand={true}
              richColors
              theme="system"
              toastOptions={{
                className: 'font-sans',
                style: { borderRadius: '1rem' }
              }}
            />
          </ErrorBoundary>
        </QueryClientProvider>
      </ThemeProvider>
    </ReactLenis>
  );
}

export default App;
