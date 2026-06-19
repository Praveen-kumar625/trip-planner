import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '../../utils/utils';

/**
 * Premium Image Component
 * 
 * Handles progressive loading, blur placeholders, intersection observer for lazy loading,
 * and error states. Designed for the heavy image usage in the travel redesign.
 */
export function ProgressiveImage({
  src,
  alt,
  className,
  containerClassName,
  aspectRatio = 'aspect-video',
  fallbackIcon = <ImageIcon className="w-8 h-8 text-slate-300" />,
  quality = 'auto',
  priority = false,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [inView, setInView] = useState(priority);
  const imgRef = React.useRef(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const optimizeSrc = (originalSrc) => {
    if (!originalSrc) return '';
    if (originalSrc.includes('unsplash.com') && !originalSrc.includes('q=')) {
      return `${originalSrc}&q=80&fm=webp&auto=format`;
    }
    return originalSrc;
  };

  const finalSrc = optimizeSrc(src);

  return (
    <div 
      ref={imgRef}
      className={cn(
        "relative overflow-hidden bg-slate-100 dark:bg-slate-800",
        aspectRatio,
        containerClassName
      )}
    >
      <AnimatePresence>
        {!isLoaded && !isError && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10 bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center"
          >
          </motion.div>
        )}
      </AnimatePresence>

      {isError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
          {fallbackIcon}
          <span className="text-xs font-medium mt-2">Failed to load</span>
        </div>
      )}

      {inView && finalSrc && !isError && (
        <motion.img
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ 
            scale: isLoaded ? 1 : 1.05, 
            opacity: isLoaded ? 1 : 0 
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          src={finalSrc}
          alt={alt || "Travel destination"}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setIsError(true);
            setIsLoaded(true);
          }}
          className={cn(
            "absolute inset-0 w-full h-full object-cover",
            className
          )}
          {...props}
        />
      )}
    </div>
  );
}
