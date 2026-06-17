import axios from 'axios';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export class CurrencyService {
  // Free tier ExchangeRate-API endpoint
  static baseURL = 'https://v6.exchangerate-api.com/v6';
  
  // Simple in-memory cache to avoid blowing up API limits during dev/testing
  static cache = {
    timestamp: 0,
    rates: null
  };
  static CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

  static async convert(amount, fromCurrency, toCurrency) {
    fromCurrency = fromCurrency.toUpperCase();
    toCurrency = toCurrency.toUpperCase();

    if (fromCurrency === toCurrency) return amount;

    try {
      const rates = await this.getRates(fromCurrency);
      if (!rates || !rates[toCurrency]) {
        throw new Error(`Unsupported currency conversion: ${fromCurrency} to ${toCurrency}`);
      }

      const rate = rates[toCurrency];
      return amount * rate;
    } catch (error) {
      logger.error('Currency API Error:', error.message);
      throw new Error('Failed to perform currency conversion');
    }
  }

  static async getRates(baseCurrency) {
    const now = Date.now();
    // Use cache if base is USD (standardized cache)
    if (baseCurrency === 'USD' && this.cache.rates && (now - this.cache.timestamp) < this.CACHE_TTL) {
      return this.cache.rates;
    }

    if (!env.EXCHANGE_RATE_API_KEY) {
      logger.warn('Currency API key missing. Returning mocked rates (INR=83).');
      return { INR: 83.0, EUR: 0.92, GBP: 0.79, JPY: 150.0 };
    }

    try {
      const response = await axios.get(`${this.baseURL}/${env.EXCHANGE_RATE_API_KEY}/latest/${baseCurrency}`);
      
      if (baseCurrency === 'USD') {
        this.cache.rates = response.data.conversion_rates;
        this.cache.timestamp = now;
      }

      return response.data.conversion_rates;
    } catch (error) {
      logger.error('ExchangeRate API Error:', error.message);
      throw new Error('Failed to fetch currency rates');
    }
  }
}
