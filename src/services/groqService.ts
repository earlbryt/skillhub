import { toast } from '@/hooks/use-toast';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const generateChatResponse = async (messages: ChatMessage[]): Promise<string> => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to get response from Groq');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating chat response:', error);
    toast({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to get response from AI',
      variant: 'destructive'
    });
    return 'Sorry, I encountered an error while processing your request. Please try again later.';
  }
}; 