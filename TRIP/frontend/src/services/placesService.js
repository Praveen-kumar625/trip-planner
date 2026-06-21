/**
 * placesService.js — Abstraction layer for Mappls geocoding utilities.
 */
import { GetPlaceDetails } from '@/services/api/places.service.js';

/**
 * Extract structured location data from a Mappls suggestion.
 * @param {string} address - The formatted address or description from autocomplete.
 * @param {string} eLoc - The Mappls eLoc ID.
 * @returns {Promise<Object>} Structured location data.
 */
export async function resolvePlace(address, eLoc) {
  let details = null;
  
  if (eLoc) {
    try {
      const response = await GetPlaceDetails(eLoc);
      details = response?.data;
    } catch (error) {
      console.error('Failed to resolve Mappls place details:', error);
    }
  }
  
  const lat = details?.latitude || 0;
  const lng = details?.longitude || 0;
  const name = details?.placeName || address.split(',')[0];
  const city = details?.city || details?.district || '';
  const state = details?.state || '';
  
  return {
    placeId: eLoc,
    city,
    state,
    country: details?.country || 'India',
    countryCode: 'IN',
    formattedAddress: details?.placeAddress || address,
    latitude: lat,
    longitude: lng,
    name,
    timezone: null,
    image: null,
    photos: [],
  };
}

/**
 * Classify a place type into a display-friendly category.
 */
export function classifyPlaceType(types = []) {
  return { icon: '📍', label: 'Location' };
}

/**
 * Extract the secondary text from a Mappls prediction.
 * @param {Object} prediction - A Mappls autocomplete prediction.
 * @returns {string}
 */
export function extractSecondaryText(prediction) {
  return prediction?.placeAddress || '';
}
