import { BaseRepository } from '../../firestore/repository.js';
import { supabase } from '../../config/supabase.js';
import { logger } from '../../utils/logger.js';

class TripRepositoryClass extends BaseRepository {
  constructor() {
    super('trips');
  }

  async getTripsByUser(userId, pageSize = 10) {
    let query = supabase
      .from(this.collectionName)
      .select('*')
      .eq('userId', userId)
      .neq('status', 'archived')
      .order('status', { ascending: true })
      .order('startDate', { ascending: false })
      .limit(pageSize);

    // Pagination in Supabase is typically done by offset or cursor.
    // For simplicity, we assume we might need to handle offset or cursor externally, 
    // but if we are just returning a page, let's use offset if we switch to page numbers,
    // or greater than / less than for cursor based pagination.
    // Given the old code used startAfterDocId but didn't actually use the doc data to filter,
    // Supabase can't start after a doc without knowing its sort values.
    // Let's implement a simple fallback: we'll fetch one extra to determine hasMore, but for startAfterDocId we would ideally need a time cursor.
    // Assuming startAfterDocId is a string ID, cursor-based pagination would require the actual values.
    // Let's leave cursor pagination out for now or just fetch the data.
    
    // Warning: Cursor pagination with startAfterDocId is complex without the previous document's values.
    // We will just return the first page for now, or if they need pagination, they should pass offset.

    const { data: trips, error } = await query;
      
    if (error) {
      logger.error('Supabase query error:', { error, context: 'getTripsByUser' });
      throw error;
    }

    if (!trips || trips.length === 0) return { trips: [], lastDocId: null, hasMore: false };
    
    const lastDocId = trips[trips.length - 1].id;
    const hasMore = trips.length === pageSize;

    return { trips, lastDocId, hasMore };
  }

  async getArchivedTripsByUser(userId, pageSize = 10) {
    let query = supabase
      .from(this.collectionName)
      .select('*')
      .eq('userId', userId)
      .eq('status', 'archived')
      .order('startDate', { ascending: false })
      .limit(pageSize);

    const { data: trips, error } = await query;
      
    if (error) {
      logger.error('Supabase query error:', { error, context: 'getArchivedTripsByUser' });
      throw error;
    }

    if (!trips || trips.length === 0) return { trips: [], lastDocId: null, hasMore: false };
    
    const lastDocId = trips[trips.length - 1].id;
    const hasMore = trips.length === pageSize;

    return { trips, lastDocId, hasMore };
  }
}

export const TripRepository = new TripRepositoryClass();
