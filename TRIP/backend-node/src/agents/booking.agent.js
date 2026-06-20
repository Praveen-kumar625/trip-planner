import { BaseAgent } from './base.agent.js';
import { PricingService } from '../services/pricing.service.js';

const BOOKING_SYSTEM_PROMPT = `
You are the Booking Trend Analyst Agent for WanderSync AI.
Your job is to analyze pricing data and predict booking trends.
Analyze the provided flight and hotel estimates, the destination, and the travel season.
Output a realistic "Trend Analysis" that includes:
- Current price context (e.g., "Flights are currently 15% cheaper due to shoulder season").
- Best time to book.
- Expected price drops or surges.
Return ONLY raw unformatted text so the Concierge can use it.
`;

class BookingTrendAnalystAgent extends BaseAgent {
  constructor() {
    super('BookingTrendAnalyst', BOOKING_SYSTEM_PROMPT);
  }

  async analyze(destination, month, context = '') {
    const flightEstimates = PricingService.generateSmartMockFlights(destination, month);
    const hotelEstimates = PricingService.generateSmartMockHotels(destination, month);

    const enrichedContext = `
    Destination: ${destination}
    Month of Travel: ${month || 'Not specified'}
    
    [RAW ESTIMATES IN INR]
    Flights (Economy): ${flightEstimates.economy} INR
    Hotels (Budget/Night): ${hotelEstimates.budget} INR
    Hotels (Mid/Night): ${hotelEstimates.midRange} INR
    Hotels (Premium/Night): ${hotelEstimates.premium} INR
    
    User Context:
    ${context}
    `;

    const report = await this.execute(`Analyze the booking trends for ${destination}.`, enrichedContext);
    
    return {
      report,
      flightEstimates,
      hotelEstimates
    };
  }
}

export const BookingTrendAnalyst = new BookingTrendAnalystAgent();
