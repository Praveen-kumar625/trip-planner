import { BaseRepository } from '../../firestore/repository.js';
import { firestore } from '../../config/firebase.js';

class TripRepositoryClass extends BaseRepository {
  constructor() {
    super('trips');
  }

  async getTripsByUser(userId, pageSize = 10, startAfterDocId = null) {
    let query = this.collection
      .where('userId', '==', userId)
      .where('status', '!=', 'archived')
      .orderBy('status')
      .orderBy('startDate', 'desc')
      .limit(pageSize);

    if (startAfterDocId) {
      const docRef = await this.collection.doc(startAfterDocId).get();
      if (docRef.exists) {
        query = query.startAfter(docRef);
      }
    }

    const snapshot = await query.get();
      
    if (snapshot.empty) return { trips: [], lastDocId: null, hasMore: false };
    
    const trips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const lastDocId = snapshot.docs[snapshot.docs.length - 1].id;
    const hasMore = trips.length === pageSize;

    return { trips, lastDocId, hasMore };
  }

  async getArchivedTripsByUser(userId, pageSize = 10, startAfterDocId = null) {
    let query = this.collection
      .where('userId', '==', userId)
      .where('status', '==', 'archived')
      .orderBy('startDate', 'desc')
      .limit(pageSize);

    if (startAfterDocId) {
      const docRef = await this.collection.doc(startAfterDocId).get();
      if (docRef.exists) {
        query = query.startAfter(docRef);
      }
    }

    const snapshot = await query.get();
      
    if (snapshot.empty) return { trips: [], lastDocId: null, hasMore: false };
    
    const trips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const lastDocId = snapshot.docs[snapshot.docs.length - 1].id;
    const hasMore = trips.length === pageSize;

    return { trips, lastDocId, hasMore };
  }
}

export const TripRepository = new TripRepositoryClass();
