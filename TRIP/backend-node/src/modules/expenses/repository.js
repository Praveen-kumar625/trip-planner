import { BaseRepository } from '../../firestore/repository.js';

class ExpenseRepositoryClass extends BaseRepository {
  constructor() {
    super('expenses');
  }

  async getExpensesByTripId(userId, tripId) {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .where('tripId', '==', tripId)
      .orderBy('date', 'desc')
      .get();
      
    if (snapshot.empty) return [];
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

export const ExpenseRepository = new ExpenseRepositoryClass();
