import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.unmock('axios'); // Remove global mock
import apiClient from '@/services/api/apiClient';
import { supabase } from '@/config/supabase';

vi.mock('../../config/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn()
    }
  }
}));

describe('apiClient', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
  });

  it('should be created with base URL', () => {
    expect(apiClient.defaults.baseURL).toBeDefined();
  });

  it('should inject token into headers if available', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { access_token: 'test-jwt-token' } }
    });
    
    const config = { headers: {} };
    
    const resultConfig = await apiClient.interceptors.request.handlers[0].fulfilled(config);
    
    expect(resultConfig.headers.Authorization).toBe('Bearer test-jwt-token');
  });

  it('should not inject token if not available', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    
    const config = { headers: {} };
    const resultConfig = await apiClient.interceptors.request.handlers[0].fulfilled(config);
    
    expect(resultConfig.headers.Authorization).toBeUndefined();
  });
});
