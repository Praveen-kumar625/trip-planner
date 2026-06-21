import { supabase } from '@/config/supabase';

const TRIPS_COLLECTION = 'trips';

export const tripsService = {
  /**
   * Get all trips for a specific user with pagination
   */
  getAllTrips: async (userId, limitCount = 10, pageParam = null) => {
    if (!userId) throw new Error("User ID is required to fetch trips");
    
    let query = supabase
      .from(TRIPS_COLLECTION)
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .limit(limitCount);

    // For cursor based pagination in Supabase, you would need the exact sort value.
    // Assuming pageParam is an offset for simplicity if we were to change it.
    // Here we'll just ignore pageParam for now or use range if it were numeric.
    
    const { data: trips, error } = await query;
    if (error) throw error;
    
    const lastDocId = trips && trips.length > 0 ? trips[trips.length - 1].id : null;
    const hasMore = trips ? trips.length === limitCount : false;

    return { data: trips || [], lastDocId, hasMore };
  },
  
  /**
   * Get a specific trip by ID
   */
  getTripById: async (id) => {
    if (!id) throw new Error("Trip ID is required");
    
    const { data: trip, error } = await supabase
      .from(TRIPS_COLLECTION)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !trip) {
      throw new Error("Trip not found");
    }
    
    return { data: trip };
  },

  /**
   * Create a new trip
   */
  createTrip: async (tripData) => {
    if (!tripData.userId) throw new Error("User ID is required to create a trip");
    
    const newTripData = {
      ...tripData,
      isPublic: tripData.isPublic || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const { data: insertedTrip, error } = await supabase
      .from(TRIPS_COLLECTION)
      .insert([newTripData])
      .select()
      .single();
      
    if (error) throw error;
    return { data: insertedTrip };
  },

  /**
   * Update an existing trip
   */
  updateTrip: async (id, tripData) => {
    if (!id) throw new Error("Trip ID is required");
    
    const updateData = {
      ...tripData,
      updatedAt: new Date().toISOString()
    };
    
    const { data: updatedTrip, error } = await supabase
      .from(TRIPS_COLLECTION)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return { data: updatedTrip };
  },

  /**
   * Delete a trip
   */
  deleteTrip: async (id) => {
    if (!id) throw new Error("Trip ID is required");
    
    const { error } = await supabase
      .from(TRIPS_COLLECTION)
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return { success: true };
  },

  /**
   * Duplicate a trip
   */
  duplicateTrip: async (id, userId) => {
    if (!id || !userId) throw new Error("Trip ID and User ID are required");
    
    const { data: originalTrip, error: fetchError } = await supabase
      .from(TRIPS_COLLECTION)
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError || !originalTrip) {
      throw new Error("Trip not found");
    }
    
    // Remove id to let supabase generate a new one
    delete originalTrip.id;
    
    const newTripData = {
      ...originalTrip,
      title: `${originalTrip.title || 'Trip'} (Copy)`,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const { data: insertedTrip, error: insertError } = await supabase
      .from(TRIPS_COLLECTION)
      .insert([newTripData])
      .select()
      .single();
      
    if (insertError) throw insertError;
    return { data: insertedTrip };
  },

  /**
   * Archive a trip (soft delete or status change)
   */
  archiveTrip: async (id) => {
    if (!id) throw new Error("Trip ID is required");
    
    const { error } = await supabase
      .from(TRIPS_COLLECTION)
      .update({ 
        status: 'archived',
        updatedAt: new Date().toISOString() 
      })
      .eq('id', id);
      
    if (error) throw error;
    return { success: true };
  },

  /**
   * Toggle Trip Privacy
   */
  toggleTripPrivacy: async (id, isPublic) => {
    if (!id) throw new Error("Trip ID is required");
    
    const { error } = await supabase
      .from(TRIPS_COLLECTION)
      .update({ 
        isPublic: isPublic,
        updatedAt: new Date().toISOString() 
      })
      .eq('id', id);
      
    if (error) throw error;
    return { success: true, isPublic };
  },

  /**
   * Get all public trips (Community Feed)
   */
  getPublicTrips: async (limitCount = 10, pageParam = null) => {
    let query = supabase
      .from(TRIPS_COLLECTION)
      .select('*')
      .eq('isPublic', true)
      .order('createdAt', { ascending: false })
      .limit(limitCount);
      
    const { data: trips, error } = await query;
    if (error) throw error;
    
    const lastDocId = trips && trips.length > 0 ? trips[trips.length - 1].id : null;
    const hasMore = trips ? trips.length === limitCount : false;

    return { data: trips || [], lastDocId, hasMore };
  },

  /**
   * Get a specific user's public trips
   */
  getUserPublicTrips: async (userId, limitCount = 10, pageParam = null) => {
    if (!userId) throw new Error("User ID is required");
    
    let query = supabase
      .from(TRIPS_COLLECTION)
      .select('*')
      .eq('userId', userId)
      .eq('isPublic', true)
      .order('createdAt', { ascending: false })
      .limit(limitCount);
      
    const { data: trips, error } = await query;
    if (error) throw error;
    
    const lastDocId = trips && trips.length > 0 ? trips[trips.length - 1].id : null;
    const hasMore = trips ? trips.length === limitCount : false;

    return { data: trips || [], lastDocId, hasMore };
  }
};
