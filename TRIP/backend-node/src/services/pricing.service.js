import { env } from '../config/env.js';

export class PricingService {
  /**
   * Fetches real-time flight estimates (Mock if no Amadeus keys)
   * All prices returned in INR.
   */
  static async getFlightEstimates(destination, month) {
    if (env.AMADEUS_CLIENT_ID && env.AMADEUS_CLIENT_SECRET) {
      // TODO: Implement actual Amadeus API call here
      // For now, even if keys exist, we gracefully fallback to Smart Mock to ensure stability
    }
    
    return this.generateSmartMockFlights(destination, month);
  }

  /**
   * Fetches real-time hotel estimates
   * All prices returned in INR.
   */
  static async getHotelEstimates(destination, month) {
    return this.generateSmartMockHotels(destination, month);
  }

  static generateSmartMockFlights(destination, month) {
    // Base flight price logic from India (assumed origin) to various places in INR
    const destLower = destination.toLowerCase();
    let basePrice = 15000; // Domestic default
    
    if (destLower.includes('bali') || destLower.includes('thailand') || destLower.includes('dubai')) {
      basePrice = 25000;
    } else if (destLower.includes('europe') || destLower.includes('paris') || destLower.includes('london') || destLower.includes('swiss')) {
      basePrice = 65000;
    } else if (destLower.includes('usa') || destLower.includes('new york') || destLower.includes('canada')) {
      basePrice = 90000;
    } else if (destLower.includes('maldives')) {
      basePrice = 20000;
    }

    // Seasonal multiplier (Peak in Dec/Jan, cheaper in monsoon Jun/Jul)
    let multiplier = 1.0;
    const peakMonths = ['december', 'january', 'november'];
    const offPeakMonths = ['june', 'july', 'august'];
    
    if (month) {
      const mLower = month.toLowerCase();
      if (peakMonths.some(p => mLower.includes(p))) multiplier = 1.3;
      if (offPeakMonths.some(p => mLower.includes(p))) multiplier = 0.85;
    }

    const finalPrice = Math.round((basePrice * multiplier) / 500) * 500;

    return {
      currency: "INR",
      economy: finalPrice,
      premium: finalPrice * 1.8,
      business: finalPrice * 3.5,
      isRealTime: false
    };
  }

  static generateSmartMockHotels(destination, month) {
    const flight = this.generateSmartMockFlights(destination, month);
    // Rough correlation: Hotel per night is usually 10-20% of the flight cost
    const baseNightly = Math.round((flight.economy * 0.15) / 100) * 100;

    return {
      currency: "INR",
      budget: Math.max(1500, Math.round(baseNightly * 0.5)),
      midRange: Math.max(4000, baseNightly),
      premium: Math.max(12000, baseNightly * 3),
      isRealTime: false
    };
  }
}
