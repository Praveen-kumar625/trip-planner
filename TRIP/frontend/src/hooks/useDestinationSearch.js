import { useCallback, useRef, useState } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { resolvePlace } from '@/services/placesService';

/**
 * useDestinationSearch — Premium destination search hook.
 *
 * Wraps `use-places-autocomplete` with:
 *   - 400ms debounce (configurable)
 *   - Session tokens for billing optimization
 *   - Structured geocoding on selection
 *   - Full error handling & loading states
 *   - Cache powered by the library's built-in SWR cache
 *
 * @param {Object} options
 * @param {number} options.debounce - Debounce delay in ms (default: 400)
 * @param {string[]} options.types - Place type restrictions (default: ['(cities)'] )
 * @param {string[]} options.componentRestrictions - Country restrictions (optional)
 * @returns {Object}
 */
export function useDestinationSearch({
  debounce = 400,
  types = ['(cities)'],
  componentRestrictions = undefined,
} = {}) {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isResolving, setIsResolving] = useState(false);
  const [resolveError, setResolveError] = useState(null);
  const inputRef = useRef(null);

  const {
    ready,
    value,
    suggestions: { status, data: suggestions, loading: suggestionsLoading },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types,
      componentRestrictions,
    },
    debounce,
    cache: 24 * 60 * 60, // 24 hour cache
    defaultValue: '',
  });

  /**
   * Handle user selecting a suggestion.
   * Geocodes the selection and returns structured data.
   */
  const handleSelect = useCallback(
    async (prediction) => {
      // Set value in the input without triggering new suggestions
      setValue(prediction.description, false);
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
    [setValue, clearSuggestions]
  );

  /**
   * Update the search input value and clear any previous selection.
   */
  const handleInput = useCallback(
    (newValue) => {
      setValue(newValue);
      if (selectedPlace) {
        setSelectedPlace(null);
      }
      setResolveError(null);
    },
    [setValue, selectedPlace]
  );

  /**
   * Clear everything — input, suggestions, and selected place.
   */
  const handleClear = useCallback(() => {
    setValue('', false);
    clearSuggestions();
    setSelectedPlace(null);
    setResolveError(null);
    inputRef.current?.focus();
  }, [setValue, clearSuggestions]);

  /**
   * Dismiss the dropdown without clearing the input.
   */
  const handleDismiss = useCallback(() => {
    clearSuggestions();
  }, [clearSuggestions]);

  const hasSuggestions = status === 'OK' && suggestions.length > 0;

  return {
    // Input state
    ready,
    value,
    inputRef,

    // Suggestions
    suggestions,
    hasSuggestions,
    suggestionsLoading,

    // Selection
    selectedPlace,
    isResolving,
    resolveError,

    // Actions
    handleInput,
    handleSelect,
    handleClear,
    handleDismiss,
  };
}
