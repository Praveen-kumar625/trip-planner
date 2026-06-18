import { create } from 'zustand';

/**
 * Trip Generator Wizard State.
 * Manages the 6-step wizard: Destination → Dates → Travelers → Budget → Preferences → Review.
 */
export const useTripGeneratorStore = create((set, get) => ({
  // Current wizard step (1-6)
  step: 1,
  totalSteps: 6,

  // Step 1: Destination
  destination: null,

  // Step 2: Dates
  startDate: '',
  endDate: '',

  // Step 3: Travelers
  travelerType: null, // 'solo' | 'couple' | 'family' | 'friends'
  travelerCount: 1,

  // Step 4: Budget
  budget: null,

  // Step 5: Preferences
  preferences: [],

  // Wizard state
  isComplete: false,

  // Actions
  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, s.totalSteps) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),

  setDestination: (destination) => set({ destination }),
  setDates: (startDate, endDate) => set({ startDate, endDate }),
  setTravelerType: (travelerType) => {
    const counts = { solo: 1, couple: 2, family: 4, friends: 4 };
    set({ travelerType, travelerCount: counts[travelerType] || 1 });
  },
  setTravelerCount: (travelerCount) => set({ travelerCount }),
  setBudget: (budget) => set({ budget }),
  togglePreference: (pref) =>
    set((s) => ({
      preferences: s.preferences.includes(pref)
        ? s.preferences.filter((p) => p !== pref)
        : [...s.preferences, pref],
    })),
  setPreferences: (preferences) => set({ preferences }),

  // Check if current step is valid
  isStepValid: () => {
    const s = get();
    switch (s.step) {
      case 1:
        return !!s.destination?.placeId;
      case 2:
        return !!s.startDate && !!s.endDate && new Date(s.endDate) >= new Date(s.startDate);
      case 3:
        return !!s.travelerType && s.travelerCount >= 1;
      case 4:
        return !!s.budget?.totalBudget;
      case 5:
        return s.preferences.length >= 1;
      case 6:
        return true; // Review step is always valid
      default:
        return false;
    }
  },

  /**
   * Generate the structured AI payload from wizard data.
   */
  generatePayload: () => {
    const s = get();
    return {
      destination: {
        city: s.destination?.city || '',
        state: s.destination?.state || '',
        country: s.destination?.country || '',
        placeId: s.destination?.placeId || '',
        latitude: s.destination?.latitude || 0,
        longitude: s.destination?.longitude || 0,
      },
      travelers: s.travelerCount,
      travelerType: s.travelerType,
      budget: s.budget?.totalBudget || 0,
      budgetType: s.budget?.budgetType || 'Custom',
      currency: 'INR',
      startDate: s.startDate,
      endDate: s.endDate,
      interests: s.preferences,
    };
  },

  /**
   * Build a structured AI prompt string from the payload.
   */
  generatePrompt: () => {
    const payload = get().generatePayload();
    const days =
      payload.startDate && payload.endDate
        ? Math.ceil(
            (new Date(payload.endDate) - new Date(payload.startDate)) / (1000 * 60 * 60 * 24)
          ) + 1
        : 'a few';

    return `Plan a ${days}-day trip to ${payload.destination.city}, ${payload.destination.state}, ${payload.destination.country} for ${payload.travelers} ${payload.travelerType === 'solo' ? 'person' : 'people'} (${payload.travelerType} trip). Budget: ₹${payload.budget.toLocaleString('en-IN')} (${payload.budgetType}). Interests: ${payload.interests.join(', ')}. Travel dates: ${payload.startDate} to ${payload.endDate}. Please create a detailed day-by-day itinerary with accommodation suggestions, restaurant recommendations, activity timings, and cost breakdowns in INR.`;
  },

  // Reset wizard
  reset: () =>
    set({
      step: 1,
      destination: null,
      startDate: '',
      endDate: '',
      travelerType: null,
      travelerCount: 1,
      budget: null,
      preferences: [],
      isComplete: false,
    }),
}));
