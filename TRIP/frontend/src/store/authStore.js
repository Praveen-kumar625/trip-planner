import { create } from 'zustand';
import { authService } from '../services/api/auth.service';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: true, // starts true until firebase responds
  isInitialized: false,

  initAuthListener: () => {
    if (get().isInitialized) return;
    set({ isInitialized: true });
    
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user profile from firestore
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          const isGuest = firebaseUser.isAnonymous;
          
          if (userSnap.exists()) {
            set({ 
              user: userSnap.data(), 
              isAuthenticated: true, 
              isGuest,
              isLoading: false 
            });
          } else {
            // Fallback if sync failed earlier
            const syncedUser = await authService.syncUserToFirestore(firebaseUser, isGuest);
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
        set({ user: null, isAuthenticated: false, isGuest: false, isLoading: false });
      }
    });
  },

  loginWithEmail: async (email, password) => {
    set({ isLoading: true });
    try {
      await authService.loginWithEmail(email, password);
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  signupWithEmail: async (email, password, displayName) => {
    set({ isLoading: true });
    try {
      await authService.signupWithEmail(email, password, displayName);
    } catch (e) {
      set({ isLoading: false });
      throw e;
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true });
    try {
      await authService.loginWithGoogle();
    } catch (e) {
      set({ isLoading: false });
      throw e;
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

  resetPassword: async (email) => {
    await authService.resetPassword(email);
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
