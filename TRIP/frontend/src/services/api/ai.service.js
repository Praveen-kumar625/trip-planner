import apiClient from './apiClient';

export const aiService = {
  /**
   * We will handle standard requests here.
   * For streaming requests (SSE), we will use native fetch or EventSource in the components,
   * but we can wrap the fetch logic here for standard structured queries.
   */
  chat: async (payload) => {
    return apiClient.post('/ai/chat', payload);
  },
  
  // Method to get a native SSE stream reader with exponential backoff and retry
  streamChat: async (payload, onMessage, onError, onComplete, retries = 3, delay = 1000) => {
    const token = (await import('../../store/authStore')).useAuthStore.getState().token;
    const baseURL = apiClient.defaults.baseURL;

    try {
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network and try again.');
      }

      const response = await fetch(`${baseURL}/ai/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        if (response.status === 429 && retries > 0) {
          console.warn(`Rate limited. Retrying in ${delay}ms...`);
          setTimeout(() => aiService.streamChat(payload, onMessage, onError, onComplete, retries - 1, delay * 2), delay);
          return;
        }
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          onComplete && onComplete();
          break;
        }
        
        buffer += decoder.decode(value, { stream: true });
        
        // Split by SSE messages
        const messages = buffer.split('\n\n');
        buffer = messages.pop() || '';

        for (const message of messages) {
          if (message.startsWith('data: ')) {
            const dataStr = message.replace('data: ', '');
            if (dataStr === '[DONE]') {
              onComplete && onComplete();
              return;
            }
            try {
              const parsed = JSON.parse(dataStr);
              onMessage(parsed);
            } catch (e) {
              console.warn('Failed to parse SSE JSON:', dataStr);
            }
          }
        }
      }
    } catch (error) {
      if (retries > 0 && error.message !== 'No internet connection. Please check your network and try again.') {
        console.warn(`Stream failed. Retrying in ${delay}ms...`, error);
        setTimeout(() => aiService.streamChat(payload, onMessage, onError, onComplete, retries - 1, delay * 2), delay);
      } else {
        onError && onError(error);
      }
    }
  }
};
