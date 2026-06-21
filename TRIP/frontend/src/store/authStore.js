import { create } from 'zustand';
import { authService } from '@/services/api/auth.service';
import { supabase } from '@/config/supabase';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: true, // starts true until supabase responds
  isInitialized: false,

  initAuthListener: () => {
    if (get().isInitialized) return;
    set({ isInitialized: true });
    
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      get().handleAuthChange(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      get().handleAuthChange(session);
    });
  },

  handleAuthChange: async (session) => {
    if (session?.user) {
      const supabaseUser = session.user;
      try {
        const { data: userSnap } = await supabase
          .from('users')
          .select('*')
          .eq('uid', supabaseUser.id)
          .maybeSingle();

        const isGuest = supabaseUser.is_anonymous;
        
        if (userSnap) {
          set({ 
            user: userSnap, 
            isAuthenticated: true, 
            isGuest,
            isLoading: false 
          });
        } else {
          const syncedUser = await authService.syncUserToFirestore(supabaseUser, isGuest);
          set({ 
            user: syncedUser, 
            isAuthenticated: true, 
            isGuest,
            isLoading: false 
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        set({ user: null, isAuthenticated: false, isGuest: false, isLoading: false });
      }
    } else {
      // If no session, auto-login as guest
      try {
        const syncedUser = await authService.loginAsGuest();
        set({ 
          user: syncedUser, 
          isAuthenticated: true, 
          isGuest: true, 
          isLoading: false 
        });
      } catch (error) {
        console.error("Error signing in as guest:", error);
        set({ user: null, isAuthenticated: false, isGuest: false, isLoading: false });
      }
    }
  },

  loginAsGuest: async () => {
    set({ isLoading: true });
    try {
      await authService.loginAsGuest();
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } catch (e) {
      console.warn('Logout failed', e);
    } finally {
      set({ user: null, isAuthenticated: false, isGuest: false, isLoading: false });
    }
  }
}));
