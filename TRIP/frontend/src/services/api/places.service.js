import axios from "axios";

const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';

const config = {
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
    'X-Goog-FieldMask': [
      'places.photos',
      'places.displayName',
      'places.id'
    ].join(',')
  }
};

// Simple in-memory cache to prevent redundant API calls
const placesCache = new Map();

/**
 * Get place details using the new Google Places API (v1)
 * @param {Object} data - Search payload e.g., { textQuery: "Paris, France" }
 * @returns {Promise<Object>} API response
 */
export const GetPlaceDetails = async (data) => {
  const cacheKey = JSON.stringify(data);
  if (placesCache.has(cacheKey)) {
    return placesCache.get(cacheKey);
  }

  try {
    const response = await axios.post(BASE_URL, data, config);
    placesCache.set(cacheKey, response);
    return response;
  } catch (error) {
    console.error('Error fetching place details:', error);
    throw error;
  }
};

export const PHOTO_REF_URL = `https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=600&maxWidthPx=600&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`;
