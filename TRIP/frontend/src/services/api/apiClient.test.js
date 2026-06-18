import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.unmock('axios'); // Remove global mock
import apiClient from './apiClient';
import { auth } from '../../config/firebase';

vi.mock('../../config/firebase', () => ({
  auth: {
    currentUser: null
  }
}));

describe('apiClient', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    auth.currentUser = null;
  });

  it('should be created with base URL', () => {
    expect(apiClient.defaults.baseURL).toBeDefined();
  });

  it('should inject token into headers if available', async () => {
    auth.currentUser = {
      getIdToken: vi.fn().mockResolvedValue('test-jwt-token')
    };
    
    // Create a mock config
    const config = { headers: {} };
    
    // Run the request interceptor manually for testing
    const resultConfig = await apiClient.interceptors.request.handlers[0].fulfilled(config);
    
    expect(resultConfig.headers.Authorization).toBe('Bearer test-jwt-token');
  });

  it('should not inject token if not available', async () => {
    auth.currentUser = null;
    
    const config = { headers: {} };
    const resultConfig = await apiClient.interceptors.request.handlers[0].fulfilled(config);
    
    expect(resultConfig.headers.Authorization).toBeUndefined();
  });
});
