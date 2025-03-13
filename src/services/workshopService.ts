
import { supabase } from '@/integrations/supabase/client';
import { Workshop, Registration } from '@/types/supabase';

export const getWorkshops = async (): Promise<Workshop[]> => {
  const { data, error } = await supabase
    .from('workshops')
    .select('*')
    .order('start_date', { ascending: true });
    
  if (error) {
    console.error('Error fetching workshops:', error);
    throw error;
  }
  
  return data || [];
};

export const getWorkshopById = async (id: string): Promise<Workshop | null> => {
  const { data, error } = await supabase
    .from('workshops')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching workshop by ID:', error);
    return null;
  }
  
  return data;
};

export const registerForWorkshop = async (registration: Omit<Registration, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<{ success: boolean; error?: any; data?: any }> => {
  const { data, error } = await supabase
    .from('registrations')
    .insert([{
      ...registration,
      status: 'confirmed'
    }])
    .select()
    .single();
    
  if (error) {
    console.error('Error registering for workshop:', error);
    return { success: false, error };
  }
  
  return { success: true, data };
};

export const getRegistrationsForWorkshop = async (workshopId: string): Promise<Registration[]> => {
  const { data, error } = await supabase
    .from('registrations')
    .select('*')
    .eq('workshop_id', workshopId);
    
  if (error) {
    console.error('Error fetching registrations:', error);
    throw error;
  }
  
  return data || [];
};

export const getMyRegistrations = async (userId?: string): Promise<(Registration & { workshop: Workshop })[]> => {
  if (!userId) return [];
  
  const { data, error } = await supabase
    .from('registrations')
    .select(`
      *,
      workshop:workshops(*)
    `)
    .eq('user_id', userId);
    
  if (error) {
    console.error('Error fetching user registrations:', error);
    throw error;
  }
  
  return data || [];
};

export const getWorkshopRegistrationsCount = async (workshopId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('registrations')
    .select('*', { count: 'exact', head: true })
    .eq('workshop_id', workshopId);
    
  if (error) {
    console.error('Error counting registrations:', error);
    return 0;
  }
  
  return count || 0;
};

export const checkUserRegisteredForWorkshop = async (workshopId: string, userId: string): Promise<boolean> => {
  const { count, error } = await supabase
    .from('registrations')
    .select('*', { count: 'exact', head: true })
    .eq('workshop_id', workshopId)
    .eq('user_id', userId);
    
  if (error) {
    console.error('Error checking user registration:', error);
    return false;
  }
  
  return (count || 0) > 0;
};
