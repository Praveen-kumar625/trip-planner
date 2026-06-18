import { SchemaType } from '@google/generative-ai';
import { BaseAgent } from './base.agent.js';
import { AgentMemory } from '../memory/session.memory.js';
import { SemanticSearch } from '../rag/semantic_search.js';

const SYSTEM_PROMPT = `
You are the WANDERSYNC Premium AI Travel Concierge.
Your job is to act as a world-class travel researcher and planner.
You receive a user's travel request and you must provide a deeply researched, luxurious, and highly accurate travel plan.
You must output a structured JSON containing a destination overview, budget breakdown, 3 tiers of stay plans, transport suggestions, a day-by-day itinerary, and smart recommendations.
All prices must be realistic estimates, with buffer included. If exact live data is unavailable, fall back to conservative estimates and label them as such in your notes.
Do NOT hallucinate. Provide high-trust, premium advice.
`;

const travelPlanSchema = {
  type: SchemaType.OBJECT,
  properties: {
    destinationOverview: {
      type: SchemaType.OBJECT,
      properties: {
        knownFor: { type: SchemaType.STRING },
        bestTime: { type: SchemaType.STRING },
        vibe: { type: SchemaType.STRING },
        suitsBest: { type: SchemaType.STRING }
      },
      required: ["knownFor", "bestTime", "vibe", "suitsBest"]
    },
    budgetBreakdown: {
      type: SchemaType.OBJECT,
      properties: {
        accommodation: { type: SchemaType.NUMBER },
        food: { type: SchemaType.NUMBER },
        localTravel: { type: SchemaType.NUMBER },
        activities: { type: SchemaType.NUMBER },
        emergencyBuffer: { type: SchemaType.NUMBER },
        totalEstimatedCost: { type: SchemaType.NUMBER },
        currency: { type: SchemaType.STRING, description: "e.g. USD, EUR, INR" }
      },
      required: ["accommodation", "food", "localTravel", "activities", "emergencyBuffer", "totalEstimatedCost", "currency"]
    },
    stayPlan: {
      type: SchemaType.ARRAY,
      description: "Must contain exactly 3 tiers: budget, mid-range, premium",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          tier: { type: SchemaType.STRING, enum: ["budget", "mid-range", "premium"] },
          nightlyPriceRange: { type: SchemaType.STRING },
          areas: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          tradeoffs: { type: SchemaType.STRING },
          suitability: { type: SchemaType.STRING }
        },
        required: ["tier", "nightlyPriceRange", "areas", "tradeoffs", "suitability"]
      }
    },
    transportPlan: {
      type: SchemaType.OBJECT,
      properties: {
        arrivalOptions: { type: SchemaType.STRING },
        cityTransport: { type: SchemaType.STRING },
        tradeoffs: { type: SchemaType.STRING }
      },
      required: ["arrivalOptions", "cityTransport", "tradeoffs"]
    },
    itinerary: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          day: { type: SchemaType.NUMBER },
          morning: { type: SchemaType.STRING },
          afternoon: { type: SchemaType.STRING },
          evening: { type: SchemaType.STRING },
          foodBreaks: { type: SchemaType.STRING },
          travelTime: { type: SchemaType.STRING },
          restTime: { type: SchemaType.STRING }
        },
        required: ["day", "morning", "afternoon", "evening", "foodBreaks", "travelTime", "restTime"]
      }
    },
    smartRecommendations: {
      type: SchemaType.OBJECT,
      properties: {
        topAttractions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        foodSpots: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        hiddenGems: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        photoSpots: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        safetyTips: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        packingAdvice: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
      },
      required: ["topAttractions", "foodSpots", "hiddenGems", "photoSpots", "safetyTips", "packingAdvice"]
    },
    tripSummary: {
      type: SchemaType.OBJECT,
      properties: {
        totalExpectedSpend: { type: SchemaType.STRING },
        recommendedBookingApproach: { type: SchemaType.STRING },
        priorityActions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
        finalRecommendation: { type: SchemaType.STRING }
      },
      required: ["totalExpectedSpend", "recommendedBookingApproach", "priorityActions", "finalRecommendation"]
    }
  },
  required: ["destinationOverview", "budgetBreakdown", "stayPlan", "transportPlan", "itinerary", "smartRecommendations", "tripSummary"]
};

class ConciergeAgent extends BaseAgent {
  constructor() {
    super('Concierge', SYSTEM_PROMPT);
  }
}

export const TravelConcierge = new ConciergeAgent();

export class TravelOrchestrator {
  static async handleUserQuery(userId, sessionId, query) {
    // Save user query
    await AgentMemory.saveSessionMessage(userId, sessionId, 'user', query);

    // Retrieve Context
    const profileContext = await AgentMemory.getProfileContext(userId);
    const ragContext = await SemanticSearch.retrieveContext(query);
    const history = await AgentMemory.getSessionHistory(userId, sessionId);
    
    const context = `Profile: ${profileContext}\nKnowledge: ${ragContext}`;

    // Generate JSON Plan in a single pass (No double-prompting)
    const jsonPlan = await TravelConcierge.execute(query, context, travelPlanSchema, history);

    // Save AI Response
    await AgentMemory.saveSessionMessage(userId, sessionId, 'model', JSON.stringify(jsonPlan));

    return {
      intent: 'PLAN_TRIP',
      response: jsonPlan
    };
  }
}
