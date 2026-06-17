import apiClient from './apiClient';

export const authService = {
  syncFirebaseUser: async (firebaseToken) => {
    return apiClient.post('/auth/sync', { firebaseToken });
  },
  
  verifySession: async () => {
    return apiClient.get('/auth/session');
  },

  logout: async () => {
    return apiClient.post('/auth/logout');
  }
};
