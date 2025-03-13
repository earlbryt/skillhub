import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

// Define the Profile type
export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  username: string | null;
  website: string | null;
};

// Define the AuthContext type
type AuthContextType = {
  session: Session | null;
  user: Session['user'] | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<void>;
};

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This is a simplified fix for the profile error
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<Session['user'] | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
    }
    getSession()
  }, [])

  useEffect(() => {
    if (user?.id) {
      loadUserProfile(user.id);
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error loading user profile:', error);
        setProfile(null);
      } else {
        // Fix the type conversion issue by explicitly casting the data
        setProfile(data as unknown as Profile);
      }
    } catch (error) {
      console.error('Error in profile fetch:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert('Check your email for the login link!');
    } catch (error: any) {
      alert(error.error_description || error.message);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
    } catch (error: any) {
      console.error('Error signing out:', error.message);
    }
  };

  const updateProfile = async (profileData: Partial<Profile>): Promise<void> => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user!.id);

      if (error) {
        console.error('Error updating profile:', error);
        alert(error.message);
      } else {
        // Optimistically update the profile in the context
        setProfile((prevProfile) => ({
          ...prevProfile!,
          ...profileData,
        } as Profile));
      }
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    session,
    user,
    profile,
    loading,
    signIn,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
