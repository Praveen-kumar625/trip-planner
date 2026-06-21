/**
 * TripDataNormalizer
 * Converts legacy v1-v9 trip string/object structures into the OmniPlan v10 modular schema.
 * Ensures backward compatibility with existing databases.
 */

export function normalizeTripData(trip) {
  if (!trip) return null;

  // Clone trip to avoid mutating store state directly
  const normalized = { ...trip };
  
  let parsedItinerary = {};
  
  if (typeof trip.itinerary === 'string') {
    try {
      parsedItinerary = JSON.parse(trip.itinerary) || {};
    } catch (e) {
      console.warn('Failed to parse legacy itinerary string', e);
      parsedItinerary = { legacyText: trip.itinerary };
    }
  } else if (typeof trip.itinerary === 'object' && trip.itinerary !== null) {
    parsedItinerary = trip.itinerary;
  }

  // If already v10 schema, return as is
  if (parsedItinerary?.modules && parsedItinerary?.modules?.overview) {
    normalized.modules = parsedItinerary.modules;
    return normalized;
  }

  // Adapt legacy to v10 modules
  normalized.modules = {
    overview: {
      status: 'COMPLETED',
      data: parsedItinerary.destinationOverview || null,
      tripSummary: parsedItinerary.tripSummary || null
    },
    routes: {
      status: 'COMPLETED',
      data: parsedItinerary.itinerary || [] // Legacy itinerary array
    },
    budget: {
      status: 'COMPLETED',
      data: parsedItinerary.budgetBreakdown || null
    },
    destinations: {
      status: 'COMPLETED',
      data: parsedItinerary.smartRecommendations?.topAttractions || []
    },
    hotels: {
      status: 'COMPLETED',
      data: parsedItinerary.stayPlan || []
    },
    restaurants: {
      status: 'COMPLETED',
      data: parsedItinerary.smartRecommendations?.foodSpots || []
    },
    activities: {
      status: 'PENDING',
      data: []
    },
    transport: {
      status: 'COMPLETED',
      data: parsedItinerary.transportPlan || null
    },
    weather: {
      status: 'PENDING',
      data: null
    },
    maps: {
      status: 'PENDING',
      data: null
    },
    timeline: {
      status: 'COMPLETED',
      data: parsedItinerary.itinerary || []
    },
    checklist: {
      status: 'COMPLETED',
      data: parsedItinerary.smartRecommendations?.packingAdvice || []
    },
    insights: {
      status: 'COMPLETED',
      data: {
        hiddenGems: parsedItinerary.smartRecommendations?.hiddenGems || [],
        safetyTips: parsedItinerary.smartRecommendations?.safetyTips || [],
        photoSpots: parsedItinerary.smartRecommendations?.photoSpots || []
      }
    },
    media: {
      status: 'PENDING',
      data: null
    }
  };

  return normalized;
}
