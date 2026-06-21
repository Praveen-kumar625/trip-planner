export const overviewSchema = {
  type: "object",
  properties: {
    knownFor: { type: "string" },
    bestTime: { type: "string" },
    vibe: { type: "string" },
    suitsBest: { type: "string" }
  },
  required: ["knownFor", "bestTime", "vibe", "suitsBest"]
};

export const budgetSchema = {
  type: "object",
  properties: {
    accommodation: { type: "number" },
    food: { type: "number" },
    localTravel: { type: "number" },
    activities: { type: "number" },
    emergencyBuffer: { type: "number" },
    totalEstimatedCost: { type: "number" },
    currency: { type: "string", description: "e.g. USD, EUR, INR" }
  },
  required: ["accommodation", "food", "localTravel", "activities", "emergencyBuffer", "totalEstimatedCost", "currency"]
};

export const stayPlanSchema = {
  type: "object",
  properties: {
    options: {
      type: "array",
      description: "Must contain exactly 3 tiers: budget, mid-range, premium",
      items: {
        type: "object",
        properties: {
          tier: { type: "string" },
          nightlyPriceRange: { type: "string" },
          areas: { type: "array", items: { type: "string" } },
          tradeoffs: { type: "string" },
          suitability: { type: "string" }
        },
        required: ["tier", "nightlyPriceRange", "areas", "tradeoffs", "suitability"]
      }
    }
  },
  required: ["options"]
};

export const itinerarySchema = {
  type: "object",
  properties: {
    days: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "number" },
          morning: { type: "string" },
          afternoon: { type: "string" },
          evening: { type: "string" },
          foodBreaks: { type: "string" },
          travelTime: { type: "string" },
          restTime: { type: "string" }
        },
        required: ["day", "morning", "afternoon", "evening", "foodBreaks", "travelTime", "restTime"]
      }
    }
  },
  required: ["days"]
};

export const insightsSchema = {
  type: "object",
  properties: {
    topAttractions: { 
      type: "array", 
      items: { 
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          category: { type: "string" },
          lat: { type: "number" },
          lng: { type: "number" }
        },
        required: ["name", "description", "category", "lat", "lng"]
      } 
    },
    foodSpots: { type: "array", items: { type: "string" } },
    hiddenGems: { type: "array", items: { type: "string" } },
    photoSpots: { type: "array", items: { type: "string" } },
    safetyTips: { type: "array", items: { type: "string" } },
    packingAdvice: { type: "array", items: { type: "string" } }
  },
  required: ["topAttractions", "foodSpots", "hiddenGems", "photoSpots", "safetyTips", "packingAdvice"]
};
