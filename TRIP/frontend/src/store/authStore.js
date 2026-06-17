import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/api/auth.service';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken, isAuthenticated: !!accessToken }),

      syncUser: async (firebaseToken) => {
        set({ isLoading: true });
        try {
          const res = await authService.syncFirebaseUser(firebaseToken);
          set({
            user: res.data.user,
            accessToken: res.data.token,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false, isAuthenticated: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (e) {
          console.warn('Backend logout failed', e);
        } finally {
          set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
        }
      }
    }),
    {
      name: 'wandersync-auth',
      partialize: (state) => ({ accessToken: state.accessToken, refreshToken: state.refreshToken, user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
);
