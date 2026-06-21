export const fallbackTripData = {
  resultType: "fallback",
  data: {
    destinationOverview: {
      knownFor: "Its rich local culture, historical landmarks, and vibrant food scene.",
      bestTime: "Spring or Autumn for the most pleasant weather.",
      vibe: "A perfect blend of historical charm and modern energy.",
      suitsBest: "Explorers, foodies, and culture enthusiasts.",
      imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
    },
    budgetBreakdown: {
      accommodation: 450,
      food: 300,
      localTravel: 100,
      activities: 150,
      emergencyBuffer: 200,
      totalEstimatedCost: 1200,
      currency: "USD"
    },
    stayPlan: [
      {
        tier: "Budget",
        nightlyPriceRange: "$50 - $80",
        areas: ["Downtown Hostels", "Suburban Guesthouses"],
        tradeoffs: "Further from main attractions, shared amenities.",
        suitability: "Solo travelers and budget-conscious backpackers."
      },
      {
        tier: "Mid-range",
        nightlyPriceRange: "$100 - $180",
        areas: ["City Center Boutiques", "Historic District Hotels"],
        tradeoffs: "Great balance of location and comfort, might lack premium amenities.",
        suitability: "Couples and small groups."
      },
      {
        tier: "Premium",
        nightlyPriceRange: "$300+",
        areas: ["Luxury Resorts", "Waterfront 5-Star Hotels"],
        tradeoffs: "High cost, but unmatched comfort and service.",
        suitability: "Honeymooners and luxury seekers."
      }
    ],
    transportPlan: {
      arrivalOptions: "Airport express train or app-based taxis (Uber/Lyft).",
      cityTransport: "Extensive metro/subway system and walkable city centers.",
      tradeoffs: "Metro can be crowded during rush hour, taxis are more expensive but convenient."
    },
    itinerary: [
      {
        day: 1,
        morning: "Arrive, check-in, and take a light walking tour of the immediate neighborhood.",
        afternoon: "Visit the primary historical landmark or museum to get oriented.",
        evening: "Welcome dinner at a highly-rated local restaurant.",
        foodBreaks: "Lunch near the museum, dinner in the city center.",
        travelTime: "2 hours",
        restTime: "3 hours"
      },
      {
        day: 2,
        morning: "Early start for a guided city tour or major attraction visit.",
        afternoon: "Explore local markets and artisan shops.",
        evening: "Enjoy a scenic sunset view followed by casual dining.",
        foodBreaks: "Street food for lunch, relaxed sit-down dinner.",
        travelTime: "1.5 hours",
        restTime: "2 hours"
      },
      {
        day: 3,
        morning: "Day trip or nature walk outside the main city hub.",
        afternoon: "Relax at a local cafe and pick up souvenirs.",
        evening: "Farewell dinner and preparing for departure.",
        foodBreaks: "Picnic or cafe lunch, upscale farewell dinner.",
        travelTime: "2.5 hours",
        restTime: "4 hours"
      }
    ],
    smartRecommendations: {
      topAttractions: [
        {
          name: "City Historical Center",
          description: "The heart of the city with centuries-old architecture.",
          category: "History",
          lat: 0,
          lng: 0
        },
        {
          name: "Central Park/Botanical Gardens",
          description: "A lush green escape in the middle of the urban landscape.",
          category: "Nature",
          lat: 0,
          lng: 0
        }
      ],
      foodSpots: ["Local Central Market", "Historic District Cafes", "Riverside Dining"],
      hiddenGems: ["Lesser-known local art galleries", "Neighborhood night markets"],
      photoSpots: ["Top of the main observation deck", "Cobblestone alleyways at golden hour"],
      safetyTips: ["Keep valuables secure in crowded areas", "Use official taxis or rideshares"],
      packingAdvice: ["Comfortable walking shoes are a must", "Layers for changing evening temperatures"]
    },
    tripSummary: {
      totalExpectedSpend: "Approx. $1200 USD (excluding flights)",
      recommendedBookingApproach: "Book accommodation 2-3 months in advance; book local tours a week ahead.",
      priorityActions: ["Set flight alerts", "Reserve the mid-range hotel", "Book the main museum tickets"],
      finalRecommendation: "This destination offers a fantastic mix of history and culture. Stick to public transport to save money and maximize your budget for food and experiences.",
      trendAnalysis: "Based on historical data, this is a popular timeframe. Expect moderate crowds and standard pricing."
    }
  }
};
