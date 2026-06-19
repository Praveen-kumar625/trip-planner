import React from 'react';
import { Search } from 'lucide-react';

/**
 * DestinationEmpty — Empty / no-results state for the destination dropdown.
 *
 * Props:
 *  - query: The current search text.
 */
export function DestinationEmpty({ query }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
        <Search className="w-6 h-6 text-neutral-400" />
      </div>
      <p className="text-base font-semibold text-neutral-700 mb-1">
        No destinations found
      </p>
      <p className="text-sm text-neutral-400 max-w-xs">
        {query
          ? `We couldn't find "${query}". Try a different city, country, or landmark.`
          : 'Start typing to search for cities, countries, airports, or landmarks.'}
      </p>
    </div>
  );
}
