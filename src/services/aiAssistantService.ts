import { supabase } from '@/lib/supabase';
import { generateChatResponse } from './groqService';
import { Workshop, Registration } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';

export interface RegistrationData {
  workshop_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  user_id: string | null;
}

export const fetchWorkshopsFromDatabase = async (): Promise<Workshop[]> => {
  const { data, error } = await supabase
    .from('workshops')
    .select('*')
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching workshops from database:', error);
    throw error;
  }

  return data || [];
};

export const formatWorkshopDataForAI = (workshops: Workshop[]): string => {
  if (!workshops || workshops.length === 0) {
    return "No workshops are currently available.";
  }

  const formattedWorkshops = workshops.map(workshop => {
    const startDate = new Date(workshop.start_date);
    const endDate = new Date(workshop.end_date);

    return `
Workshop: ${workshop.title}
Description: ${workshop.description}
Date: ${startDate.toLocaleDateString()}
Time: ${startDate.toLocaleTimeString()} - ${endDate.toLocaleTimeString()}
Location: ${workshop.location}
Capacity: ${workshop.capacity} attendees
Price: ${workshop.price ? `$${workshop.price}` : 'Free'}
Instructor: ${workshop.instructor || 'TBA'}
`;
  }).join('\n---\n');

  return formattedWorkshops;
};

export const getUserDataForAI = async (userId: string | null): Promise<string> => {
  if (!userId) {
    return "You are not logged in. I don't have any personal information about you.";
  }

  try {
    const { data: registrations, error: registrationsError } = await supabase
      .from('registrations')
      .select(`
        *,
        workshop:workshops(*)
      `)
      .eq('user_id', userId);

    if (registrationsError) {
      console.error('Error fetching user registrations:', registrationsError);
      return "I'm having trouble retrieving your workshop registrations at the moment.";
    }

    let userData = "";
    
    if (registrations && registrations.length > 0) {
      const firstRegistration = registrations[0];
      userData += `
User Information:
Name: ${firstRegistration.first_name} ${firstRegistration.last_name}
Email: ${firstRegistration.email}
Phone: ${firstRegistration.phone || 'No phone provided'}
`;
      
      registrations.forEach((reg, index) => {
        if (reg.workshop) {
          const workshop = reg.workshop;
          const startDate = new Date(workshop.start_date);
          userData += `
${index + 1}. ${workshop.title}
   Date: ${startDate.toLocaleDateString()}
   Location: ${workshop.location}
   Status: ${reg.status}
`;
        }
      });
    } else {
      const { data: auth } = await supabase.auth.getUser();
      if (auth && auth.user) {
        userData += `
User Information:
Email: ${auth.user.email || 'No email provided'}
`;
      }
      
      userData += "\nNo registered workshops found.";
    }

    return userData;
  } catch (error) {
    console.error('Error getting user data for AI:', error);
    return "I'm having trouble retrieving your personal information at the moment.";
  }
};

