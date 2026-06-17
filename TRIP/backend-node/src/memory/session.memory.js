import { firestore } from '../config/firebase.js';

export class AgentMemory {
  /**
   * Session Memory: Short term memory for the current chat session
   */
  static async getSessionHistory(userId, sessionId) {
    const snapshot = await firestore
      .collection('users')
      .doc(userId)
      .collection('sessions')
      .doc(sessionId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .limit(20)
      .get();

    return snapshot.docs.map(doc => doc.data());
  }

  static async saveSessionMessage(userId, sessionId, role, content) {
    await firestore
      .collection('users')
      .doc(userId)
      .collection('sessions')
      .doc(sessionId)
      .collection('messages')
      .add({
        role,
        content,
        timestamp: new Date()
      });
  }

  /**
   * Profile Memory: Extracting long-term implicit preferences
   * In a real RAG system, this would involve embeddings. 
   * Here we fetch explicit and implicit preferences from Firestore.
   */
  static async getProfileContext(userId) {
    const prefsDoc = await firestore.collection('preferences').doc(userId).get();
    if (!prefsDoc.exists) return 'No known long-term preferences.';
    
    const prefs = prefsDoc.data();
    return `User prefers: Budget level is ${prefs.budgetLevel || 'moderate'}. Dietary restrictions: ${prefs.dietary?.join(',') || 'none'}.`;
  }
}
