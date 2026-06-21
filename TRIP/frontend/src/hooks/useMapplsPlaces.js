import { useCallback, useState } from 'react';
import { SearchMapplsPlaces, GetPlaceDetails } from '@/services/api/places.service.js';

export function useMapplsPlaces() {
  const [predictions, setPredictions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchPlaces = useCallback(async (query) => {
    if (!query.trim()) {
      setPredictions([]);
      return [];
    }

    setIsSearching(true);
    try {
      const response = await SearchMapplsPlaces(query);
      const suggestions = response?.data?.suggestedLocations || [];
      const result = suggestions.map(s => ({
        place_id: s.eLoc,
        description: s.placeName ? `${s.placeName}, ${s.placeAddress}` : s.placeAddress,
        structured_formatting: {
          main_text: s.placeName || s.placeAddress,
          secondary_text: s.placeAddress || '',
        }
      }));
      setPredictions(result);
      return result;
    } catch (error) {
      console.error("Error fetching Mappls places:", error);
      setPredictions([]);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);

  const fetchPlaceById = useCallback(async (eLoc) => {
    try {
      const response = await GetPlaceDetails(eLoc);
      const place = response?.data;
      if (!place) return null;

      return {
        placeId: eLoc,
        city: place.city || place.district,
        state: place.state,
        country: place.country || 'India',
        formattedAddress: place.placeAddress,
        latitude: place.latitude,
        longitude: place.longitude,
        timezone: null,
        countryCode: 'IN',
        name: place.placeName,
        photos: []
      };
    } catch (error) {
      console.error("Error fetching Mappls place details:", error);
      return null;
    }
  }, []);

  return {
    isLoaded: true, // No external script to load
    loadError: null,
    autocompleteRef: null,
    onAutocompleteLoad: () => {},
    getPlaceDetails: fetchPlaceById,
    searchPlaces,
    fetchPlaceById,
    predictions,
    isSearching,
  };
}
