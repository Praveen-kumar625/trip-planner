import React from 'react';
import { TripDashboard } from '@/features/trips/components/TripDashboard';

export function TripPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <TripDashboard />
      </div>
    </div>
  );
}
