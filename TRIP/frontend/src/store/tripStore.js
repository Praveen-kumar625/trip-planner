import { create } from 'zustand';
import { tripsService } from '../services/api/trips.service';

export const useTripStore = create((set, get) => ({
  trips: [],
  currentTrip: null,
  isLoading: false,
  error: null,

  fetchTrips: async (userId) => {
    if (!userId) return;
    set({ isLoading: true, error: null });
    try {
      const response = await tripsService.getAllTrips(userId);
      set({ trips: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchTripById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tripsService.getTripById(id);
      set({ currentTrip: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createTrip: async (tripData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tripsService.createTrip(tripData);
      set((state) => ({ 
        trips: [response.data, ...state.trips], // prepend new trip
        isLoading: false 
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteTrip: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await tripsService.deleteTrip(id);
      set((state) => ({
        trips: state.trips.filter(t => t.id !== id),
        currentTrip: state.currentTrip?.id === id ? null : state.currentTrip,
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
}));
