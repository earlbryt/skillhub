import { supabase } from '@/lib/supabase';
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

export const getWorkshopById = async (id: string): Promise<Workshop> => {
  const { data, error } = await supabase
    .from('workshops')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error(`Error fetching workshop with ID ${id}:`, error);
    throw error;
  }
  
  return data;
};

export const createWorkshop = async (workshop: Omit<Workshop, 'id' | 'created_at' | 'updated_at'>): Promise<Workshop> => {
  const { data, error } = await supabase
    .from('workshops')
    .insert([{ ...workshop, created_at: new Date().toISOString() }])
    .select()
    .single();
    
  if (error) {
    console.error('Error creating workshop:', error);
    throw error;
  }
  
  return data;
};

export const updateWorkshop = async (id: string, updates: Partial<Workshop>): Promise<Workshop> => {
  const { data, error } = await supabase
    .from('workshops')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error(`Error updating workshop with ID ${id}:`, error);
    throw error;
  }
  
  return data;
};

export const deleteWorkshop = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('workshops')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error(`Error deleting workshop with ID ${id}:`, error);
    throw error;
  }
};

export const registerForWorkshop = async (workshopId: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('workshop_attendees')
    .insert([
      {
        workshop_id: workshopId,
        user_id: userId,
        registration_date: new Date().toISOString(),
        status: 'registered',
        payment_status: 'pending'
      }
    ]);
    
  if (error) {
    console.error(`Error registering for workshop with ID ${workshopId}:`, error);
    throw error;
  }
};

export const isUserRegistered = async (workshopId: string, userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('workshop_attendees')
    .select('*')
    .eq('workshop_id', workshopId)
    .eq('user_id', userId);
    
  if (error) {
    console.error(`Error checking registration for workshop with ID ${workshopId}:`, error);
    throw error;
  }
  
  return data && data.length > 0;
};

export const getUserWorkshops = async (userId: string): Promise<Workshop[]> => {
  const { data, error } = await supabase
    .from('workshop_attendees')
    .select('workshop_id')
    .eq('user_id', userId);
    
  if (error) {
    console.error(`Error fetching user's workshops:`, error);
    throw error;
  }
  
  if (!data || data.length === 0) {
    return [];
  }
  
  const workshopIds = data.map(item => item.workshop_id);
  
  const { data: workshops, error: workshopsError } = await supabase
    .from('workshops')
    .select('*')
    .in('id', workshopIds)
    .order('start_date', { ascending: true });

  if (workshopsError) {
    console.error(`Error fetching workshops by IDs:`, workshopsError);
    throw workshopsError;
  }
  
  return workshops || [];
};

export const getWorkshopAttendees = async (workshopId: string) => {
  const { data, error } = await supabase
    .from('workshop_attendees')
    .select(`
      *,
      profiles:user_id (*)
    `)
    .eq('workshop_id', workshopId);
    
  if (error) {
    console.error(`Error fetching attendees for workshop with ID ${workshopId}:`, error);
    throw error;
  }
  
  return data || [];
};

export const updateAttendeeStatus = async (attendeeId: string, status: string, paymentStatus?: string) => {
  const updates: any = { status };
  if (paymentStatus) {
    updates.payment_status = paymentStatus;
  }
  
  const { error } = await supabase
    .from('workshop_attendees')
    .update(updates)
    .eq('id', attendeeId);
    
  if (error) {
    console.error(`Error updating attendee status:`, error);
    throw error;
  }
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
