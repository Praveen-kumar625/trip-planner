import axios from 'axios';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

export class MapsService {
  static baseURL = 'https://maps.googleapis.com/maps/api/place';

  static async searchPlaces(query) {
    if (!env.GOOGLE_MAPS_API_KEY) return this._mockPlaces();

    try {
      const response = await axios.get(`${this.baseURL}/textsearch/json`, {
        params: {
          query,
          key: env.GOOGLE_MAPS_API_KEY
        }
      });
      return response.data.results;
    } catch (error) {
      logger.error('Google Maps API Error:', error.message);
      throw new Error('Failed to search places');
    }
  }

  static async getPlaceDetails(placeId) {
    if (!env.GOOGLE_MAPS_API_KEY) return this._mockPlaceDetails();

    try {
      const response = await axios.get(`${this.baseURL}/details/json`, {
        params: {
          place_id: placeId,
          fields: 'name,rating,formatted_phone_number,geometry,photos,url,website,opening_hours',
          key: env.GOOGLE_MAPS_API_KEY
        }
      });
      return response.data.result;
    } catch (error) {
      logger.error('Google Maps API Error:', error.message);
      throw new Error('Failed to fetch place details');
    }
  }

  static async autocomplete(input) {
    if (!env.GOOGLE_MAPS_API_KEY) return [];

    try {
      const response = await axios.get(`${this.baseURL}/autocomplete/json`, {
        params: {
          input,
          key: env.GOOGLE_MAPS_API_KEY
        }
      });
      return response.data.predictions;
    } catch (error) {
      logger.error('Google Maps API Error:', error.message);
      throw new Error('Failed to fetch autocomplete suggestions');
    }
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
