
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, ChevronDown, ChevronUp, Loader2, UserIcon, ArrowLeft } from 'lucide-react';
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
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  getChatHistory, 
  saveChatMessage, 
  generateSystemPromptWithRealTimeData,
  extractRegistrationIntent,
  registerForWorkshopViaAI,
  isUserRegisteredForWorkshop,
  deregisterFromWorkshopViaAI
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
  const [processingRegistration, setProcessingRegistration] = useState(false);
  const [deregistrationInProgress, setDeregistrationInProgress] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();

  // Add a class to the body when the chat is open to hide the mobile navigation
  useEffect(() => {
    if (isOpen && !isMinimized) {
      document.body.classList.add('chat-open');
    } else {
      document.body.classList.remove('chat-open');
    }
    
    return () => {
      document.body.classList.remove('chat-open');
    };
  }, [isOpen, isMinimized]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

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

  const closeChat = () => {
    setIsOpen(false);
  };

  const goBack = () => {
    closeChat();
  };

  const handleRegisterForWorkshop = async (workshopTitle: string, userInfo: any) => {
    console.log("Attempting to register for workshop:", workshopTitle);
    console.log("User info:", userInfo);
    
    if (user?.id) {
      try {
        const alreadyRegistered = await isUserRegisteredForWorkshop(
          user.id,
          workshopTitle
        );
        
        if (alreadyRegistered) {
          console.log("User is already registered for this workshop");
          return {
            success: false,
            message: `You're already registered for the "${workshopTitle}" workshop.`
          };
        }
      } catch (error) {
        console.error("Error checking if user is registered:", error);
      }
    }
    
    try {
      if (userInfo && userInfo.firstName && userInfo.lastName && userInfo.email) {
        const result = await registerForWorkshopViaAI(
          workshopTitle,
          user?.id || null,
          userInfo
        );
        
        console.log("Registration result:", result);
        return result;
      } else {
        console.log("Incomplete user info");
        return {
          success: false,
          message: "Please provide your first name, last name, and email to register."
        };
      }
    } catch (error) {
      console.error("Error in registration process:", error);
      return {
        success: false,
        message: `Registration failed: ${(error as Error).message}`
      };
    }
  };

  const handleDeregisterFromWorkshop = async (workshopTitle: string) => {
    console.log("Attempting to deregister from workshop:", workshopTitle);
    
    if (!user?.id) {
      return {
        success: false,
        message: "You need to be logged in to deregister from a workshop."
      };
    }
    
    try {
      const result = await deregisterFromWorkshopViaAI(
        workshopTitle,
        user.id
      );
      
      console.log("Deregistration result:", result);
      return result;
    } catch (error) {
      console.error("Error in deregistration process:", error);
      return {
        success: false,
        message: `Deregistration failed: ${(error as Error).message}`
      };
    }
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
      
      if (registrationInProgress && !processingRegistration) {
        setProcessingRegistration(true);
        
        try {
          const updatedRegData = { ...registrationData };
          const userInput = userMessage.content.toLowerCase();
          
          if (!updatedRegData.userInfo) updatedRegData.userInfo = {};
          
          const emailMatch = userInput.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
          if (emailMatch && !updatedRegData.userInfo.email) {
            updatedRegData.userInfo.email = emailMatch[0];
          }
          
          let nameMatch = '';
          if (userInput.includes('name is')) {
            nameMatch = userInput.split('name is')[1].trim();
          } else if (userInput.includes('i am')) {
            nameMatch = userInput.split('i am')[1].trim();
          }
          
          if (nameMatch) {
            const nameParts = nameMatch.split(' ');
            if (!updatedRegData.userInfo.firstName && nameParts.length > 0) {
              updatedRegData.userInfo.firstName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1);
            }
            if (!updatedRegData.userInfo.lastName && nameParts.length > 1) {
              updatedRegData.userInfo.lastName = nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1);
            }
          }
          
          if (userInput.includes('interested in')) {
            updatedRegData.workshopTitle = userInput.split('interested in')[1].trim().split(/[.,!?]/)[0].trim();
          } else if (userInput.includes('sign up for')) {
            updatedRegData.workshopTitle = userInput.split('sign up for')[1].trim().split(/[.,!?]/)[0].trim();
          } else if (userInput.includes('register for')) {
            updatedRegData.workshopTitle = userInput.split('register for')[1].trim().split(/[.,!?]/)[0].trim();
          } else if (userInput === 'yes' || userInput === 'yes please' || userInput === 'sure') {
            // Keep existing workshop title if user is confirming
          }
          
          setRegistrationData(updatedRegData);
          
          if (user?.id && (!updatedRegData.userInfo.firstName || !updatedRegData.userInfo.lastName || !updatedRegData.userInfo.email)) {
            try {
              const { data: userData } = await supabase.auth.getUser();
              updatedRegData.userInfo.email = updatedRegData.userInfo.email || userData?.user?.email;
              
              const { data: prevRegistration } = await supabase
                .from('registrations')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();
              
              if (prevRegistration) {
                updatedRegData.userInfo.firstName = updatedRegData.userInfo.firstName || prevRegistration.first_name;
                updatedRegData.userInfo.lastName = updatedRegData.userInfo.lastName || prevRegistration.last_name;
                updatedRegData.userInfo.email = updatedRegData.userInfo.email || prevRegistration.email;
              }
            } catch (error) {
              console.error('Error fetching user profile data:', error);
            }
          }
          
          if (updatedRegData.workshopTitle && 
             ((updatedRegData.userInfo.firstName && updatedRegData.userInfo.lastName && updatedRegData.userInfo.email) || 
              (user?.id && updatedRegData.userInfo.email))) {
            
            if (!updatedRegData.userInfo.firstName || !updatedRegData.userInfo.lastName) {
              if (user?.id) {
                if (!updatedRegData.userInfo.firstName && !updatedRegData.userInfo.lastName && updatedRegData.userInfo.email) {
                  const emailParts = updatedRegData.userInfo.email.split('@')[0].split('.');
                  if (emailParts.length >= 2) {
                    updatedRegData.userInfo.firstName = updatedRegData.userInfo.firstName || emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1);
                    updatedRegData.userInfo.lastName = updatedRegData.userInfo.lastName || emailParts[1].charAt(0).toUpperCase() + emailParts[1].slice(1);
                  } else if (emailParts.length === 1) {
                    updatedRegData.userInfo.firstName = updatedRegData.userInfo.firstName || emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1);
                    updatedRegData.userInfo.lastName = updatedRegData.userInfo.lastName || "User";
                  }
                }
              }
            }
            
            const registrationResult = await handleRegisterForWorkshop(
              updatedRegData.workshopTitle,
              updatedRegData.userInfo
            );
            
            let assistantResponse = '';
            
            if (registrationResult.success) {
              assistantResponse = `Great! You're now registered for "${updatedRegData.workshopTitle}". You'll receive a confirmation email shortly with all the details. Is there anything else you'd like help with?`;
              setRegistrationInProgress(false);
              setRegistrationData(null);
            } else if (registrationResult.message.includes('already registered')) {
              assistantResponse = `You're already registered for the "${updatedRegData.workshopTitle}" workshop. Is there anything else I can help you with?`;
              setRegistrationInProgress(false);
              setRegistrationData(null);
            } else {
              if (updatedRegData.userInfo.firstName && updatedRegData.userInfo.lastName && updatedRegData.userInfo.email) {
                assistantResponse = `I'm sorry, I couldn't complete your registration for "${updatedRegData.workshopTitle}". ${registrationResult.message} Would you like to try again?`;
              } else {
                assistantResponse = `I need a bit more information to register you for "${updatedRegData.workshopTitle}". Could you please provide your ${!updatedRegData.userInfo.firstName ? 'first name' : ''}${!updatedRegData.userInfo.firstName && !updatedRegData.userInfo.lastName ? ' and ' : ''}${!updatedRegData.userInfo.lastName ? 'last name' : ''}${(!updatedRegData.userInfo.firstName || !updatedRegData.userInfo.lastName) && !updatedRegData.userInfo.email ? ' and ' : ''}${!updatedRegData.userInfo.email ? 'email address' : ''}?`;
              }
            }
            
            setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
            
            if (user?.id) {
              await saveChatMessage(user.id, sessionId, 'assistant', assistantResponse);
            }
            
            setIsLoading(false);
            setProcessingRegistration(false);
            return;
          }
        } catch (registrationError) {
          console.error('Error in registration process:', registrationError);
        } finally {
          setProcessingRegistration(false);
        }
      }
      
      // Handle deregistration
      if (deregistrationInProgress) {
        if (user?.id && registrationData?.workshopTitle) {
          const deregistrationResult = await handleDeregisterFromWorkshop(
            registrationData.workshopTitle
          );
          
          let assistantResponse = '';
          
          if (deregistrationResult.success) {
            assistantResponse = `${deregistrationResult.message} Is there anything else you'd like help with?`;
          } else {
            assistantResponse = `I'm sorry, I couldn't deregister you. ${deregistrationResult.message}`;
          }
          
          setMessages(prev => [...prev, { role: 'assistant', content: assistantResponse }]);
          
          if (user?.id) {
            await saveChatMessage(user.id, sessionId, 'assistant', assistantResponse);
          }
          
          setIsLoading(false);
          setDeregistrationInProgress(false);
          setRegistrationData(null);
          return;
        }
      }
      
      if (!registrationInProgress && !deregistrationInProgress) {
        const intentData = extractRegistrationIntent([...messages, userMessage]);
        
        if (intentData.intent) {
          console.log("Registration/Deregistration intent detected:", intentData);
          
          if (intentData.deregister) {
            // Handle deregistration intent
            if (intentData.workshopTitle && user?.id) {
              setDeregistrationInProgress(true);
              setRegistrationData({
                workshopTitle: intentData.workshopTitle
              });
            }
          } else if (intentData.workshopTitle) {
            // Handle registration intent
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

  if (location.pathname.startsWith('/admin')) return null;

  return (
    <>
      <Button
        onClick={toggleChat}
        className={`fixed ${isMobile ? 'bottom-20 right-6' : 'bottom-6 right-6'} rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90 z-30`}
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
            initial={isMobile 
              ? { opacity: 0, y: '100%' } 
              : { opacity: 0, x: '100%' }
            }
            animate={isMobile 
              ? { opacity: 1, y: 0 } 
              : { opacity: 1, x: 0 }
            }
            exit={isMobile 
              ? { opacity: 0, y: '100%' } 
              : { opacity: 0, x: '100%' }
            }
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className={`fixed z-40 bg-card border border-border ${
              isMobile 
                ? 'inset-0' 
                : 'top-0 right-0 bottom-0 w-[400px] shadow-xl'
            } ${isMinimized ? 'h-auto' : ''}`}
          >
            <div 
              className="bg-primary text-primary-foreground p-4 flex justify-between items-center"
              onClick={() => isMinimized && setIsMinimized(false)}
            >
              <div className="flex items-center space-x-3">
                {/* Changed to visible on both mobile and desktop */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={goBack}
                  className="h-8 w-8 mr-1 text-primary-foreground hover:bg-primary-foreground/10"
                  aria-label="Close chat"
                >
                  <ArrowLeft size={18} />
                </Button>
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
              
              <div className="flex items-center">
                {!isMobile && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 mr-1"
                    onClick={minimizeChat}
                  >
                    {isMinimized ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </Button>
                )}
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  onClick={closeChat}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <ScrollArea className={`flex-1 p-4 ${isMobile ? 'h-[calc(100vh-120px)]' : 'h-[calc(100vh-140px)]'}`}>
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
