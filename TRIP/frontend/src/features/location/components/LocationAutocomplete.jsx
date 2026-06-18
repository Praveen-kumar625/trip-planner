import React, { useRef, useState, useCallback } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { MapPin, X, AlertCircle, Loader2 } from 'lucide-react';
import { useGooglePlaces } from '@/hooks/useGooglePlaces';

/**
 * LocationAutocomplete — Premium Google Places Autocomplete input.
 * Only accepts valid Google Places results. Rejects empty/random text.
 *
 * Props:
 *  - onPlaceSelect(locationData) — called with canonical location data model
 *  - value — current display value (controlled)
 *  - placeholder
 *  - className
 */
export function LocationAutocomplete({ onPlaceSelect, value = '', placeholder = 'Search for a city or destination...', className = '' }) {
  const { isLoaded, loadError, onAutocompleteLoad, getPlaceDetails } = useGooglePlaces();
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState(value);
  const [error, setError] = useState('');
  const [hasSelected, setHasSelected] = useState(false);

  const handlePlaceChanged = useCallback(() => {
    const place = getPlaceDetails();
    if (place && place.placeId) {
      setInputValue(place.formattedAddress || place.name);
      setHasSelected(true);
      setError('');
      onPlaceSelect?.(place);
    } else {
      setError('Please select a valid destination from the suggestions.');
      setHasSelected(false);
    }
  }, [getPlaceDetails, onPlaceSelect]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setHasSelected(false);
    setError('');
  };

  const handleBlur = () => {
    if (inputValue.trim() && !hasSelected) {
      setError('Please select a destination from the dropdown suggestions.');
    }
  };

  const handleClear = () => {
    setInputValue('');
    setHasSelected(false);
    setError('');
    onPlaceSelect?.(null);
    inputRef.current?.focus();
  };

  // Google Maps API failed to load
  if (loadError) {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center gap-3 px-5 py-4 bg-red-50 border border-red-200 rounded-2xl text-red-600">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">
            Maps service unavailable. Please check your API key or try again later.
          </span>
        </div>
      </div>
    );
  }

  // Still loading
  if (!isLoaded) {
    return (
      <div className={`relative ${className}`}>
        <div className="flex items-center gap-3 px-5 py-4 bg-neutral-50 border border-neutral-200 rounded-2xl text-neutral-400">
          <Loader2 className="w-5 h-5 animate-spin shrink-0" />
          <span className="text-sm font-medium">Loading location search...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Autocomplete
        onLoad={onAutocompleteLoad}
        onPlaceChanged={handlePlaceChanged}
        options={{
          types: ['(cities)'],
          fields: ['place_id', 'name', 'formatted_address', 'geometry', 'address_components', 'utc_offset_minutes', 'photos'],
        }}
      >
        <div className="relative group">
          <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${hasSelected ? 'text-emerald-500' : 'text-neutral-400 group-focus-within:text-amber-500'}`} />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            autoComplete="off"
            className={`w-full pl-12 pr-12 py-4 bg-white border rounded-2xl text-base text-neutral-900 placeholder:text-neutral-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 ${
              error
                ? 'border-red-300 focus:ring-red-500/30 focus:border-red-500'
                : hasSelected
                ? 'border-emerald-300 bg-emerald-50/30'
                : 'border-neutral-200 hover:border-neutral-300'
            }`}
          />
          {inputValue && (
            <button
              onClick={handleClear}
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </Autocomplete>

      {error && (
        <div className="flex items-center gap-2 mt-2 px-2 text-red-500 text-sm font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
