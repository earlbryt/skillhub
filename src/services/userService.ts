import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/supabase';

// Get user profile by user ID
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error(`Error fetching profile for user with ID ${userId}:`, error);
    return null;
  }

  return data;
};

// Create or update user profile
export const upsertUserProfile = async (profile: Partial<UserProfile> & { user_id: string }): Promise<UserProfile> => {
  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', profile.user_id)
    .single();

  const now = new Date().toISOString();
  
  if (existingProfile) {
    // Update existing profile
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...profile, updated_at: now })
      .eq('user_id', profile.user_id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating profile for user with ID ${profile.user_id}:`, error);
      throw error;
    }

    return data;
  } else {
    // Create new profile
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ ...profile, created_at: now, updated_at: now }])
      .select()
      .single();

    if (error) {
      console.error(`Error creating profile for user with ID ${profile.user_id}:`, error);
      throw error;
    }

    return data;
  }
};

// Get all users (admin only)
export const getAllUsers = async (): Promise<UserProfile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }

  return data || [];
};

// Check if a user is an admin
export const isUserAdmin = async (userId: string): Promise<boolean> => {
  if (!userId) return false;
  
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  if (error) {
    console.error(`Error checking admin status for user ${userId}:`, error);
    return false;
  }
  
  return !!data;
};

// Add a user as admin (admin only)
export const addAdminUser = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('admin_users')
    .insert([{ 
      user_id: userId,
      created_at: new Date().toISOString()
    }]);
    
  if (error) {
    console.error(`Error adding admin user ${userId}:`, error);
    throw error;
  }
};

// Remove a user from admin (admin only)
export const removeAdminUser = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('admin_users')
    .delete()
    .eq('user_id', userId);
    
  if (error) {
    console.error(`Error removing admin user ${userId}:`, error);
    throw error;
  }
};

// Update user role (admin only)
export const updateUserRole = async (userId: string, role: string): Promise<void> => {
  const { error } = await supabase
    .from('profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (error) {
    console.error(`Error updating role for user with ID ${userId}:`, error);
    throw error;
  }
}; 