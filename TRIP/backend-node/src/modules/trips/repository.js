import { BaseRepository } from '../../firestore/repository.js';
import { firestore } from '../../config/firebase.js';

class TripRepositoryClass extends BaseRepository {
  constructor() {
    super('trips');
  }

  async getTripsByUser(userId) {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .where('status', '!=', 'archived')
      .orderBy('status')
      .orderBy('startDate', 'desc')
      .get();
      
    if (snapshot.empty) return [];
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async getArchivedTripsByUser(userId) {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .where('status', '==', 'archived')
      .get();
      
    if (snapshot.empty) return [];
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

export const TripRepository = new TripRepositoryClass();
