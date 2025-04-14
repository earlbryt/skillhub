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

export interface RegistrationData {
  workshop_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  user_id: string | null;
}

export const registerForWorkshop = async (registrationData: RegistrationData): Promise<{ success: boolean, error?: any }> => {
  try {
    const now = new Date().toISOString();
    
    // Register the user
    const { error } = await supabase
      .from('registrations')
      .insert([{
        ...registrationData,
        created_at: now,
        updated_at: now,
        status: 'confirmed'
      }]);
      
    if (error) {
      console.error('Error registering for workshop:', error);
      return { success: false, error };
    }
    
    // Get workshop details for the email
    const { data: workshop, error: workshopError } = await supabase
      .from('workshops')
      .select('*')
      .eq('id', registrationData.workshop_id)
      .single();
      
    if (workshopError) {
      console.error('Error fetching workshop details for email:', workshopError);
      // Continue anyway, we still registered the user successfully
    } else {
      // Send confirmation email if we got the workshop details
      try {
        const startDate = new Date(workshop.start_date);
        const endDate = new Date(workshop.end_date);
        
        const emailData = {
          to: registrationData.email,
          firstName: registrationData.first_name,
          lastName: registrationData.last_name,
          workshopTitle: workshop.title,
          workshopDate: workshop.start_date,
          workshopTime: `${startDate.toLocaleTimeString()} - ${endDate.toLocaleTimeString()}`,
          workshopLocation: workshop.location,
          workshopDescription: workshop.description
        };
        
        // Call the email function
        const response = await fetch(
          'https://znohucbxvuitqpparsyb.supabase.co/functions/v1/send-workshop-confirmation',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(emailData),
          }
        );
        
        const result = await response.json();
        if (!result.success) {
          console.error('Email sending failed:', result.error);
        }
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Continue anyway, we still registered the user successfully
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error registering for workshop:', error);
    return { success: false, error };
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

export const deregisterFromWorkshop = async (workshopId: string, userId: string): Promise<{ success: boolean, error?: any }> => {
  try {
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('workshop_id', workshopId)
      .eq('user_id', userId);
      
    if (error) {
      console.error(`Error deregistering from workshop with ID ${workshopId}:`, error);
      return { success: false, error };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error deregistering from workshop:', error);
    return { success: false, error };
  }
};
