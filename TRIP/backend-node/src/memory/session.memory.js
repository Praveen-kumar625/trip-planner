import { supabase } from '../config/supabase.js';
import { logger } from '../utils/logger.js';

export class AgentMemory {
  /**
   * Session Memory: Short term memory for the current chat session
   */
  static async getSessionHistory(userId, sessionId) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('userId', userId)
      .eq('sessionId', sessionId)
      .order('timestamp', { ascending: false })
      .limit(10);

    if (error) {
      logger.error('Supabase getSessionHistory error:', { error });
      return [];
    }

    // Reverse to get chronological order since we fetched descending
    return data ? data.reverse() : [];
  }

  static async saveSessionMessage(userId, sessionId, role, content) {
    // Truncate content to max 2000 characters to prevent prompt injection and token burn
    const truncatedContent = content.length > 2000 ? content.substring(0, 2000) + '...' : content;
    
    const { error } = await supabase
      .from('chat_messages')
      .insert([{
        userId,
        sessionId,
        role,
        content: truncatedContent,
        timestamp: new Date().toISOString()
      }]);

    if (error) {
      logger.error('Supabase saveSessionMessage error:', { error });
    }
  }

  /**
   * Profile Memory: Extracting long-term implicit preferences
   * In a real RAG system, this would involve embeddings. 
   */
  static async getProfileContext(userId) {
    const { data: prefs, error } = await supabase
      .from('preferences')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !prefs) return 'No known long-term preferences.';
    
    return `User prefers: Budget level is ${prefs.budgetLevel || 'moderate'}. Dietary restrictions: ${prefs.dietary?.join(',') || 'none'}.`;
  }
}

