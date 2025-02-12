import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false); // Set loading to false after initial session check
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  async function signup(email, password, metadata) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.fullName,
            avatar_url: metadata.avatar_url
          }
        }
      });

      if (error) throw error;

      // Create profile entry
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: metadata.fullName,
              avatar_url: metadata.avatar_url,
              updated_at: new Date().toISOString()
            }
          ]);

        if (profileError) throw profileError;

        // Manually sign in the user after signup
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) throw signInError;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { data: null, error };
    }
  }

  async function login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email before signing in. Check your inbox for the verification link.');
        }
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { data: null, error };
    }
  }

  async function signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { data: null, error };
    }
  }

  async function logout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Clear any local storage items if needed
      localStorage.removeItem('navState')
      
      // Optional: Clear any other auth-related state
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  async function resendVerificationEmail(email) {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error
      return { error: null, message: 'Verification email resent successfully!' }
    } catch (error) {
      console.error('Error resending verification:', error)
      return { error, message: null }
    }
  }

  async function updateProfile({ full_name, avatar_url }) {
    try {
      if (!user) throw new Error('No user')

      // First update the auth metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name,
          avatar_url
        }
      })

      if (metadataError) throw metadataError

      // Then update the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name,
          avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Update local user state to reflect changes
      setUser(prev => ({
        ...prev,
        user_metadata: {
          ...prev.user_metadata,
          full_name,
          avatar_url
        }
      }))

      return { error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { error }
    }
  }

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    signInWithGoogle,
    resendVerificationEmail,
    updateProfile
  };

  // Don't render children until initial loading is complete
  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 