import { BaseRepository } from '../../firestore/repository.js';
import { firestore } from '../../config/firebase.js';

class PreferencesRepositoryClass extends BaseRepository {
  constructor() {
    // We will store preferences in a subcollection under the user, or just as a single document in 'preferences' with id = userId
    super('preferences');
  }

  // Override create/update since the ID will always be the userId
  async upsertPreferences(userId, data) {
    const docRef = this.collection.doc(userId);
    await docRef.set(data, { merge: true });
    
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  }
}

export const PreferencesRepository = new PreferencesRepositoryClass();
