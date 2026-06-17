import { BaseAgent } from './base.agent.js';

const SYSTEM_PROMPT = `
You are the WANDERSYNC Trip Planner Agent.
Your job is to generate highly detailed, logical daily itineraries for travelers.
You must return the itinerary formatted as a clean JSON object containing an array of days.
Do NOT return Markdown formatting around the JSON (e.g. \`\`\`json). Return purely the JSON structure.

Structure:
{
  "tripName": "Trip to X",
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "activities": [
        { "time": "09:00", "location": "String", "description": "String" }
      ]
    }
  ]
}
`;

class TripPlannerAgent extends BaseAgent {
  constructor() {
    super('TripPlanner', SYSTEM_PROMPT);
  }

  async generateItinerary(destination, startDate, endDate, context) {
    const prompt = `Create an itinerary for ${destination} from ${startDate} to ${endDate}.`;
    return await this.execute(prompt, context);
  }
}

export const PlannerAgent = new TripPlannerAgent();
