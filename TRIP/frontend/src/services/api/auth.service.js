import { supabase } from '@/config/supabase';

export const authService = {
  syncUserToFirestore: async (user, isGuest = false) => {
    if (!user) return null;
    
    const { data: userSnap } = await supabase
      .from('users')
      .select('*')
      .eq('uid', user.id)
      .maybeSingle();

    const userData = {
      uid: user.id,
      email: user.email || '',
      displayName: user.user_metadata?.displayName || (isGuest ? 'Guest User' : ''),
      photoURL: user.user_metadata?.avatar_url || '',
      provider: isGuest ? 'anonymous' : user.app_metadata?.provider || 'password',
      lastLogin: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!userSnap) {
      Object.assign(userData, {
        bio: '',
        country: '',
        language: 'en',
        travelPreferences: [],
        createdAt: new Date().toISOString(),
      });
    }

    const { error } = await supabase
      .from('users')
      .upsert(userData, { onConflict: 'uid' });

    if (error) {
      console.error('Error syncing user to Supabase:', error);
    }
    return { ...userSnap, ...userData };
  },

  loginWithEmail: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    await authService.syncUserToFirestore(data.user);
    return data.user;
  },

  signupWithEmail: async (email, password, displayName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          displayName
        }
      }
    });
    if (error) throw error;
    if (data.user) {
      await authService.syncUserToFirestore(data.user);
    }
    return data.user;
  },

  loginWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw error;
    // Note: With OAuth, the redirect handles the rest. 
    // You may want to sync the user in the redirect callback instead.
    return data;
  },

  loginAsGuest: async () => {
    try {
      if (!import.meta.env.VITE_SUPABASE_URL) {
        throw new Error("Supabase credentials missing in environment. Using mock user.");
      }
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      await authService.syncUserToFirestore(data.user, true);
      return data.user;
    } catch (error) {
      console.warn("Supabase guest login bypassed or failed. Using mock guest user.", error.message || error);
      return {
        id: 'guest_' + Math.random().toString(36).substring(7),
        displayName: 'Guest User',
        email: 'guest@example.com',
        isAnonymous: true
      };
    }
  },

  resetPassword: async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
};
