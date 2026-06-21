import axios from 'axios';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { AppError } from '../../utils/errors.js';
import { CircuitBreaker } from '../../utils/requestManager.js';

const mapsCircuitBreaker = new CircuitBreaker(3, 15000); // 3 failures, 15s recovery

const cache = new Map();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export class MapsService {
  static baseURL = 'https://search.mappls.com/search/places/autosuggest/json';
  static eLocURL = 'https://explore.mappls.com/apis/O2O/entity';

  static async searchPlaces(query) {
    if (!env.MAPPLS_API_KEY) return this._mockPlaces();

    const cacheKey = `search:${query}`;
    if (cache.has(cacheKey)) {
      const { data, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) return data;
    }

    return await mapsCircuitBreaker.execute(async () => {
      try {
        const response = await axios.get(this.baseURL, {
          params: { query, access_token: env.MAPPLS_API_KEY }
        });
        const results = response.data.suggestedLocations || [];
        cache.set(cacheKey, { data: results, timestamp: Date.now() });
        return results;
      } catch (error) {
        logger.error('Mappls API Error:', error.message);
        throw new AppError('Failed to search places', 502);
      }
    });
  }

  static async getPlaceDetails(eLoc) {
    if (!env.MAPPLS_API_KEY) return this._mockPlaceDetails();

    const cacheKey = `details:${eLoc}`;
    if (cache.has(cacheKey)) {
      const { data, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) return data;
    }

    return await mapsCircuitBreaker.execute(async () => {
      try {
        const response = await axios.get(`${this.eLocURL}/${eLoc}`, {
          params: { access_token: env.MAPPLS_API_KEY }
        });
        const result = response.data;
        cache.set(cacheKey, { data: result, timestamp: Date.now() });
        return result;
      } catch (error) {
        logger.error('Mappls API Error:', error.message);
        throw new AppError('Failed to fetch place details', 502);
      }
    });
  }

  static async autocomplete(input) {
    if (!env.MAPPLS_API_KEY) return [];

    const cacheKey = `autocomplete:${input}`;
    if (cache.has(cacheKey)) {
      const { data, timestamp } = cache.get(cacheKey);
      if (Date.now() - timestamp < CACHE_TTL) return data;
    }

    return await mapsCircuitBreaker.execute(async () => {
      try {
        const response = await axios.get(this.baseURL, {
          params: { query: input, access_token: env.MAPPLS_API_KEY }
        });
        const predictions = response.data.suggestedLocations || [];
        cache.set(cacheKey, { data: predictions, timestamp: Date.now() });
        return predictions;
      } catch (error) {
        logger.error('Mappls API Error:', error.message);
        throw new AppError('Failed to fetch autocomplete suggestions', 502);
      }
    });
  }

  static _mockPlaces() {
    return [
      { eLoc: 'mock_1', placeName: 'Eiffel Tower', placeAddress: 'Paris, France', rating: 4.8 }
    ];
  }

  static _mockPlaceDetails() {
    return { placeName: 'Eiffel Tower', placeAddress: 'Paris, France', rating: 4.8 };
  }
}
