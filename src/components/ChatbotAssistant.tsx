
import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ChatbotAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isBot: boolean }[]>([
    { text: "Hi there! I'm your workshop assistant. How can I help you today?", isBot: true },
  ]);
  const [inputText, setInputText] = useState('');

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    // Add user message
    setMessages([...messages, { text: inputText, isBot: false }]);
    setInputText('');

    // Simulate bot response after delay
    setTimeout(() => {
      const responses = [
        "Thanks for your question! Our workshops are designed for students of all skill levels.",
        "You can register for multiple workshops if seats are available.",
        "The registration process is simple - just fill out the form and select your preferred workshop.",
        "Need help with registration? I can guide you through the process step by step.",
        "Each workshop includes hands-on activities and a certificate upon completion.",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages(currentMessages => [...currentMessages, { text: randomResponse, isBot: true }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chatbot Button */}
      <Button
        className={cn(
          "h-14 w-14 rounded-full shadow-lg flex items-center justify-center",
          !isOpen && "bg-primary hover:bg-primary/90"
        )}
        onClick={toggleChat}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[350px] h-[450px] bg-card rounded-lg shadow-xl border border-border overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-primary p-4 text-white">
            <h3 className="font-semibold">Workshop Assistant</h3>
            <p className="text-xs opacity-80">We typically reply in a few minutes</p>
          </div>

          {/* Messages Container */}
          <div className="p-4 h-[330px] overflow-y-auto flex flex-col space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "max-w-[80%] p-3 rounded-lg",
                  message.isBot
                    ? "bg-muted self-start rounded-bl-none"
                    : "bg-primary text-white self-end rounded-br-none"
                )}
              >
                {message.text}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-3 flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-muted rounded-full focus:outline-none focus:ring-1 focus:ring-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
            />
            <Button
              size="icon"
              className="rounded-full bg-primary hover:bg-primary/90"
              onClick={handleSendMessage}
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotAssistant;
