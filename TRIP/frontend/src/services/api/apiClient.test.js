import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from './apiClient';
import { useAuthStore } from '../../store/authStore';

vi.mock('../../store/authStore', () => ({
  useAuthStore: {
    getState: vi.fn()
  }
}));

describe('apiClient', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should be created with base URL', () => {
    expect(apiClient.defaults.baseURL).toBeDefined();
  });

  it('should inject token into headers if available', async () => {
    useAuthStore.getState.mockReturnValue({ token: 'test-jwt-token' });
    
    // Create a mock config
    const config = { headers: {} };
    
    // Run the request interceptor manually for testing
    const resultConfig = await apiClient.interceptors.request.handlers[0].fulfilled(config);
    
    expect(resultConfig.headers.Authorization).toBe('Bearer test-jwt-token');
  });

  it('should not inject token if not available', async () => {
    useAuthStore.getState.mockReturnValue({ token: null });
    
    const config = { headers: {} };
    const resultConfig = await apiClient.interceptors.request.handlers[0].fulfilled(config);
    
    expect(resultConfig.headers.Authorization).toBeUndefined();
  });
});