export const isUserRegisteredForWorkshop = async (
  userId: string | null,
  workshopTitle: string
): Promise<boolean> => {
  if (!userId) return false;

  try {
    const { data: workshops, error: workshopError } = await supabase
      .from('workshops')
      .select('id')
      .ilike('title', `%${workshopTitle}%`)
      .limit(1);

    if (workshopError || !workshops || workshops.length === 0) {
      console.log(`Workshop not found with title: ${workshopTitle}`);
      return false;
    }

    const workshopId = workshops[0].id;

    const { data, error: registrationError } = await supabase
      .from('registrations')
      .select('*')
      .eq('workshop_id', workshopId)
      .eq('user_id', userId)
      .maybeSingle();

    if (registrationError) {
      console.error('Error checking workshop registration:', registrationError);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in isUserRegisteredForWorkshop:', error);
    return false;
  }
};

export const registerForWorkshopViaAI = async (
  workshopTitle: string,
  userId: string | null,
  userInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }
): Promise<{ success: boolean; message: string; workshopId?: string }> => {
  try {
    console.log(`Starting registration process for workshop: ${workshopTitle}, user: ${userId || 'guest'}`);
    
    const { data: workshops, error: workshopError } = await supabase
      .from('workshops')
      .select('*')
      .ilike('title', `%${workshopTitle}%`)
      .limit(1);

    if (workshopError) {
      console.error('Error finding workshop:', workshopError);
      return { success: false, message: 'Error finding the workshop.' };
    }

    if (!workshops || workshops.length === 0) {
      console.log(`No workshop found matching title: ${workshopTitle}`);
      return { 
        success: false, 
        message: 'Workshop not found. Please check the workshop title and try again.' 
      };
    }

    const workshop = workshops[0];
    console.log(`Found workshop: ${workshop.title} (${workshop.id})`);

    if (userId) {
      console.log(`Checking if user ${userId} is already registered for workshop ${workshop.id}`);
      const { data: existingRegistrations, error: registrationCheckError } = await supabase
        .from('registrations')
        .select('*')
        .eq('workshop_id', workshop.id)
        .eq('user_id', userId);

      if (registrationCheckError) {
        console.error('Error checking existing registrations:', registrationCheckError);
        return { success: false, message: 'Error checking if you are already registered.' };
      }

      if (existingRegistrations && existingRegistrations.length > 0) {
        console.log(`User ${userId} is already registered for workshop ${workshop.id}`);
        return { 
          success: false, 
          message: `You are already registered for "${workshop.title}".`
        };
      }
    }

    const { count, error: countError } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('workshop_id', workshop.id);

    if (countError) {
      console.error('Error counting registrations:', countError);
      return { success: false, message: 'Error checking workshop capacity.' };
    }

    if (count !== null && count >= workshop.capacity) {
      console.log(`Workshop ${workshop.id} is full (capacity: ${workshop.capacity})`);
      return { success: false, message: 'This workshop is already full.' };
    }

    const registrationData: RegistrationData = {
      workshop_id: workshop.id,
      first_name: userInfo.firstName,
      last_name: userInfo.lastName,
      email: userInfo.email,
      phone: userInfo.phone || null,
      user_id: userId
    };

    console.log("Registering user with data:", registrationData);

    const { data: registration, error: registrationError } = await supabase
      .from('registrations')
      .insert([{
        ...registrationData,
        status: 'confirmed'
      }])
      .select()
      .single();

    if (registrationError) {
      console.error('Error registering for workshop:', registrationError);
      return { success: false, message: 'Error registering for the workshop: ' + registrationError.message };
    }

    if (!registration) {
      console.error('No registration data returned from database');
      return { success: false, message: 'Error registering for the workshop: No data returned' };
    }

    console.log("Registration successful:", registration);

    try {
      const startDate = new Date(workshop.start_date);
      const endDate = new Date(workshop.end_date);
      
      const emailData = {
        to: userInfo.email,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        workshopTitle: workshop.title,
        workshopDate: workshop.start_date,
        workshopTime: `${startDate.toLocaleTimeString()} - ${endDate.toLocaleTimeString()}`,
        workshopLocation: workshop.location,
        workshopDescription: workshop.description
      };
      
      console.log("Sending confirmation email with data:", emailData);
      
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
      
      if (!response.ok) {
        console.error('Email sending failed with status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      } else {
        const result = await response.json();
        console.log("Email sending result:", result);
        
        if (!result.success) {
          console.error('Email sending failed:', result.error);
        }
      }
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Continue anyway, the registration was successful
    }

    return { 
      success: true, 
      message: `Registration successful for ${workshop.title}! A confirmation email has been sent to ${userInfo.email}.`,
      workshopId: workshop.id
    };
  } catch (error) {
    console.error('Error in registerForWorkshopViaAI:', error);
    return { success: false, message: 'An unexpected error occurred: ' + (error as Error).message };
  }
};

export const deregisterFromWorkshopViaAI = async (
  workshopTitle: string,
  userId: string
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!userId) {
      return { 
        success: false, 
        message: 'You need to be logged in to deregister from a workshop.' 
      };
    }
    
    // Find workshop by title
    const { data: workshops, error: workshopError } = await supabase
      .from('workshops')
      .select('*')
      .ilike('title', `%${workshopTitle}%`)
      .limit(1);

    if (workshopError) {
      console.error('Error finding workshop:', workshopError);
      return { success: false, message: 'Error finding the workshop.' };
    }

    if (!workshops || workshops.length === 0) {
      return { 
        success: false, 
        message: 'Workshop not found. Please check the workshop title and try again.' 
      };
    }

    const workshop = workshops[0];
    
    // Check if user is registered for this workshop
    const { data: registrations, error: registrationCheckError } = await supabase
      .from('registrations')
      .select('*')
      .eq('workshop_id', workshop.id)
      .eq('user_id', userId);

    if (registrationCheckError) {
      console.error('Error checking registrations:', registrationCheckError);
      return { success: false, message: 'Error checking your workshop registrations.' };
    }

    if (!registrations || registrations.length === 0) {
      return { 
        success: false, 
        message: `You are not registered for the "${workshop.title}" workshop.` 
      };
    }

    // Deregister user from workshop
    const { error: deregisterError } = await supabase
      .from('registrations')
      .delete()
      .eq('workshop_id', workshop.id)
      .eq('user_id', userId);

    if (deregisterError) {
      console.error('Error deregistering from workshop:', deregisterError);
      return { success: false, message: 'Error deregistering from the workshop.' };
    }

    return { 
      success: true, 
      message: `You have been successfully deregistered from the "${workshop.title}" workshop.` 
    };
  } catch (error) {
    console.error('Error in deregisterFromWorkshopViaAI:', error);
    return { success: false, message: 'An unexpected error occurred: ' + (error as Error).message };
  }
};

