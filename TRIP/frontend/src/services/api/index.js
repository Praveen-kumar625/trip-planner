import apiClient from './apiClient';

export const analyticsService = {
  getDashboard: async () => apiClient.get('/analytics/dashboard'),
  getSpendingTrends: async () => apiClient.get('/analytics/spending-trends')
};

export const mapsService = {
  searchPlaces: async (query) => apiClient.get(`/maps/search?q=${encodeURIComponent(query)}`),
  getPlaceDetails: async (placeId) => apiClient.get(`/maps/place/${placeId}`),
  getDirections: async (params) => apiClient.post('/maps/directions', params)
};

export const destinationsService = {
  getTrending: async () => apiClient.get('/destinations/trending'),
  searchDestinations: async (query) => apiClient.get(`/destinations/search?q=${encodeURIComponent(query)}`)
};

export const notificationsService = {
  getUnread: async () => apiClient.get('/notifications/unread'),
  markAsRead: async (id) => apiClient.patch(`/notifications/${id}/read`),
  markAllAsRead: async () => apiClient.post('/notifications/mark-all-read')
};

export const preferencesService = {
  getPreferences: async () => apiClient.get('/preferences'),
  updatePreferences: async (data) => apiClient.put('/preferences', data)
};
