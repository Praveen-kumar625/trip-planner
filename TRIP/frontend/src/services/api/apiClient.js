import axios from 'axios';
import { toast } from 'sonner';
import { auth } from '../../config/firebase';
import { useAuthStore } from '../../store/authStore';

const rawBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8000';
const baseURL = rawBase.endsWith('/api/v1') ? rawBase : `${rawBase}/api/v1`;

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Inject Firebase JWT Token
apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      // Get the fresh JWT from Firebase
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Normalize Errors and Toast
apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    
    // Prevent infinite loops on retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const user = auth.currentUser;
        if (user) {
          // Force refresh the token
          const newToken = await user.getIdToken(true);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } else {
          useAuthStore.getState().logout();
          toast.error("Session Expired", { description: "Please log in again." });
          return Promise.reject(error);
        }
      } catch (refreshError) {
        useAuthStore.getState().logout();
        toast.error("Session Expired", { description: "Please log in again." });
        return Promise.reject(refreshError);
      }
    }

    // Standardize and display API errors
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          toast.error("Invalid Request", { description: data?.message || "Please check your inputs." });
          break;
        case 403:
          toast.error("Access Denied", { description: "You don't have permission to do this." });
          break;
        case 404:
          toast.error("Resource Not Found", { description: "The item you're looking for doesn't exist." });
          break;
        case 429:
          toast.warning("Too Many Requests", { description: "Please slow down and try again in a moment." });
          break;
        case 500:
          toast.error("Something Went Wrong", { description: "Our servers are experiencing issues. Please try again." });
          break;
        default:
          if (status !== 401) {
            toast.error("Network Error", { description: "Unable to complete request." });
          }
      }
    } else if (error.request) {
      toast.error("Network Error", { description: "Please check your internet connection." });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
