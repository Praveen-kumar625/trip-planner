import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './authStore';

// Mock the API service
vi.mock('../services/api/auth.service', () => ({
  authService: {
    login: vi.fn().mockResolvedValue({ data: { token: 'fake-token', user: { id: 1, name: 'Test User' } } }),
    logout: vi.fn().mockResolvedValue({}),
  }
}));

describe('authStore', () => {
  beforeEach(() => {
    // Reset state before each test
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
  });

  it('should initialize with default state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should set auth data successfully', () => {
    const { setAuth } = useAuthStore.getState();
    
    setAuth({ id: 1, name: 'Test User' }, 'fake-token');
    
    const state = useAuthStore.getState();
    expect(state.user).toEqual({ id: 1, name: 'Test User' });
    expect(state.token).toBe('fake-token');
    expect(state.isAuthenticated).toBe(true);
  });

  it('should clear auth data on logout', () => {
    const { setAuth, logout } = useAuthStore.getState();
    
    setAuth({ id: 1, name: 'Test User' }, 'fake-token');
    logout();
    
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
