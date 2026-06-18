import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuthStore } from './authStore';
import { authService } from '../services/api/auth.service';

vi.mock('../config/firebase', () => ({
  auth: {},
  db: {}
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn()
}));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn()
}));

vi.mock('../services/api/auth.service', () => ({
  authService: {
    loginWithEmail: vi.fn().mockResolvedValue({ uid: '123' }),
    signupWithEmail: vi.fn().mockResolvedValue({ uid: '123' }),
    loginWithGoogle: vi.fn().mockResolvedValue({ uid: '123' }),
    loginAsGuest: vi.fn().mockResolvedValue({ uid: 'guest' }),
    logout: vi.fn().mockResolvedValue({}),
    resetPassword: vi.fn().mockResolvedValue({})
  }
}));

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isAuthenticated: false, isGuest: false, isLoading: false });
    vi.clearAllMocks();
  });



  it('should call loginAsGuest', async () => {
    const { loginAsGuest } = useAuthStore.getState();
    await loginAsGuest();
    expect(authService.loginAsGuest).toHaveBeenCalled();
  });

  it('should clear data on logout', async () => {
    useAuthStore.setState({ user: { uid: '123' }, isAuthenticated: true });
    const { logout } = useAuthStore.getState();
    await logout();
    
    expect(authService.logout).toHaveBeenCalled();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });


});
