import apiClient from './apiClient';
import { auth } from '../../config/firebase';

const rawBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8000';
const baseURL = rawBase.endsWith('/api/v1') ? rawBase : `${rawBase}/api/v1`;

export const aiService = {
  chat: async (payload) => {
    return apiClient.post('/ai/chat', payload);
  },
  
  streamChat: async (payload, onMessage, onError, onComplete, retries = 3, delay = 1000) => {
    try {
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network and try again.');
      }

      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : '';

      const response = await fetch(`${baseURL}/ai/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          query: payload.message,
          sessionId: payload.sessionId || 'default',
          context: payload.tripContext || {},
          history: payload.history || []
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let done = false;
      let buffer = '';

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop(); // keep incomplete line in buffer

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.replace('data: ', '').trim();
              if (dataStr === '[DONE]') {
                done = true;
                break;
              }
              if (!dataStr) continue;

              try {
                const parsed = JSON.parse(dataStr);
                onMessage(parsed);
              } catch (e) {
                console.error("Failed to parse SSE line:", line, e);
              }
            }
          }
        }
      }
      
      onComplete && onComplete();

    } catch (error) {
      if (retries > 0 && error.message !== 'No internet connection. Please check your network and try again.') {
        console.warn(`Stream request failed. Retrying in ${delay}ms...`, error);
        setTimeout(() => aiService.streamChat(payload, onMessage, onError, onComplete, retries - 1, delay * 2), delay);
      } else {
        onError && onError(error);
      }
    }
  }
};
