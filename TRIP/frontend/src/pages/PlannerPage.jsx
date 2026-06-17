import React from 'react';
import { AiConcierge } from '@/features/ai/components/AiConcierge';

export function PlannerPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto h-[80vh]">
        <AiConcierge />
      </div>
    </div>
  );
}
