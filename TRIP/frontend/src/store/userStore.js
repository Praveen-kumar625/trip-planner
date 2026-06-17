import { create } from 'zustand';
import { preferencesService } from '../services/api';

export const useUserStore = create((set) => ({
  preferences: null,
  isLoading: false,

  fetchPreferences: async () => {
    set({ isLoading: true });
    try {
      const response = await preferencesService.getPreferences();
      set({ preferences: response.data, isLoading: false });
    } catch (error) {
      console.warn('Failed to load preferences', error);
      set({ isLoading: false });
    }
  },

  updatePreferences: async (updates) => {
    try {
      const response = await preferencesService.updatePreferences(updates);
      set({ preferences: response.data });
    } catch (error) {
      throw new Error('Failed to update preferences');
    }
  }
}));
