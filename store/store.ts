import { User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { supabase } from '~/utils/supabase';

interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}



export const useStore = create<AuthState>((set) => ({
  // Auth state
  user: null,
  session: null,
  loading: true,

  // Auth methods
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({ user: data.user, session: data.session });
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      set({ user: data.user, session: data.session });
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, session: null });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

}));

// Initialize auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  useStore.setState({ session, user: session?.user ?? null, loading: false });
});

// Setup auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  useStore.setState({ session, user: session?.user ?? null });
});

/*
const { signIn, signUp, signOut, user } = useStore();

// Sign in
await signIn('user@example.com', 'password');

// Sign up
await signUp('newuser@example.com', 'password');

// Sign out
await signOut();

// Check if user is authenticated
if (user) {
  console.log('User is logged in:', user.email);
} */