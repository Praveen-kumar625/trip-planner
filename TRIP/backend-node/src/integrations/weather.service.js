import axios from 'axios';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export class WeatherService {
  static baseURL = 'https://api.openweathermap.org/data/2.5';

  static async getCurrentWeather(lat, lon) {
    if (!env.OPENWEATHERMAP_API_KEY) {
      logger.warn('Weather API key missing. Returning mocked data.');
      return this._getMockData(lat, lon);
    }

    try {
      const response = await axios.get(`${this.baseURL}/weather`, {
        params: {
          lat,
          lon,
          appid: env.OPENWEATHERMAP_API_KEY,
          units: 'metric'
        }
      });
      return response.data;
    } catch (error) {
      logger.error('Weather API Error:', error.message);
      throw new Error('Failed to fetch weather data');
    }
  }

  static async getForecast(lat, lon) {
    if (!env.OPENWEATHERMAP_API_KEY) {
      return this._getMockForecast(lat, lon);
    }

    try {
      const response = await axios.get(`${this.baseURL}/forecast/daily`, {
        params: {
          lat,
          lon,
          cnt: 7,
          appid: env.OPENWEATHERMAP_API_KEY,
          units: 'metric'
        }
      });
      return response.data;
    } catch (error) {
      logger.error('Weather API Error:', error.message);
      throw new Error('Failed to fetch forecast data');
    }
  }

  static _getMockData(lat, lon) {
    return {
      weather: [{ main: 'Clear', description: 'clear sky' }],
      main: { temp: 25, humidity: 60 }
    };
  }

  static _getMockForecast(lat, lon) {
    return {
      list: [
        { temp: { day: 26 }, weather: [{ main: 'Sunny' }] },
        { temp: { day: 24 }, weather: [{ main: 'Rain' }] }
      ]
    };
  }
}
