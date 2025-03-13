
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

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
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any | null }>;
  signInWithGoogle: () => Promise<{ error: any | null }>;
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
  const { toast } = useToast();

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
      // Since we don't have a profiles table yet, we'll just create a placeholder profile
      // We'll implement proper profiles later
      setProfile({
        id: userId,
        first_name: user?.user_metadata?.first_name || null,
        last_name: user?.user_metadata?.last_name || null,
        avatar_url: user?.user_metadata?.avatar_url || null,
        updated_at: null,
        username: user?.email || null,
        website: null,
      });
      setLoading(false);
    } catch (error) {
      console.error('Error in profile fetch:', error);
      setProfile(null);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: any | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      toast({
        title: "Signed in successfully",
        description: "Welcome back!",
      });
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string): Promise<{ error: any | null }> => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
      
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      toast({
        title: "Sign up successful",
        description: "Please check your email to confirm your account.",
      });
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signInWithGoogle = async (): Promise<{ error: any | null }> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) {
        toast({
          title: "Google sign in failed",
          description: error.message,
          variant: "destructive"
        });
        return { error };
      }
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Google sign in failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      toast({
        title: "Sign out failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  const updateProfile = async (profileData: Partial<Profile>): Promise<void> => {
    try {
      setLoading(true);
      
      // Update user metadata instead of a profiles table for now
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          avatar_url: profileData.avatar_url,
        }
      });

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Profile update failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        // Optimistically update the profile in the context
        setProfile((prevProfile) => ({
          ...prevProfile!,
          ...profileData,
        } as Profile));
        
        toast({
          title: "Profile updated successfully",
        });
      }
    } catch (error: any) {
      console.error('Error updating profile:', error.message);
      toast({
        title: "Profile update failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
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
    signUp,
    signInWithGoogle,
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
