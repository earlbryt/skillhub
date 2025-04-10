
import { supabase } from '@/lib/supabase';
import { generateChatResponse } from './groqService';
import { Workshop, Registration, RegistrationData } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';

// Fetch real-time workshop data from the database
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

// Format workshop data for the AI assistant
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

// Register a user for a workshop
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
    // Find the workshop by title
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
      return { success: false, message: 'Workshop not found. Please check the workshop title and try again.' };
    }

    const workshop = workshops[0];

    // Check if the user is already registered for this workshop
    if (userId) {
      const { data: existingRegistrations, error: registrationCheckError } = await supabase
        .from('registrations')
        .select('*')
        .eq('workshop_id', workshop.id)
        .eq('user_id', userId);

      if (registrationCheckError) {
        console.error('Error checking existing registration:', registrationCheckError);
      } else if (existingRegistrations && existingRegistrations.length > 0) {
        return { success: false, message: 'You are already registered for this workshop.' };
      }
    }

    // Check if the workshop is full
    const { count, error: countError } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('workshop_id', workshop.id);

    if (countError) {
      console.error('Error counting registrations:', countError);
      return { success: false, message: 'Error checking workshop capacity.' };
    }

    if (count && count >= workshop.capacity) {
      return { success: false, message: 'This workshop is already full.' };
    }

    // Register the user for the workshop
    const registrationData: RegistrationData = {
      workshop_id: workshop.id,
      first_name: userInfo.firstName,
      last_name: userInfo.lastName,
      email: userInfo.email,
      phone: userInfo.phone || null,
      user_id: userId
    };

    const { error: registrationError } = await supabase
      .from('registrations')
      .insert([{
        ...registrationData,
        status: 'confirmed'
      }]);

    if (registrationError) {
      console.error('Error registering for workshop:', registrationError);
      return { success: false, message: 'Error registering for the workshop.' };
    }

    return { 
      success: true, 
      message: `Registration successful for ${workshop.title}!`,
      workshopId: workshop.id
    };
  } catch (error) {
    console.error('Error in registerForWorkshopViaAI:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
};

// Get chat history for a user
export const getChatHistory = async (userId: string | null, sessionId: string): Promise<{role: string, content: string}[]> => {
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
      role: item.role,
      content: item.message
    }));
  } catch (error) {
    console.error('Error in getChatHistory:', error);
    return [];
  }
};

// Save chat message to history
export const saveChatMessage = async (
  userId: string | null, 
  sessionId: string,
  role: 'user' | 'assistant',
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

// Generate system prompt with real-time workshop data
export const generateSystemPromptWithRealTimeData = async (
  userId: string | null = null
): Promise<string> => {
  try {
    // Get real-time workshop data
    const workshops = await fetchWorkshopsFromDatabase();
    const workshopData = formatWorkshopDataForAI(workshops);
    
    // Get user profile if logged in
    let userGreeting = "I don't have any information about you yet.";
    
    if (userId) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (!error && profile) {
        userGreeting = `I see you're ${profile.full_name || 'a registered user'}. How can I assist you today?`;
      }
    }

    return `You are a helpful assistant for Workshop Hub, a platform where students can sign up for educational workshops. 
Your name is WorkshopBot.

${userGreeting}

This is data about the current workshops available to sign up for:

${workshopData}

You can help students with but not limited to:
1. Finding workshops based on their interests
2. Explaining the registration process
3. Providing information about upcoming workshops
4. Answering questions about workshop content and prerequisites
5. Suggesting workshops based on a student's academic interests
6. Helping users register for workshops directly through our chat

When helping users register for workshops:
1. If they express interest in a specific workshop, ask if they'd like to register for it
2. If they want to register, collect their first name, last name, and email
3. Confirm their registration details before submitting
4. Let them know the registration was successful and what to expect next

Be friendly, concise, and helpful. If you don't know the answer to a specific question about a particular workshop's details that isn't included in the data above, politely ask the user to check the workshop page or contact the workshop organizer directly.

Current date: ${new Date().toLocaleDateString()}

REGISTRATION PROCESS:
1. Express interest in registering for a specific workshop
2. Provide your personal details (name, email)
3. Confirm your registration
4. For paid workshops, you'll receive payment instructions separately

When users want to register for a workshop, try to collect all required information in a conversational way.`;
  } catch (error) {
    console.error('Error generating system prompt with real-time data:', error);
    
    // Return fallback system prompt
    return `You are a helpful assistant for Workshop Hub, a platform where students can sign up for educational workshops.
Your name is WorkshopBot.

I apologize, but I'm having trouble accessing the latest workshop information. 
I can still help answer general questions about Workshop Hub and the registration process.`;
  }
};

// Extract registration intent from conversation
export const extractRegistrationIntent = (
  messages: {role: string, content: string}[]
): {
  intent: boolean;
  workshopTitle?: string;
  userInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
} => {
  // This is a simple implementation - in a real app, you might want to use AI for this
  const userMessages = messages
    .filter(msg => msg.role === 'user')
    .map(msg => msg.content.toLowerCase());
  
  // Check for registration intent
  const registrationPhrases = ['register', 'sign up', 'join', 'enroll'];
  const hasRegistrationIntent = userMessages.some(msg => 
    registrationPhrases.some(phrase => msg.includes(phrase))
  );
  
  if (!hasRegistrationIntent) {
    return { intent: false };
  }
  
  // Extract workshop title (very simple approach)
  let workshopTitle;
  for (const msg of userMessages) {
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
  
  // Extract user info (very simple approach)
  const userInfo: any = {};
  
  // This is a very simplified example - in reality, you'd want to use NLP or other techniques
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
  
  return {
    intent: true,
    workshopTitle,
    userInfo: Object.keys(userInfo).length ? userInfo : undefined
  };
};

