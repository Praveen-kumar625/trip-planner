import axios from 'axios';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export class FlightsService {
  static baseURL = 'https://test.api.amadeus.com/v1'; // Test environment
  static token = null;
  static tokenExpiry = 0;

  static async getAuthToken() {
    if (this.token && Date.now() < this.tokenExpiry) {
      return this.token;
    }

    if (!env.AMADEUS_CLIENT_ID || !env.AMADEUS_CLIENT_SECRET) {
      throw new Error('Amadeus credentials missing');
    }

    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', env.AMADEUS_CLIENT_ID);
      params.append('client_secret', env.AMADEUS_CLIENT_SECRET);

      const response = await axios.post(`${this.baseURL}/security/oauth2/token`, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      this.token = response.data.access_token;
      // Expire 1 minute before actual expiration for safety
      this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
      
      return this.token;
    } catch (error) {
      logger.error('Amadeus Auth Error:', error.message);
      throw new Error('Failed to authenticate with Amadeus');
    }
  }

  static async searchFlightOffers(origin, dest, departureDate, returnDate, adults = 1) {
    if (!env.AMADEUS_CLIENT_ID) {
      logger.warn('Amadeus key missing. Mocking flight offers.');
      return [
        {
          id: 'mock_1',
          price: { total: '500.00', currency: 'USD' },
          itineraries: [{ duration: 'PT4H30M' }]
        }
      ];
    }

    try {
      const token = await this.getAuthToken();
      
      const params = {
        originLocationCode: origin,
        destinationLocationCode: dest,
        departureDate,
        adults,
        max: 5 // Keep it low for AI ingestion
      };
      
      if (returnDate) {
        params.returnDate = returnDate;
      }

      const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.data.data;
    } catch (error) {
      logger.error('Amadeus Flight Search Error:', error?.response?.data || error.message);
      throw new Error('Failed to search flight offers');
    }
  }

  static async getPointsOfInterest(lat, lon, radius = 5) {
    if (!env.AMADEUS_CLIENT_ID) return [];

    try {
      const token = await this.getAuthToken();
      const response = await axios.get(`${this.baseURL}/reference-data/locations/pois`, {
        params: { latitude: lat, longitude: lon, radius },
        headers: { Authorization: `Bearer ${token}` }
      });

      return response.data.data;
    } catch (error) {
      logger.error('Amadeus POI Error:', error.message);
      return [];
    }
  }
}
