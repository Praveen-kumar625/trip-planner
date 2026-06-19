import React from 'react';

/**
 * DestinationSkeleton — Shimmer loading state for the dropdown.
 * Used when the Google Maps script is still loading.
 */
export function DestinationSkeleton() {
  return (
    <div className="space-y-3 p-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-neutral-200/70" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-neutral-200/70 rounded-lg w-3/4" />
            <div className="h-3 bg-neutral-100/70 rounded-lg w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
