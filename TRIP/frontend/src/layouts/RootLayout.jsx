import React, { useEffect, lazy, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import TopNavigation from '@/components/navigation/TopNavigation';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';

import { useAuthStore } from '@/store/authStore';

const AiFloatingWidget = lazy(() => import('@/features/ai/components/AiFloatingWidget'));

export default function RootLayout() {
  const location = useLocation();
  const initAuthListener = useAuthStore(state => state.initAuthListener);

  useEffect(() => {
    initAuthListener();
  }, [initAuthListener]);

  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-primary-200 dark:selection:bg-primary-800 selection:text-primary-900 dark:selection:text-primary-100">
      <TopNavigation />
      
      <main className="flex-1 w-full pb-20 md:pb-0 relative flex flex-col">
        {!isLandingPage && <Breadcrumbs />}
        
        {/* Page transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex-1 w-full flex flex-col h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNavigation />
      
      {/* Global AI Floating Widget */}
      <Suspense fallback={null}>
        <AiFloatingWidget />
      </Suspense>
    </div>
  );
}
