import { firestore } from '../config/firebase.js';
import { logger } from '../utils/logger.js';

/**
 * Generic Base Repository for Firestore
 */
export class BaseRepository {
  constructor(collectionName) {
    this.collectionName = collectionName;
    this.collection = firestore.collection(collectionName);
  }

  async getById(id) {
    try {
      const doc = await this.collection.doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      logger.error(`Error fetching ${this.collectionName}/${id}:`, error);
      throw error;
    }
  }

  async create(id, data) {
    try {
      if (id) {
        await this.collection.doc(id).set({
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        return { id, ...data };
      } else {
        const ref = await this.collection.add({
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        return { id: ref.id, ...data };
      }
    } catch (error) {
      logger.error(`Error creating in ${this.collectionName}:`, error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      await this.collection.doc(id).update({
        ...data,
        updatedAt: new Date().toISOString()
      });
      return { id, ...data };
    } catch (error) {
      logger.error(`Error updating ${this.collectionName}/${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await this.collection.doc(id).delete();
      return true;
    } catch (error) {
      logger.error(`Error deleting ${this.collectionName}/${id}:`, error);
      throw error;
    }
  }
}
