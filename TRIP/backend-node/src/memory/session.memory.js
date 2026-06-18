import { firestore, firebaseAdmin } from '../config/firebase.js';

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
      .limitToLast(10) // Limit to last 10 messages for history truncation
      .get();

    return snapshot.docs.map(doc => doc.data());
  }

  static async saveSessionMessage(userId, sessionId, role, content) {
    // Truncate content to max 2000 characters to prevent prompt injection and token burn
    const truncatedContent = content.length > 2000 ? content.substring(0, 2000) + '...' : content;
    
    await firestore
      .collection('users')
      .doc(userId)
      .collection('sessions')
      .doc(sessionId)
      .collection('messages')
      .add({
        role,
        content: truncatedContent,
        timestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp()
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
