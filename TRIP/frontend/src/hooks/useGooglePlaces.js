import { useCallback, useRef, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

const LIBRARIES = ['places'];
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/**
 * Shared hook for Google Places API across the entire application.
 * Used by LocationAutocomplete, SearchCommand, and any future location components.
 * Lazy-loads the Google Maps script only when this hook is first mounted.
 */
export function useGooglePlaces() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: API_KEY || '',
    libraries: LIBRARIES,
  });

  const autocompleteRef = useRef(null);
  const [predictions, setPredictions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  /**
   * Bind an Autocomplete instance to a DOM input element.
   */
  const onAutocompleteLoad = useCallback((autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  /**
   * Extract full place details from the Autocomplete selection.
   * Returns the canonical location data model.
   */
  const getPlaceDetails = useCallback(() => {
    if (!autocompleteRef.current) return null;

    const place = autocompleteRef.current.getPlace();
    if (!place || !place.geometry) return null;

    const addressComponents = place.address_components || [];
    const getComponent = (type) =>
      addressComponents.find((c) => c.types.includes(type))?.long_name || '';
    const getComponentShort = (type) =>
      addressComponents.find((c) => c.types.includes(type))?.short_name || '';

    return {
      placeId: place.place_id,
      city: getComponent('locality') || getComponent('administrative_area_level_2'),
      state: getComponent('administrative_area_level_1'),
      country: getComponent('country'),
      formattedAddress: place.formatted_address,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
      timezone: place.utc_offset_minutes != null
        ? `UTC${place.utc_offset_minutes >= 0 ? '+' : ''}${Math.floor(place.utc_offset_minutes / 60)}:${String(Math.abs(place.utc_offset_minutes % 60)).padStart(2, '0')}`
        : null,
      countryCode: getComponentShort('country'),
      name: place.name || getComponent('locality'),
      photos: place.photos?.slice(0, 3).map((p) => p.getUrl({ maxWidth: 800 })) || [],
    };
  }, []);

  /**
   * Programmatic search using AutocompleteService for SearchCommand integration.
   */
  const searchPlaces = useCallback(
    async (query) => {
      if (!isLoaded || !query.trim()) {
        setPredictions([]);
        return [];
      }

      setIsSearching(true);
      try {
        const service = new window.google.maps.places.AutocompleteService();
        const result = await new Promise((resolve, reject) => {
          service.getPlacePredictions(
            {
              input: query,
              types: ['(cities)'],
            },
            (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                resolve(results || []);
              } else {
                resolve([]);
              }
            }
          );
        });
        setPredictions(result);
        return result;
      } catch {
        setPredictions([]);
        return [];
      } finally {
        setIsSearching(false);
      }
    },
    [isLoaded]
  );

  /**
   * Given a placeId, fetch full Place Details programmatically.
   */
  const fetchPlaceById = useCallback(
    (placeId) => {
      if (!isLoaded) return Promise.resolve(null);

      return new Promise((resolve) => {
        const el = document.createElement('div');
        const service = new window.google.maps.places.PlacesService(el);
        service.getDetails(
          {
            placeId,
            fields: [
              'place_id',
              'name',
              'formatted_address',
              'geometry',
              'address_components',
              'utc_offset_minutes',
              'photos',
            ],
          },
          (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
              const addressComponents = place.address_components || [];
              const getComponent = (type) =>
                addressComponents.find((c) => c.types.includes(type))?.long_name || '';
              const getComponentShort = (type) =>
                addressComponents.find((c) => c.types.includes(type))?.short_name || '';

              resolve({
                placeId: place.place_id,
                city: getComponent('locality') || getComponent('administrative_area_level_2'),
                state: getComponent('administrative_area_level_1'),
                country: getComponent('country'),
                formattedAddress: place.formatted_address,
                latitude: place.geometry.location.lat(),
                longitude: place.geometry.location.lng(),
                timezone:
                  place.utc_offset_minutes != null
                    ? `UTC${place.utc_offset_minutes >= 0 ? '+' : ''}${Math.floor(place.utc_offset_minutes / 60)}:${String(Math.abs(place.utc_offset_minutes % 60)).padStart(2, '0')}`
                    : null,
                countryCode: getComponentShort('country'),
                name: place.name || getComponent('locality'),
                photos: place.photos?.slice(0, 3).map((p) => p.getUrl({ maxWidth: 800 })) || [],
              });
            } else {
              resolve(null);
            }
          }
        );
      });
    },
    [isLoaded]
  );

  return {
    isLoaded,
    loadError,
    autocompleteRef,
    onAutocompleteLoad,
    getPlaceDetails,
    searchPlaces,
    fetchPlaceById,
    predictions,
    isSearching,
  };
}
