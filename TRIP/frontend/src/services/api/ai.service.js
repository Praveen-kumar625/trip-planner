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
  
  streamChat: async (payload, onMessage, onError, onComplete, retries = 3, delay = 1000) => {
    try {
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network and try again.');
      }

      const response = await aiService.chat({
        query: payload.message,
        sessionId: payload.sessionId || 'default',
        context: payload.tripContext || {}
      });
      
      const responseData = response.data.data;
      
      if (responseData && responseData.response) {
        onMessage({ data: responseData.response });
      } else {
        onMessage({ data: "Received empty response from the Concierge." });
      }
      
      onComplete && onComplete();

    } catch (error) {
      if (retries > 0 && error.message !== 'No internet connection. Please check your network and try again.') {
        console.warn(`Request failed. Retrying in ${delay}ms...`, error);
        setTimeout(() => aiService.streamChat(payload, onMessage, onError, onComplete, retries - 1, delay * 2), delay);
      } else {
        onError && onError(error);
      }
    }
  }
};
