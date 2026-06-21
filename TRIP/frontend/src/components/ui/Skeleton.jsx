import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/components/ui/Layout';

function Skeleton({ className, variant = 'default', ...props }) {
  const variants = {
    default: 'skeleton rounded-lg',
    circle: 'skeleton rounded-full',
    text: 'skeleton rounded h-4',
    title: 'skeleton rounded h-7 w-3/4',
    avatar: 'skeleton rounded-full w-10 h-10',
    card: 'skeleton rounded-2xl',
    image: 'skeleton rounded-2xl aspect-[4/3]',
    button: 'skeleton rounded-full h-10 w-28',
  };

  return (
    <div
      className={cn(variants[variant], className)}
      {...props}
    />
  );
}

export function SkeletonCard({ className }) {
  return (
    <div className={cn("card-elevated p-3 space-y-4", className)}>
      <Skeleton variant="image" className="w-full" />
      <div className="px-2 space-y-3">
        <Skeleton variant="text" className="w-20" />
        <Skeleton variant="title" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton variant="text" className="w-16" />
          <Skeleton variant="text" className="w-12" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3, className }) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-3/4" />
            <Skeleton variant="text" className="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
