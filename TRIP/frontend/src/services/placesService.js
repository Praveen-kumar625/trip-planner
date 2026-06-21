/**
 * placesService.js — Abstraction layer for Google Places geocoding utilities.
 * Wraps getGeocode and getLatLng from use-places-autocomplete for clean usage.
 */
import { getGeocode, getLatLng } from 'use-places-autocomplete';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/services/api/places.service.js';

/**
 * Extract structured location data from a Google Places suggestion.
 * @param {string} address - The formatted address or description from autocomplete.
 * @param {string} placeId - The Google Place ID.
 * @returns {Promise<Object>} Structured location data.
 */
export async function resolvePlace(address, placeId) {
  const results = await getGeocode({ address, placeId });
  const result = results[0];
  const { lat, lng } = getLatLng(result);

  const components = result.address_components || [];
  const get = (type) =>
    components.find((c) => c.types.includes(type))?.long_name || '';
  const getShort = (type) =>
    components.find((c) => c.types.includes(type))?.short_name || '';

  let photoUrl = null;
  try {
    // Attempt to fetch high-res photos via the new Google Places API v1
    const details = await GetPlaceDetails({ textQuery: address });
    const place = details?.data?.places?.[0];
    if (place && place.photos && place.photos.length > 0) {
      // API returns photo names like "places/{placeId}/photos/{photoRef}"
      const photoName = place.photos[0].name; 
      // Handle edge case if {NAME} in PHOTO_REF_URL needs to be replaced
      // Usually place.photos[0].name IS the full path e.g. "places/123/photos/abc"
      // But the user's snippet has `https://places.googleapis.com/v1/{NAME}/media...`
      photoUrl = PHOTO_REF_URL.replace('{NAME}', photoName);
    }
  } catch (error) {
    console.error('Failed to fetch high-res photo from Places v1 API:', error);
  }

  return {
    placeId: result.place_id || placeId,
    city: get('locality') || get('administrative_area_level_2') || get('administrative_area_level_1'),
    state: get('administrative_area_level_1'),
    country: get('country'),
    countryCode: getShort('country'),
    formattedAddress: result.formatted_address,
    latitude: lat,
    longitude: lng,
    name: get('locality') || get('administrative_area_level_2') || address.split(',')[0],
    timezone: null, // Can be fetched separately if needed
    image: photoUrl,
    photos: photoUrl ? [photoUrl] : [],
  };
}

/**
 * Classify a Google Places prediction type into a display-friendly category.
 * @param {string[]} types - Array of place types from the Google API.
 * @returns {{ icon: string, label: string }}
 */
export function classifyPlaceType(types = []) {
  if (types.includes('airport')) return { icon: '✈️', label: 'Airport' };
  if (types.includes('lodging') || types.includes('hotel')) return { icon: '🏨', label: 'Hotel' };
  if (types.includes('museum')) return { icon: '🏛️', label: 'Museum' };
  if (types.includes('restaurant') || types.includes('food')) return { icon: '🍽️', label: 'Restaurant' };
  if (types.includes('park') || types.includes('natural_feature')) return { icon: '🌿', label: 'Nature' };
  if (types.includes('point_of_interest') || types.includes('tourist_attraction')) return { icon: '⭐', label: 'Attraction' };
  if (types.includes('locality')) return { icon: '🏙️', label: 'City' };
  if (types.includes('administrative_area_level_1')) return { icon: '📍', label: 'Region' };
  if (types.includes('country')) return { icon: '🌍', label: 'Country' };
  if (types.includes('establishment')) return { icon: '📌', label: 'Place' };
  return { icon: '📍', label: 'Location' };
}

/**
 * Extract the country from a structured_formatting object.
 * @param {Object} prediction - A Google autocomplete prediction.
 * @returns {string}
 */
export function extractSecondaryText(prediction) {
  return prediction?.structured_formatting?.secondary_text || '';
}
