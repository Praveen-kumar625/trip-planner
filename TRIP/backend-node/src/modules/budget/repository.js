import { BaseRepository } from '../../firestore/repository.js';
import { firestore } from '../../config/firebase.js'; 

class BudgetRepositoryClass extends BaseRepository {
  constructor() {
    super('budgets');
  }

  async getBudgetByTripId(userId, tripId) {
    const snapshot = await this.collection
      .where('userId', '==', userId)  
      .where('tripId', '==', tripId)
      .limit(1)
      .get();
      
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }
}

export const BudgetRepository = new BudgetRepositoryClass();
