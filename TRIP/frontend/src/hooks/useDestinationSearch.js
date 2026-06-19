import { useCallback, useRef, useState } from 'react';
import usePlacesAutocomplete from 'use-places-autocomplete';
import { useJsApiLoader } from '@react-google-maps/api';
import { resolvePlace } from '@/services/placesService';

const LIBRARIES = ['places'];
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export function useDestinationSearch({
  debounce = 200,
  types = ['(cities)'],
  componentRestrictions = undefined,
} = {}) {
  const { isLoaded: scriptLoaded } = useJsApiLoader({
    googleMapsApiKey: API_KEY || '',
    libraries: LIBRARIES,
  });

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
    init,
  } = usePlacesAutocomplete({
    initOnMount: false,
    requestOptions: {
      types,
      componentRestrictions,
    },
    debounce,
    cache: 60 * 60,
    defaultValue: '',
  });

  if (scriptLoaded && !ready) {
    init();
  }

  const handleSelect = useCallback(
    async (prediction) => {
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

  const handleClear = useCallback(() => {
    setValue('', false);
    clearSuggestions();
    setSelectedPlace(null);
    setResolveError(null);
    inputRef.current?.focus();
  }, [setValue, clearSuggestions]);

  const handleDismiss = useCallback(() => {
    clearSuggestions();
  }, [clearSuggestions]);

  const hasSuggestions = status === 'OK' && suggestions.length > 0;

  return {
    ready: ready && scriptLoaded,
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
