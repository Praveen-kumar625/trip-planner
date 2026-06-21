import axios from 'axios';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { AppError } from '../../utils/errors.js';
import { CircuitBreaker } from '../../utils/requestManager.js';

const mapsCircuitBreaker = new CircuitBreaker(3, 15000); // 3 failures, 15s recovery

const cache = new Map();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export class MapsService {
  static baseURL = 'https://maps.googleapis.com/maps/api/place';

  static async searchPlaces(query) {
    if (!env.GOOGLE_MAPS_API_KEY) return this._mockPlaces();

    const cacheKey = `search:${query}`;
    if (cache.has(cacheKey)) {
      const { data, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) return data;
    }

    return await mapsCircuitBreaker.execute(async () => {
      try {
        const response = await axios.get(`${this.baseURL}/textsearch/json`, {
          params: { query, key: env.GOOGLE_MAPS_API_KEY }
        });
        const results = response.data.results;
        cache.set(cacheKey, { data: results, timestamp: Date.now() });
        return results;
      } catch (error) {
        logger.error('Google Maps API Error:', error.message);
        throw new AppError('Failed to search places', 502);
      }
    });
  }

  static async getPlaceDetails(placeId) {
    if (!env.GOOGLE_MAPS_API_KEY) return this._mockPlaceDetails();

    const cacheKey = `details:${placeId}`;
    if (cache.has(cacheKey)) {
      const { data, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) return data;
    }

    return await mapsCircuitBreaker.execute(async () => {
      try {
        const response = await axios.get(`${this.baseURL}/details/json`, {
          params: {
            place_id: placeId,
            fields: 'name,rating,formatted_phone_number,geometry,photos,url,website,opening_hours',
            key: env.GOOGLE_MAPS_API_KEY
          }
        });
        const result = response.data.result;
        cache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
      } catch (error) {
        logger.error('Google Maps API Error:', error.message);
        throw new AppError('Failed to fetch place details', 502);
      }
    });
  }

  static async autocomplete(input) {
    if (!env.GOOGLE_MAPS_API_KEY) return [];

    const cacheKey = `autocomplete:${input}`;
    if (cache.has(cacheKey)) {
      const { data, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) return data;
    }

    return await mapsCircuitBreaker.execute(async () => {
      try {
        const response = await axios.get(`${this.baseURL}/autocomplete/json`, {
          params: { input, key: env.GOOGLE_MAPS_API_KEY }
        });
        const predictions = response.data.predictions;
        cache.set(cacheKey, { data: predictions, timestamp: Date.now() });
        return predictions;
      } catch (error) {
        logger.error('Google Maps API Error:', error.message);
        throw new AppError('Failed to fetch autocomplete suggestions', 502);
      }
    });
  }

  static _mockPlaces() {
    return [
      { place_id: 'mock_1', name: 'Eiffel Tower', formatted_address: 'Paris, France', rating: 4.8 }
    ];
  }

  static _mockPlaceDetails() {
    return { name: 'Eiffel Tower', url: 'https://maps.google.com/?q=Eiffel+Tower', rating: 4.8 };
  }
}
