import { getWorkshops } from './workshopService';
import { Workshop } from '@/types/supabase';
import { format } from 'date-fns';

// Format workshop data for the chatbot
export const formatWorkshopData = (workshop: Workshop): string => {
  return `
Workshop ID: ${workshop.id}
Title: ${workshop.title}
Description: ${workshop.description}
Date: ${format(new Date(workshop.start_date), 'MMMM d, yyyy')}
Time: ${format(new Date(workshop.start_date), 'h:mm a')} - ${format(new Date(workshop.end_date), 'h:mm a')}
Location: ${workshop.location}
Capacity: ${workshop.capacity} attendees
Price: ${workshop.price > 0 ? `GH₵${workshop.price.toFixed(2)}` : 'Free'}
Instructor: ${workshop.instructor || 'TBA'}
`;
};

// Get all workshops data formatted for the chatbot
export const getWorkshopsForChatbot = async (): Promise<string> => {
  try {
    const workshops = await getWorkshops();
    
    if (!workshops || workshops.length === 0) {
      return "No workshops are currently available.";
    }
    
    // Sort workshops by date
    const sortedWorkshops = [...workshops].sort((a, b) => 
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );
    
    // Format each workshop
    const workshopsData = sortedWorkshops.map(formatWorkshopData).join('\n---\n');
    
    return `Here is information about our current workshops:\n\n${workshopsData}`;
  } catch (error) {
    console.error('Error fetching workshops for chatbot:', error);
    return "I'm having trouble accessing workshop information at the moment.";
  }
};

// Generate a system prompt with workshop data
export const generateSystemPromptWithWorkshopData = async (): Promise<string> => {
  const workshopsData = await getWorkshopsForChatbot();
  
  return `You are a helpful assistant for Workshop Hub, a platform where students can sign up for educational workshops. 
Your name is WorkshopBot.

You can help users with:
- Finding workshops based on their interests
- Explaining the registration process
- Providing information about upcoming workshops
- Answering questions about workshop content and prerequisites
- Suggesting workshops based on a student's academic interests

Be friendly, concise, and helpful. If you don't know the answer to a specific question about a particular workshop's details that isn't included in the data below, politely ask the user to check the workshop page or contact the workshop organizer directly.

Current date: ${new Date().toLocaleDateString()}

WORKSHOP INFORMATION:
${workshopsData}

REGISTRATION PROCESS:
1. Users need to create an account or log in to register for workshops
2. On the workshop details page, click the "Register" button
3. Fill out any required information and submit the registration
4. For paid workshops, complete the payment process
5. Users will receive a confirmation email after successful registration

When answering questions about specific workshops, refer to the workshop information provided above. If asked about a workshop not in the list, explain that you only have information about current workshops and suggest they check the website for the most up-to-date information.`;
}; 