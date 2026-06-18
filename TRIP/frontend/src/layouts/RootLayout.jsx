import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import TopNavigation from '@/components/navigation/TopNavigation';
import BottomNavigation from '@/components/navigation/BottomNavigation';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { AiConcierge } from '@/features/ai/components/AiConcierge';
import { useAuthStore } from '@/store/authStore';

export default function RootLayout() {
  const location = useLocation();
  const initAuthListener = useAuthStore(state => state.initAuthListener);

  useEffect(() => {
    initAuthListener();
  }, [initAuthListener]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col font-sans selection:bg-primary-200 selection:text-primary-900">
      <TopNavigation />
      
      <main className="flex-1 w-full pb-20 md:pb-0 relative flex flex-col">
        <Breadcrumbs />
        
        {/* Page transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex-1 w-full flex flex-col h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNavigation />
      
      {/* Global AI Floating Widget */}
      <AiConcierge />
    </div>
  );
}
