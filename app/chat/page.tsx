'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from '@/lib/motion-mock';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/chat/message';
import { cn } from '@/lib/utils';
import { 
  Send, 
  Mic, 
  Image as ImageIcon, 
  FileText, 
  Paperclip,
  Clock,
  Pin
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isPinned?: boolean;
  sources?: Array<{ title: string, url: string }>;
}

export default function ChatPage() {
  const { t } = useTranslation();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
      sources: [
        { title: 'Wikipedia', url: 'https://wikipedia.org' },
        { title: 'Research Paper', url: '#' }
      ]
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand your question about "${input}". Here's what I found...`,
        timestamp: new Date(),
        sources: [
          { title: 'Knowledge Base', url: '#' },
          { title: 'Documentation', url: '#' }
        ]
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePinMessage = (id: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, isPinned: !msg.isPinned } : msg
      )
    );
  };

  const pinnedMessages = messages.filter(msg => msg.isPinned);

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col">
      <h1 className="text-3xl font-bold mb-4">{t('chat.title', 'AI Assistant')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow mb-6">
        <Card className="col-span-1 p-4 border-white/10 bg-black/20 backdrop-blur-sm hidden lg:block">
          <h2 className="text-xl font-semibold mb-3">{t('chat.history', 'History')}</h2>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <Clock className="mr-2 h-4 w-4" />
              <span className="truncate">Previous conversation</span>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Clock className="mr-2 h-4 w-4" />
              <span className="truncate">Image generation help</span>
            </Button>
          </div>
        </Card>
        
        <Card className="col-span-1 lg:col-span-3 flex flex-col border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden">
          <Tabs defaultValue="chat" className="flex-grow flex flex-col">
            <div className="px-4 pt-3 border-b border-white/10">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">{t('chat.messages', 'Messages')}</TabsTrigger>
                <TabsTrigger value="pinned">
                  {t('chat.pinned', 'Pinned')}
                  {pinnedMessages.length > 0 && (
                    <Badge className="ml-2 bg-[#00F7FF] text-black">
                      {pinnedMessages.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="chat" className="flex-grow flex flex-col p-0 m-0">
              <ScrollArea className="flex-grow p-4">
                <div className="space-y-6">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      onPin={() => handlePinMessage(message.id)}
                    />
                  ))}
                  {isLoading && (
                    <div className="flex items-center space-x-2 text-white/70">
                      <div className="w-2 h-2 rounded-full bg-[#00F7FF] animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-[#00F7FF] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-[#00F7FF] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              
              <div className="p-4 border-t border-white/10 bg-black/30">
                <div className="relative">
                  <Textarea
                    ref={textareaRef}
                    placeholder={t('chat.inputPlaceholder', 'Type your message...')}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="min-h-24 pr-20 resize-none bg-black/20 border-white/20 focus-visible:ring-[#00F7FF]"
                  />
                  <div className="absolute right-3 bottom-3 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full h-8 w-8 border-white/20"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!input.trim() || isLoading}
                      className="rounded-full h-8 w-8 bg-[#00F7FF] hover:bg-[#00F7FF]/80 text-black"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <button className="flex items-center hover:text-white transition-colors">
                      <Mic className="h-3.5 w-3.5 mr-1" />
                      {t('chat.voice', 'Voice')}
                    </button>
                    <button className="flex items-center hover:text-white transition-colors">
                      <ImageIcon className="h-3.5 w-3.5 mr-1" />
                      {t('chat.image', 'Image')}
                    </button>
                    <button className="flex items-center hover:text-white transition-colors">
                      <FileText className="h-3.5 w-3.5 mr-1" />
                      {t('chat.document', 'Document')}
                    </button>
                  </div>
                  <span>{t('chat.credits', 'Credits: 120')}</span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pinned" className="flex-grow flex flex-col p-0 m-0">
              <ScrollArea className="flex-grow p-4">
                {pinnedMessages.length > 0 ? (
                  <div className="space-y-6">
                    {pinnedMessages.map((message) => (
                      <ChatMessage
                        key={message.id}
                        message={message}
                        onPin={() => handlePinMessage(message.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-20">
                    <Pin className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      {t('chat.noPinned', 'No pinned messages')}
                    </h3>
                    <p className="text-muted-foreground max-w-md">
                      {t('chat.pinHint', 'Double-click on any message to pin it for quick reference')}
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}