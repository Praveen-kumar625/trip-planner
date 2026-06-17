import { PreferencesRepository } from './repository.js';

export class PreferencesService {
  static async getPreferences(userId) {
    const prefs = await PreferencesRepository.getById(userId);
    if (!prefs) {
      // Return default empty preferences
      return {
        id: userId,
        dietary: [],
        seating: 'any',
        budgetLevel: 'moderate',
        accessibility: [],
        favoriteAirlines: [],
        preferredActivities: [],
        implicitContext: {}
      };
    }
    return prefs;
  }

  static async updatePreferences(userId, data) {
    // The data might come from the user manually, or from the AI orchestrator implicitly
    return await PreferencesRepository.upsertPreferences(userId, data);
  }

  static async deletePreference(userId, key) {
    const prefs = await this.getPreferences(userId);
    if (prefs[key] !== undefined) {
      // Use Firestore FieldValue.delete() for exact key deletion if needed, 
      // but for simplicity we overwrite with undefined or default
      if (Array.isArray(prefs[key])) {
        prefs[key] = [];
      } else {
        prefs[key] = null;
      }
      return await PreferencesRepository.upsertPreferences(userId, prefs);
    }
    return prefs;
  }
}
