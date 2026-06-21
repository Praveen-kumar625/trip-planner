import { BaseRepository } from '../../firestore/repository.js';
import { supabase } from '../../config/supabase.js';
import { logger } from '../../utils/logger.js';

class PreferencesRepositoryClass extends BaseRepository {
  constructor() {
    // We will store preferences in a single document in 'preferences' with id = userId
    super('preferences');
  }

  // Override create/update since the ID will always be the userId
  async upsertPreferences(userId, data) {
    const payload = { ...data, id: userId, updatedAt: new Date().toISOString() };
    const { data: result, error } = await supabase
      .from(this.collectionName)
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();
      
    if (error) {
      logger.error('Supabase query error (upsertPreferences):', { error });
      throw error;
    }
    return result;
  }
}

export const PreferencesRepository = new PreferencesRepositoryClass();
