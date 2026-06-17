import apiClient from './apiClient';

export const tripsService = {
  getAllTrips: async () => {
    return apiClient.get('/trips');
  },
  
  getTripById: async (id) => {
    return apiClient.get(`/trips/${id}`);
  },

  createTrip: async (tripData) => {
    return apiClient.post('/trips', tripData);
  },

  updateTrip: async (id, tripData) => {
    return apiClient.put(`/trips/${id}`, tripData);
  },

  deleteTrip: async (id) => {
    return apiClient.delete(`/trips/${id}`);
  },

  duplicateTrip: async (id) => {
    return apiClient.post(`/trips/${id}/duplicate`);
  },

  archiveTrip: async (id) => {
    return apiClient.post(`/trips/${id}/archive`);
  }
};
