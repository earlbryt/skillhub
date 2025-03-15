import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { generateChatResponse, ChatMessage } from '@/services/groqService';
import { generateSystemPromptWithWorkshopData } from '@/services/chatbotService';
import { useToast } from '@/hooks/use-toast';

const ChatbotAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'assistant', 
      content: 'Hi there! 👋 I\'m WorkshopBot, your Workshop Hub assistant. How can I help you today?' 
    }
  ]);
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Initialize system prompt with workshop data
  useEffect(() => {
    const initializeSystemPrompt = async () => {
      try {
        const prompt = await generateSystemPromptWithWorkshopData();
        setSystemPrompt(prompt);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing system prompt:', error);
        // Fallback to a basic system prompt if there's an error
        setSystemPrompt('You are a helpful assistant for Workshop Hub, a platform where students can sign up for educational workshops.');
        setIsInitialized(true);
      }
    };

    initializeSystemPrompt();
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat is opened
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
    
    if (!input.trim() || !isInitialized) return;
    
    const userMessage: ChatMessage = { role: 'user', content: input };
    
    // Update messages with user input
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get response from Groq with system prompt
      const response = await generateChatResponse([
        { role: 'system', content: systemPrompt },
        ...messages,
        userMessage
      ]);
      
      // Add assistant response
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error in chat:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format message content with markdown-like syntax
  const formatMessage = (content: string) => {
    // Replace **text** with bold
    const boldFormatted = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace URLs with links
    const urlFormatted = boldFormatted.replace(
      /(https?:\/\/[^\s]+)/g, 
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>'
    );
    
    // Replace newlines with <br>
    return urlFormatted.replace(/\n/g, '<br>');
  };

  return (
    <>
      {/* Chat toggle button */}
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

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className={`fixed bottom-28 md:bottom-32 right-6 z-50 w-[90vw] md:w-[400px] rounded-2xl overflow-hidden shadow-2xl border border-border bg-card ${isMinimized ? 'h-auto' : 'h-[65vh] max-h-[550px]'}`}
          >
            {/* Chat header */}
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
                  <p className="text-xs text-primary-foreground/80">Workshop Hub Assistant</p>
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
                {/* Chat messages */}
                <ScrollArea className="flex-1 p-4 h-[calc(65vh-140px)] max-h-[calc(550px-140px)]">
                  <div className="space-y-4">
                    {!isInitialized && (
                      <div className="flex justify-center py-8">
                        <div className="flex flex-col items-center space-y-2">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">Loading workshop information...</span>
                        </div>
                      </div>
                    )}
                    
                    {isInitialized && messages.map((message, index) => (
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
                    ))}
                    
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

                {/* Chat input */}
                <form onSubmit={handleSubmit} className="border-t p-4 bg-background">
                  <div className="flex space-x-2">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                      disabled={isLoading || !isInitialized}
                    />
                    <Button 
                      type="submit" 
                      size="icon" 
                      disabled={isLoading || !input.trim() || !isInitialized}
                      className={`rounded-full ${(!input.trim() || !isInitialized) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotAssistant;
