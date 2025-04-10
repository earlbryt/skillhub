import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, ChevronDown, ChevronUp, Loader2, UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { generateChatResponse, ChatMessage } from '@/services/groqService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { 
  getChatHistory, 
  saveChatMessage, 
  generateSystemPromptWithRealTimeData,
  extractRegistrationIntent,
  registerForWorkshopViaAI,
  isUserRegisteredForWorkshop
} from '@/services/aiAssistantService';

const EnhancedChatbotAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');
  const [registrationInProgress, setRegistrationInProgress] = useState(false);
  const [registrationData, setRegistrationData] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    let chatSessionId = localStorage.getItem('workshop_chat_session_id');
    if (!chatSessionId) {
      chatSessionId = uuidv4();
      localStorage.setItem('workshop_chat_session_id', chatSessionId);
    }
    setSessionId(chatSessionId);

    const loadChatHistory = async () => {
      setIsInitializing(true);
      try {
        const prompt = await generateSystemPromptWithRealTimeData(user?.id || null);
        setSystemPrompt(prompt);

        if (user?.id) {
          const history = await getChatHistory(user.id, chatSessionId);
          
          if (history && history.length > 0) {
            setMessages(history as ChatMessage[]);
          } else {
            const welcomeMessage: ChatMessage = { 
              role: 'assistant', 
              content: 'Hi there! 👋 I\'m WorkshopBot, your Workshop Hub assistant. How can I help you today?' 
            };
            
            setMessages([welcomeMessage]);
            
            await saveChatMessage(
              user.id,
              chatSessionId,
              'assistant',
              welcomeMessage.content
            );
          }
        } else {
          setMessages([
            { 
              role: 'assistant', 
              content: 'Hi there! 👋 I\'m WorkshopBot, your Workshop Hub assistant. How can I help you today?' 
            }
          ]);
        }
      } catch (error) {
        console.error('Error initializing chat:', error);
        setMessages([
          { 
            role: 'assistant', 
            content: 'Hi there! 👋 I\'m WorkshopBot, your Workshop Hub assistant. I\'m having trouble connecting to our database, but I\'ll do my best to help you.' 
          }
        ]);
      } finally {
        setIsInitializing(false);
      }
    };

    loadChatHistory();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const minimizeChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    const userMessage: ChatMessage = { role: 'user', content: input };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      if (user?.id) {
        await saveChatMessage(user.id, sessionId, 'user', userMessage.content);
      }
      
      const intentData = extractRegistrationIntent([...messages, userMessage]);
      
      if (intentData.intent && !registrationInProgress) {
        if (intentData.workshopTitle) {
          if (user?.id) {
            const alreadyRegistered = await isUserRegisteredForWorkshop(
              user.id, 
              intentData.workshopTitle
            );
            
            if (alreadyRegistered) {
              const assistantResponse = `You're already registered for the "${intentData.workshopTitle}" workshop. Is there anything else I can help you with?`;
              
              setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
              
              if (user?.id) {
                await saveChatMessage(user.id, sessionId, 'assistant', assistantResponse);
              }
              
              setIsLoading(false);
              return;
            }
          }
          
          setRegistrationInProgress(true);
          setRegistrationData(intentData);
        }
      }
      
      if (
        registrationInProgress && 
        registrationData?.workshopTitle && 
        ((user?.id) || 
          (registrationData?.userInfo?.firstName &&
           registrationData?.userInfo?.lastName &&
           registrationData?.userInfo?.email))
      ) {
        let userInfo = registrationData.userInfo || {};
        
        if (user?.id && (!userInfo.firstName || !userInfo.lastName || !userInfo.email)) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', user.id)
              .single();
            
            if (profile) {
              userInfo.firstName = userInfo.firstName || profile.first_name || profile.full_name?.split(' ')[0];
              userInfo.lastName = userInfo.lastName || profile.last_name || profile.full_name?.split(' ')[1];
              userInfo.email = userInfo.email || profile.email || user.email;
            } else {
              userInfo.email = userInfo.email || user.email;
              
              const { data: prevRegistration } = await supabase
                .from('registrations')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();
              
              if (prevRegistration) {
                userInfo.firstName = userInfo.firstName || prevRegistration.first_name;
                userInfo.lastName = userInfo.lastName || prevRegistration.last_name;
              }
            }
          } catch (error) {
            console.error('Error fetching user profile data:', error);
          }
        }
        
        if (userInfo.firstName && userInfo.lastName && userInfo.email) {
          const registrationResult = await registerForWorkshopViaAI(
            registrationData.workshopTitle,
            user?.id || null,
            userInfo
          );
          
          let assistantResponse = registrationResult.success
            ? `Great! You're now registered for "${registrationData.workshopTitle}". You'll receive a confirmation email shortly with all the details. Is there anything else you'd like help with?`
            : `I'm sorry, I couldn't complete your registration for "${registrationData.workshopTitle}". ${registrationResult.message} Is there anything else I can assist you with?`;
          
          setRegistrationInProgress(false);
          setRegistrationData(null);
          
          setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
          
          if (user?.id) {
            await saveChatMessage(user.id, sessionId, 'assistant', assistantResponse);
          }
          
          setIsLoading(false);
          return;
        }
      }
      
      const response = await generateChatResponse([
        { role: 'system', content: systemPrompt },
        ...messages,
        userMessage
      ]);
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      
      if (user?.id) {
        await saveChatMessage(user.id, sessionId, 'assistant', response);
      }
      
      if (registrationInProgress) {
        const updatedRegData = { ...registrationData };
        const userInput = userMessage.content.toLowerCase();
        
        if (!updatedRegData.userInfo) updatedRegData.userInfo = {};
        
        const emailMatch = userInput.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
        if (emailMatch && !updatedRegData.userInfo.email) {
          updatedRegData.userInfo.email = emailMatch[0];
        }
        
        const nameMatch = userInput.includes('name is') || userInput.includes('i am')
          ? userInput.split('name is')[1].trim()
          : userInput.split('i am')[1].trim();
        
        if (nameMatch) {
          const nameParts = nameMatch.split(' ');
          if (!updatedRegData.userInfo.firstName && nameParts.length > 0) {
            updatedRegData.userInfo.firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
          }
          if (!updatedRegData.userInfo.lastName && nameParts.length > 1) {
            updatedRegData.userInfo.lastName = nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1);
          }
        }
        
        const workshopMatch = userInput.includes('interested in') 
          ? userInput.split('interested in')[1].trim()
          : userInput.includes('sign up for')
            ? userInput.split('sign up for')[1].trim()
            : userInput.split('register for')[1].trim();
        
        if (workshopMatch) {
          updatedRegData.workshopTitle = workshopMatch.split(/[.,!?]/)[0].trim();
        }
        
        setRegistrationData(updatedRegData);
      }
    } catch (error) {
      console.error('Error in chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response. Please try again.',
        variant: 'destructive'
      });
      
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: 'I\'m sorry, I encountered an error while processing your request. Please try again later.' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (content: string) => {
    const boldFormatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    const urlFormatted = boldFormatted.replace(
      /(https?:\/\/[^\s]+)/g, 
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>'
    );
    return urlFormatted.replace(/\n/g, '<br>');
  };

  return (
    <>
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90 z-50"
        size="icon"
      >
        {isOpen && !isMinimized ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className={`fixed bottom-28 md:bottom-32 right-6 z-50 w-[90vw] md:w-[400px] rounded-2xl overflow-hidden shadow-2xl border border-border bg-card ${isMinimized ? 'h-auto' : 'h-[65vh] max-h-[550px]'}`}
          >
            <div 
              className="bg-primary text-primary-foreground p-4 flex justify-between items-center cursor-pointer"
              onClick={() => isMinimized && setIsMinimized(false)}
            >
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8 bg-primary-foreground/20">
                  <MessageCircle className="h-5 w-5 text-primary-foreground" />
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm">WorkshopBot</h3>
                  <div className="flex items-center text-xs text-primary-foreground/80">
                    {user ? (
                      <>
                        <UserIcon className="h-3 w-3 mr-1" /> Personalized Assistant
                      </>
                    ) : (
                      'Workshop Hub Assistant'
                    )}
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                onClick={minimizeChat}
              >
                {isMinimized ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </div>

            {!isMinimized && (
              <>
                <ScrollArea className="flex-1 p-4 h-[calc(65vh-140px)] max-h-[calc(550px-140px)]">
                  <div className="space-y-4">
                    {isInitializing ? (
                      <div className="flex justify-center py-8">
                        <div className="flex flex-col items-center space-y-2">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">Loading your personalized assistant...</span>
                        </div>
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                : 'bg-muted rounded-tl-none'
                            }`}
                          >
                            <div 
                              className="text-sm"
                              dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                    
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-muted rounded-tl-none">
                          <div className="flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <form onSubmit={handleSubmit} className="border-t p-4 bg-background">
                  <div className="flex space-x-2">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={user ? "Ask anything about workshops..." : "Ask about our workshops..."}
                      className="flex-1"
                      disabled={isLoading || isInitializing}
                    />
                    <Button 
                      type="submit" 
                      size="icon" 
                      disabled={isLoading || !input.trim() || isInitializing}
                      className={`rounded-full ${(!input.trim() || isInitializing) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </div>

                  {!user && (
                    <div className="mt-3 text-center text-xs text-muted-foreground border-t pt-3">
                      <span>Sign in to get personalized assistance and register for workshops directly.</span>{' '}
                      <a href="/login" className="text-primary hover:underline">Sign in</a>
                    </div>
                  )}
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EnhancedChatbotAssistant;
