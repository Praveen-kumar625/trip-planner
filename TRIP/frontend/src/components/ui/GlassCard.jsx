import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/components/ui/Layout';

export function GlassCard({ 
  children, 
  className, 
  variant = 'default',
  hover = true,
  as: Component = 'div',
  ...props 
}) {
  const variants = {
    default: 'glass-premium dark:glass-dark',
    frosted: 'glass-frosted',
    solid: 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800',
    elevated: 'bg-white dark:bg-slate-900 shadow-premium border border-slate-100/80 dark:border-slate-800',
  };

  const hoverStyles = hover 
    ? 'hover:shadow-premium-hover transition-all duration-300' 
    : '';

  const MotionComponent = Component === 'div' ? motion.div : motion[Component] || motion.div;

  return (
    <MotionComponent
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        'rounded-2xl overflow-hidden',
        variants[variant],
        hoverStyles,
        className
      )}
      {...props}
    >
      {children}
    </MotionComponent>
  );
}


