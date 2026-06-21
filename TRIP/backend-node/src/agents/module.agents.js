import { BaseAgent } from './base.agent.js';

class OverviewAgent extends BaseAgent {
  constructor() {
    super('OverviewAgent', `You are the Destination Overview Specialist. Provide high-level insight into the vibe, best time to visit, and who the destination suits best. Do not hallucinate. Be extremely concise and premium.`);
  }
}

class BudgetAgent extends BaseAgent {
  constructor() {
    super('BudgetAgent', `You are the Financial Analyst. Calculate realistic costs in INR (convert if necessary). Provide strict integer values for accommodation, food, local travel, activities, and emergency buffer. Ensure the total is accurate.`);
  }
}

class StayAgent extends BaseAgent {
  constructor() {
    super('StayAgent', `You are the Accommodation Specialist. Suggest exactly 3 stay tiers (budget, mid-range, premium). Include expected areas, tradeoffs, and realistic nightly price ranges.`);
  }
}

class ItineraryAgent extends BaseAgent {
  constructor() {
    super('ItineraryAgent', `You are the Itinerary Planner. Draft a structured day-by-day schedule. Be logical about travel times between locations. Include specific times for morning, afternoon, evening activities, and food breaks.`);
  }
}

class InsightsAgent extends BaseAgent {
  constructor() {
    super('InsightsAgent', `You are the Local Insights Expert. Suggest top attractions (with accurate approx latitude and longitude), hidden gems, safety tips, packing advice, food spots, and photo spots.`);
  }
}

export const overviewAgent = new OverviewAgent();
export const budgetAgent = new BudgetAgent();
export const stayAgent = new StayAgent();
export const itineraryAgent = new ItineraryAgent();
export const insightsAgent = new InsightsAgent();
