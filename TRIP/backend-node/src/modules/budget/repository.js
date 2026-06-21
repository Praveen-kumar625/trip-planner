import { BaseRepository } from '../../firestore/repository.js';
import { supabase } from '../../config/supabase.js';
import { logger } from '../../utils/logger.js';

class BudgetRepositoryClass extends BaseRepository {
  constructor() {
    super('budgets');
  }

  async getBudgetByTripId(userId, tripId) {
    const { data, error } = await supabase
      .from(this.collectionName)
      .select('*')
      .eq('userId', userId)
      .eq('tripId', tripId)
      .maybeSingle();
      
    if (error) {
      logger.error('Supabase query error (getBudgetByTripId):', { error });
      throw error;
    }
    
    return data;
  }
}

export const BudgetRepository = new BudgetRepositoryClass();
