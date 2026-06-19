import React from 'react';
import { classifyPlaceType, extractSecondaryText } from '@/services/placesService';

/**
 * DestinationDropdown — Premium autocomplete suggestion list.
 *
 * Features:
 *  - Type classification icons (City, Airport, Attraction, etc.)
 *  - Keyboard navigation support (activeIndex)
 *  - Touch-friendly 48px+ hit targets
 *  - Glassmorphism backdrop
 *
 * Props:
 *  - suggestions: Array of Google autocomplete predictions.
 *  - onSelect(prediction): Called when a suggestion is clicked.
 *  - activeIndex: Currently highlighted index for keyboard nav.
 *  - listboxId: ID for ARIA listbox.
 */
export function DestinationDropdown({ suggestions, onSelect, activeIndex = -1, listboxId = 'destination-listbox' }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <ul
      id={listboxId}
      role="listbox"
      className="py-2"
    >
      {suggestions.map((prediction, index) => {
        const { icon, label } = classifyPlaceType(prediction.types);
        const secondaryText = extractSecondaryText(prediction);
        const mainText = prediction.structured_formatting?.main_text || prediction.description;
        const isActive = index === activeIndex;

        return (
          <li
            key={prediction.place_id}
            id={`destination-option-${index}`}
            role="option"
            aria-selected={isActive}
            onClick={() => onSelect(prediction)}
            className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl cursor-pointer transition-all duration-150 ${
              isActive
                ? 'bg-amber-50 ring-1 ring-amber-200'
                : 'hover:bg-neutral-50'
            }`}
          >
            {/* Type Icon */}
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg transition-colors ${
                isActive
                  ? 'bg-amber-100'
                  : 'bg-neutral-100'
              }`}
            >
              {icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900 truncate">
                {mainText}
              </p>
              {secondaryText && (
                <p className="text-xs text-neutral-500 truncate mt-0.5">
                  {secondaryText}
                </p>
              )}
            </div>

            {/* Type Badge */}
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg shrink-0 ${
                isActive
                  ? 'bg-amber-200/60 text-amber-700'
                  : 'bg-neutral-100 text-neutral-400'
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
