import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/utils';

export function BottomSheet({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  className,
  showCloseButton = true,
  snapPoints = ['90vh', '50vh'] // Can be customized
}) {
  const sheetRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm dark:bg-black/60"
          />

          <motion.div
            ref={sheetRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 150 || velocity.y > 500) {
                onClose();
              }
            }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-[101] w-full max-h-[90vh] bg-white dark:bg-slate-900 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden pb-safe border-t border-slate-200 dark:border-slate-800",
              className
            )}
          >
            <div className="w-full flex items-center justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>

            <div className="px-6 pb-4 pt-2 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50">
              {title && <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>}
              {showCloseButton && (
                <button 
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ml-auto"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="p-6 overflow-y-auto flex-1 overscroll-contain scrollbar-hide">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
