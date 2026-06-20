import { Type } from '@google/genai';
import { BaseAgent } from './base.agent.js';
import { AgentMemory } from '../memory/session.memory.js';
import { SemanticSearch } from '../rag/semantic_search.js';
import { DestinationResearcher, AccommodationExpert, BudgetAnalyst } from './specialists.js';
import { BookingTrendAnalyst } from './booking.agent.js';
import { ImageService } from '../services/image.service.js';

const SYSTEM_PROMPT = `
You are the WANDERSYNC Premium AI Travel Concierge.
Your job is to act as a world-class travel researcher and planner.
You receive a user's travel request and you must provide a deeply researched, luxurious, and highly accurate travel plan.
You must output a structured JSON containing a destination overview, budget breakdown, 3 tiers of stay plans, transport suggestions, a day-by-day itinerary, and smart recommendations.
All prices must be realistic estimates, with buffer included. If exact live data is unavailable, fall back to conservative estimates and label them as such in your notes.
Do NOT hallucinate. Provide high-trust, premium advice.
`;

const travelPlanSchema = {
  type: Type.OBJECT,
  properties: {
    destinationOverview: {
      type: Type.OBJECT,
      properties: {
        knownFor: { type: Type.STRING },
        bestTime: { type: Type.STRING },
        vibe: { type: Type.STRING },
        suitsBest: { type: Type.STRING },
        imageUrl: { type: Type.STRING, description: "URL of a beautiful destination photo" }
      },
      required: ["knownFor", "bestTime", "vibe", "suitsBest", "imageUrl"]
    },
    budgetBreakdown: {
      type: Type.OBJECT,
      properties: {
        accommodation: { type: Type.NUMBER },
        food: { type: Type.NUMBER },
        localTravel: { type: Type.NUMBER },
        activities: { type: Type.NUMBER },
        emergencyBuffer: { type: Type.NUMBER },
        totalEstimatedCost: { type: Type.NUMBER },
        currency: { type: Type.STRING, description: "e.g. USD, EUR, INR" }
      },
      required: ["accommodation", "food", "localTravel", "activities", "emergencyBuffer", "totalEstimatedCost", "currency"]
    },
    stayPlan: {
      type: Type.ARRAY,
      description: "Must contain exactly 3 tiers: budget, mid-range, premium",
      items: {
        type: Type.OBJECT,
        properties: {
          tier: { type: Type.STRING },
          nightlyPriceRange: { type: Type.STRING },
          areas: { type: Type.ARRAY, items: { type: Type.STRING } },
          tradeoffs: { type: Type.STRING },
          suitability: { type: Type.STRING }
        },
        required: ["tier", "nightlyPriceRange", "areas", "tradeoffs", "suitability"]
      }
    },
    transportPlan: {
      type: Type.OBJECT,
      properties: {
        arrivalOptions: { type: Type.STRING },
        cityTransport: { type: Type.STRING },
        tradeoffs: { type: Type.STRING }
      },
      required: ["arrivalOptions", "cityTransport", "tradeoffs"]
    },
    itinerary: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.NUMBER },
          morning: { type: Type.STRING },
          afternoon: { type: Type.STRING },
          evening: { type: Type.STRING },
          foodBreaks: { type: Type.STRING },
          travelTime: { type: Type.STRING },
          restTime: { type: Type.STRING }
        },
        required: ["day", "morning", "afternoon", "evening", "foodBreaks", "travelTime", "restTime"]
      }
    },
    smartRecommendations: {
      type: Type.OBJECT,
      properties: {
        topAttractions: { 
          type: Type.ARRAY, 
          items: { 
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              lat: { type: Type.NUMBER, description: "Latitude of the attraction" },
              lng: { type: Type.NUMBER, description: "Longitude of the attraction" }
            },
            required: ["name", "description", "category", "lat", "lng"]
          } 
        },
        foodSpots: { type: Type.ARRAY, items: { type: Type.STRING } },
        hiddenGems: { type: Type.ARRAY, items: { type: Type.STRING } },
        photoSpots: { type: Type.ARRAY, items: { type: Type.STRING } },
        safetyTips: { type: Type.ARRAY, items: { type: Type.STRING } },
        packingAdvice: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["topAttractions", "foodSpots", "hiddenGems", "photoSpots", "safetyTips", "packingAdvice"]
    },
    tripSummary: {
      type: Type.OBJECT,
      properties: {
        totalExpectedSpend: { type: Type.STRING },
        recommendedBookingApproach: { type: Type.STRING },
        priorityActions: { type: Type.ARRAY, items: { type: Type.STRING } },
        finalRecommendation: { type: Type.STRING },
        trendAnalysis: { type: Type.STRING, description: "Detailed booking and price trend analysis" }
      },
      required: ["totalExpectedSpend", "recommendedBookingApproach", "priorityActions", "finalRecommendation", "trendAnalysis"]
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
  static async handleUserQueryStream(userId, sessionId, query, tripContext = {}, frontendHistory = [], onToken, onToolCall) {
    // Save user query
    await AgentMemory.saveSessionMessage(userId, sessionId, 'user', query);

    // Retrieve Context
    const profileContext = await AgentMemory.getProfileContext(userId);
    const ragContext = await SemanticSearch.retrieveContext(query);
    const memoryHistory = await AgentMemory.getSessionHistory(userId, sessionId);
    
    // Merge frontend history if memory history is empty
    const history = memoryHistory.length > 0 ? memoryHistory : frontendHistory;
    
    const context = `Profile: ${profileContext}\nKnowledge: ${ragContext}\nTrip Context: ${JSON.stringify(tripContext)}`;

    // Generate response using streaming and tools
    let fullResponse = '';
    let latestJsonPlan = null;

    try {
      // 1. Run the specialized agents in parallel to gather intelligence
      const [researchReport, accommReport, budgetReport, bookingAnalysis, destinationImageUrl] = await Promise.all([
        DestinationResearcher.execute(query, context),
        AccommodationExpert.execute(query, context),
        BudgetAnalyst.execute(query, context),
        BookingTrendAnalyst.analyze(query, "upcoming", context),
        ImageService.getDestinationImage(query)
      ]);

      // 2. Synthesize Context for the main Concierge
      const synthesizedContext = `
      ${context}
      ---
      [EXPERT REPORTS]
      Research Team: ${researchReport}
      Accommodation Team: ${accommReport}
      Budget Team: ${budgetReport}
      Booking Analyst: ${bookingAnalysis.report}
      ---
      Please use the expert reports above to generate the final perfect itinerary JSON payload and your conversational response.
      Ensure you include the Booking Analyst's trend analysis in the tripSummary.trendAnalysis field.
      Also, include this precise image URL in the destinationOverview.imageUrl field: ${destinationImageUrl}
      `;

      await TravelConcierge.streamExecution(
        query, 
        synthesizedContext, 
        travelPlanSchema, 
        history, 
        (token) => {
          fullResponse += token;
          onToken && onToken(token);
        },
        (toolArgs) => {
          latestJsonPlan = toolArgs;
          onToolCall && onToolCall(toolArgs);
        }
      );
    } catch (e) {
      console.error("Orchestrator failed:", e);
      onToken && onToken("I encountered an issue coordinating with my expert team. Could we try again?");
      fullResponse = "Error occurred.";
    }

    // Save AI Response text
    await AgentMemory.saveSessionMessage(userId, sessionId, 'model', fullResponse);
    // Optionally we could save the latestJsonPlan to another database table if we wanted to persist the trip draft immediately.

    return {
      intent: 'PLAN_TRIP',
      response: fullResponse,
      structuredData: latestJsonPlan
    };
  }
}
