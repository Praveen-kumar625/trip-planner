import { supabase } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

/**
 * Generic Base Repository for Supabase
 */
export class BaseRepository {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  async getById(id) {
    try {
      const { data, error } = await supabase
        .from(this.collectionName)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error(`Error fetching ${this.collectionName}/${id}:`, error);
      throw error;
    }
  }

  async create(id, data) {
    try {
      const payload = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      if (id) {
        payload.id = id;
      }
      const { data: insertedData, error } = await supabase
        .from(this.collectionName)
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return insertedData;
    } catch (error) {
      logger.error(`Error creating in ${this.collectionName}:`, error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const payload = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      const { data: updatedData, error } = await supabase
        .from(this.collectionName)
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedData;
    } catch (error) {
      logger.error(`Error updating ${this.collectionName}/${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const { error } = await supabase
        .from(this.collectionName)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error(`Error deleting ${this.collectionName}/${id}:`, error);
      throw error;
    }
  }
}
