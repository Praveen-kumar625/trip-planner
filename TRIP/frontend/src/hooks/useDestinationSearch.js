import { useCallback, useRef, useState, useEffect } from 'react';
import { resolvePlace } from '@/services/placesService';
import { SearchMapplsPlaces } from '@/services/api/places.service.js';

export function useDestinationSearch({
  debounce = 200,
  types = ['(cities)'],
  componentRestrictions = undefined,
} = {}) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isResolving, setIsResolving] = useState(false);
  const [resolveError, setResolveError] = useState(null);
  const inputRef = useRef(null);

  const debounceTimer = useRef(null);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  const fetchSuggestions = useCallback(async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    setSuggestionsLoading(true);
    try {
      const response = await SearchMapplsPlaces(query);
      const results = response?.data?.suggestedLocations || [];
      const mapped = results.map(s => ({
        place_id: s.eLoc,
        description: s.placeName ? `${s.placeName}, ${s.placeAddress}` : s.placeAddress,
        structured_formatting: {
          main_text: s.placeName || s.placeAddress,
          secondary_text: s.placeAddress || '',
        }
      }));
      setSuggestions(mapped);
    } catch (err) {
      console.error('Failed to fetch Mappls suggestions:', err);
      setSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  const handleSelect = useCallback(
    async (prediction) => {
      setValue(prediction.description);
      clearSuggestions();
      setResolveError(null);
      setIsResolving(true);

      try {
        const locationData = await resolvePlace(
          prediction.description,
          prediction.place_id
        );
        setSelectedPlace(locationData);
        setIsResolving(false);
        return locationData;
      } catch (err) {
        console.error('Failed to resolve place:', err);
        setResolveError('Unable to get location details. Please try again.');
        setIsResolving(false);
        return null;
      }
    },
    [clearSuggestions]
  );

  const handleInput = useCallback(
    (newValue) => {
      setValue(newValue);
      if (selectedPlace) {
        setSelectedPlace(null);
      }
      setResolveError(null);
      
      // Debounced search
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(newValue);
      }, debounce);
    },
    [selectedPlace, debounce, fetchSuggestions]
  );

  const handleClear = useCallback(() => {
    setValue('');
    clearSuggestions();
    setSelectedPlace(null);
    setResolveError(null);
    inputRef.current?.focus();
  }, [clearSuggestions]);

  const handleDismiss = useCallback(() => {
    clearSuggestions();
  }, [clearSuggestions]);

  const hasSuggestions = suggestions.length > 0;

  return {
    ready: true, // No external script needed
    value,
    inputRef,
    suggestions,
    hasSuggestions,
    suggestionsLoading,
    selectedPlace,
    isResolving,
    resolveError,
    handleInput,
    handleSelect,
    handleClear,
    handleDismiss,
  };
}
