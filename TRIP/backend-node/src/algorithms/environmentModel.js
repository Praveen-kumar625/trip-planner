/**
 * Environmental Intelligence Layer
 * Computes external factors (Temperature, Humidity, Crowd) impacting fatigue.
 */
export class EnvironmentModel {
  constructor(location, date) {
    this.location = location;
    this.date = date;
  }

  /**
   * Fetches environmental predictions for a specific location and hour.
   * Mocked for demo readiness.
   */
  async getPredictions(hour) {
    // In production: Call weather API (OpenWeather, Tomorrow.io) & Crowd APIs
    const baseTemp = 22; // Celsius
    const peakHourTemp = hour >= 12 && hour <= 15 ? 8 : 0;
    
    return {
      temperature: baseTemp + peakHourTemp,
      humidity: 60 + (Math.random() * 20),
      uvIndex: hour >= 10 && hour <= 16 ? 7 : 2,
      rainProbability: Math.random() * 30,
      windSpeed: 10 + Math.random() * 15,
      crowdDensity: this.estimateCrowdDensity(hour) // 0-100 scale
    };
  }

  estimateCrowdDensity(hour) {
    // Peak tourist hours: 10AM-2PM, 5PM-8PM
    if (hour >= 10 && hour <= 14) return 85;
    if (hour >= 17 && hour <= 20) return 90;
    if (hour < 8 || hour > 22) return 15;
    return 50;
  }

  calculateEnvironmentalStress(predictions) {
    const { temperature, humidity, crowdDensity } = predictions;
    
    let tempStress = 0;
    if (temperature > 30) tempStress = (temperature - 30) * 5; // Penalty for heat
    if (temperature < 5) tempStress = (5 - temperature) * 3;   // Penalty for cold

    let humidityStress = humidity > 70 ? (humidity - 70) * 0.5 : 0;

    return {
      tempStress: Math.min(100, tempStress),
      humidityStress: Math.min(100, humidityStress),
      crowdStress: crowdDensity
    };
  }
}