export const getChatHistory = async (userId: string | null, sessionId: string): Promise<{role: 'user' | 'assistant' | 'system', content: string}[]> => {
  if (!userId) return [];

  try {
    const { data, error } = await supabase
      .from('ai_chat_history')
      .select('*')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching chat history:', error);
      return [];
    }

    return data.map(item => ({
      role: item.role as 'user' | 'assistant' | 'system',
      content: item.message
    }));
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    return [];
  }
};

export const saveChatMessage = async (
  userId: string | null, 
  sessionId: string,
  role: 'user' | 'assistant' | 'system',
  message: string
): Promise<boolean> => {
  if (!userId) return false;

  try {
    const { error } = await supabase
      .from('ai_chat_history')
      .insert([
        {
          user_id: userId,
          session_id: sessionId,
          role: role,
          message: message
        }
      ]);

    if (error) {
      console.error('Error saving chat message:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveChatMessage:', error);
    return false;
  }
};

export const generateSystemPromptWithRealTimeData = async (
  userId: string | null = null
): Promise<string> => {
  try {
    const workshops = await fetchWorkshopsFromDatabase();
    const workshopData = formatWorkshopDataForAI(workshops);
    
    let userGreeting = "I don't have any information about you yet.";
    let userData = "";
    
    if (userId) {
      userData = await getUserDataForAI(userId);
      userGreeting = `I see you're logged in. How can I assist you today?`;
    }

    return `You are a helpful assistant for Workshop Hub, a platform where students can sign up for educational workshops. 
Your name is WorkshopBot.

${userGreeting}

${userData}

This is data about the current workshops available to sign up for:

${workshopData}

You can help students with but not limited to:
1. Finding workshops based on their interests
2. Explaining the registration process
3. Providing information about upcoming workshops
4. Answering questions about workshop content and prerequisites
5. Suggesting workshops based on a student's academic interests
6. Helping users register for workshops directly through our chat
7. Providing information about the user's registered workshops when asked

When helping users register for workshops:
1. If they express interest in a specific workshop, check if they're already registered
2. For logged-in users, use their stored information (name, email) for registration
3. For non-logged-in users, collect their first name, last name, and email
4. Confirm their registration details before submitting
5. Let them know the registration was successful and what to expect next

Be friendly, concise, and helpful. If you don't know the answer to a specific question about a particular workshop's details that isn't included in the data above, politely ask the user to check the workshop page or contact the workshop organizer directly.

Current date: ${new Date().toLocaleDateString()}

REGISTRATION PROCESS:
1. Express interest in registering for a specific workshop
2. For non-logged-in users, provide personal details (name, email)
3. Confirm your registration
4. For paid workshops, you'll receive payment instructions separately

When users want to register for a workshop, try to collect all required information in a conversational way.`;
  } catch (error) {
    console.error('Error generating system prompt with real-time data:', error);
    
    return `You are a helpful assistant for Workshop Hub, a platform where students can sign up for educational workshops.
Your name is WorkshopBot.

I apologize, but I'm having trouble accessing the latest workshop information. 
I can still help answer general questions about Workshop Hub and the registration process.`;
  }
};

export const extractRegistrationIntent = (
  messages: {role: string, content: string}[]
): {
  intent: boolean;
  deregister?: boolean;
  workshopTitle?: string;
  userInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
} => {
  const userMessages = messages
    .filter(msg => msg.role === 'user')
    .map(msg => msg.content.toLowerCase());
  
  const registrationPhrases = ['register', 'sign up', 'join', 'enroll'];
  const deregistrationPhrases = ['deregister', 'unregister', 'cancel', 'remove me from'];
  
  const hasRegistrationIntent = userMessages.some(msg => 
    registrationPhrases.some(phrase => msg.includes(phrase))
  );
  
  const hasDeregistrationIntent = userMessages.some(msg => 
    deregistrationPhrases.some(phrase => msg.includes(phrase))
  );
  
  if (!hasRegistrationIntent && !hasDeregistrationIntent) {
    return { intent: false };
  }
  
  let workshopTitle;
  for (const msg of userMessages) {
    if (hasRegistrationIntent) {
      const forIndex = msg.indexOf(' for ');
      const toIndex = msg.indexOf(' to the ');
      
      if (forIndex > -1) {
        workshopTitle = msg.substring(forIndex + 5).split(/[.,!?]/)[0].trim();
        break;
      } else if (toIndex > -1) {
        workshopTitle = msg.substring(toIndex + 8).split(/[.,!?]/)[0].trim();
        break;
      }
    }
    
    if (hasDeregistrationIntent) {
      const fromIndex = msg.indexOf(' from ');
      const cancelIndex = msg.indexOf(' cancel ');
      
      if (fromIndex > -1) {
        workshopTitle = msg.substring(fromIndex + 6).split(/[.,!?]/)[0].trim();
        break;
      } else if (cancelIndex > -1) {
        workshopTitle = msg.substring(cancelIndex + 8).split(/[.,!?]/)[0].trim();
        break;
      }
    }
  }
  
  const userInfo: any = {};
  
  if (hasRegistrationIntent && !hasDeregistrationIntent) {
    for (const msg of userMessages) {
      if (msg.includes('name is')) {
        const nameparts = msg.split('name is')[1].trim().split(' ');
        if (nameparts.length > 0) userInfo.firstName = nameparts[0];
        if (nameparts.length > 1) userInfo.lastName = nameparts[1];
      }
      
      if (msg.includes('email is') || msg.includes('email:')) {
        const emailPart = msg.includes('email is') 
          ? msg.split('email is')[1]
          : msg.split('email:')[1];
        const emailMatch = emailPart?.match(/\S+@\S+\.\S+/);
        if (emailMatch) userInfo.email = emailMatch[0];
      }
    }
  }
  
  return {
    intent: true,
    deregister: hasDeregistrationIntent,
    workshopTitle,
    userInfo: Object.keys(userInfo).length ? userInfo : undefined
  };
};
