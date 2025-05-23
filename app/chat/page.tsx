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
  MoreVertical,
  Pencil,
  Trash2,
  Check,
  X,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
  isEditing?: boolean;
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
    },
    {
      id: '2',
      role: 'user',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
    {
      id: '3',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
    {
      id: '2',
      role: 'user',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
    {
      id: '3',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
    {
      id: '2',
      role: 'user',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
    {
      id: '3',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
    {
      id: '2',
      role: 'user',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
    {
      id: '3',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
    {
      id: '2',
      role: 'user',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
    {
      id: '3',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
    {
      id: '2',
      role: 'user',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
    {
      id: '3',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
    {
      id: '2',
      role: 'user',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
    {
      id: '3',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([
    {
      id: '1',
      title: 'Previous conversation',
      messages: messages,
      timestamp: new Date(),
    },
    {
      id: '2',
      title: 'Image generation help',
      messages: messages,
      timestamp: new Date(),
    },
  ]);
  const [editingTitle, setEditingTitle] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentChatId, setCurrentChatId] = useState<string>('1');

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

  const handleDeleteHistory = (id: string) => {
    setChatHistories(prev => prev.filter(history => history.id !== id));
  };

  const handleStartEditing = (history: ChatHistory) => {
    setChatHistories(prev => prev.map(h =>
      h.id === history.id ? { ...h, isEditing: true } : h
    ));
    setEditingTitle(history.title);
    // Focus the input after a short delay to ensure it's rendered
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleSaveTitle = (id: string) => {
    if (editingTitle.trim()) {
      setChatHistories(prev => prev.map(h =>
        h.id === id ? { ...h, title: editingTitle.trim(), isEditing: false } : h
      ));
    }
  };

  const handleCancelEditing = (id: string) => {
    setChatHistories(prev => prev.map(h =>
      h.id === id ? { ...h, isEditing: false } : h
    ));
  };

  const handleNewChat = () => {
    const newChat: ChatHistory = {
      id: Date.now().toString(),
      title: `New Chat ${chatHistories.length + 1}`,
      messages: [{
        id: '1',
        role: 'assistant',
        content: 'Hello! How can I help you today?',
        timestamp: new Date(),
      }],
      timestamp: new Date(),
    };
    setChatHistories(prev => [newChat, ...prev]);
    setMessages(newChat.messages);
    setCurrentChatId(newChat.id);
  };

  const handleSelectChat = (chatId: string) => {
    const selectedChat = chatHistories.find(chat => chat.id === chatId);
    if (selectedChat) {
      setMessages(selectedChat.messages);
      setCurrentChatId(chatId);
    }
  };

  // Add a function to check if current chat is new
  const isCurrentChatNew = () => {
    const currentChat = chatHistories.find(chat => chat.id === currentChatId);
    return currentChat?.messages.length === 1 &&
      currentChat.messages[0].role === 'assistant' &&
      currentChat.messages[0].content === 'Hello! How can I help you today?';
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col">
      <h1 className="text-3xl font-bold mb-4">{t('chat.title', 'AI Assistant')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-grow mb-6">
        <Card className="col-span-1 p-4 border-border bg-card/50 backdrop-blur-sm hidden lg:block dark:bg-gray-900/40 dark:border-gray-700/40">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold dark:text-gray-200">{t('chat.history', 'History')}</h2>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 px-3 gap-2 border-[#00F7FF]/40 hover:border-[#00F7FF] hover:bg-[#00F7FF]/10 transition-all duration-200 dark:border-[#00F7FF]/30 dark:hover:border-[#00F7FF]/60 dark:hover:bg-[#00F7FF]/15 dark:bg-gray-800/30",
                isCurrentChatNew() && "opacity-50 cursor-not-allowed hover:bg-transparent hover:border-[#00F7FF]/40 dark:hover:bg-transparent dark:hover:border-[#00F7FF]/30"
              )}
              onClick={handleNewChat}
              disabled={isCurrentChatNew()}
            >
              <Plus className="h-4 w-4 text-[#00F7FF]" />
              <span className="text-sm font-medium dark:text-gray-300">New Chat</span>
            </Button>
          </div>
          <div className="space-y-2">
            {chatHistories.map((history) => (
              <div key={history.id} className="group relative">
                {history.isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      ref={inputRef}
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="h-8 text-sm dark:bg-gray-800/50 dark:border-gray-600/50 dark:text-gray-200 dark:placeholder:text-gray-500"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveTitle(history.id);
                        if (e.key === 'Escape') handleCancelEditing(history.id);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 dark:hover:bg-gray-700/50 dark:text-gray-300 dark:hover:text-gray-200"
                      onClick={() => handleSaveTitle(history.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 dark:hover:bg-gray-700/50 dark:text-gray-300 dark:hover:text-gray-200"
                      onClick={() => handleCancelEditing(history.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start group-hover:pr-8 dark:border-gray-600/40 dark:bg-gray-800/20 dark:text-gray-300 dark:hover:bg-gray-700/30 dark:hover:border-gray-500/50",
                        currentChatId === history.id && "bg-[#00F7FF]/10 border-[#00F7FF]/40 dark:bg-[#00F7FF]/15 dark:border-[#00F7FF]/50 dark:text-gray-200"
                      )}
                      onClick={() => handleSelectChat(history.id)}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      <span className="truncate">{history.title}</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity dark:hover:bg-gray-700/50 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="dark:bg-gray-800/95 dark:border-gray-600/50 dark:backdrop-blur-sm">
                        <DropdownMenuItem onClick={() => handleStartEditing(history)} className="dark:text-gray-300 dark:hover:bg-gray-700/50 dark:focus:bg-gray-700/50">
                          <Pencil className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 dark:text-red-400 dark:hover:bg-gray-700/50 dark:focus:bg-gray-700/50"
                          onClick={() => handleDeleteHistory(history.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="col-span-1 lg:col-span-3 flex flex-col border-border bg-card/50 backdrop-blur-sm overflow-hidden h-[calc(100vh-200px)] dark:bg-gray-900/40 dark:border-gray-700/40">
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-6 pb-4">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                  />
                ))}
                {isLoading && (
                  <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-[#00F7FF] animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-[#00F7FF] animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-[#00F7FF] animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="flex-none p-4 border-t border-gray-200 bg-gray-50/50 dark:border-gray-700/40 dark:bg-gray-800/30">
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  placeholder={t('chat.inputPlaceholder', 'Type your message...')}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-24 pr-20 resize-none bg-gradient-to-br from-gray-100 to-gray-50 border-[#00F7FF]/20 shadow-[0_0_8px_#00F7FF/20] focus-visible:border-[#00F7FF]/40 focus-visible:shadow-[0_0_12px_#00F7FF/30] focus-visible:ring-[#00F7FF]/30 placeholder:text-gray-400 text-gray-800 backdrop-blur-sm transition-all duration-200 dark:bg-gradient-to-br dark:from-gray-800/60 dark:to-gray-700/40 dark:border-[#00F7FF]/25 dark:shadow-[0_0_8px_#00F7FF/15] dark:focus-visible:border-[#00F7FF]/50 dark:focus-visible:shadow-[0_0_12px_#00F7FF/25] dark:focus-visible:ring-[#00F7FF]/25 dark:placeholder:text-gray-500 dark:text-gray-200"
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-8 w-8 border-gray-200 hover:border-[#00F7FF]/40 hover:bg-[#00F7FF]/10 transition-all duration-200 dark:border-gray-600/50 dark:bg-gray-700/30 dark:hover:border-[#00F7FF]/50 dark:hover:bg-[#00F7FF]/15"
                  >
                    <Paperclip className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    className=" h-8 w-8 border-gray-200 hover:border-[#00F7FF]/40 hover:bg-[#00F7FF]/10 transition-all duration-200 block p-0 mx-auto dark:border-gray-600/50 dark:hover:border-[#00F7FF]/50 bg-[#00F7FF] hover:bg-[#00F7FF]/90 dark:bg-[#00F7FF] dark:hover:bg-[#00F7FF]/90"
                  >
                    <Send className=" mx-auto h-5 w-5 text-white" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <button className="flex items-center hover:text-[#00F7FF] transition-colors dark:hover:text-[#00F7FF]">
                    <Mic className="h-3.5 w-3.5 mr-1" />
                    {t('chat.voice', 'Voice')}
                  </button>
                  <button className="flex items-center hover:text-[#00F7FF] transition-colors dark:hover:text-[#00F7FF]">
                    <ImageIcon className="h-3.5 w-3.5 mr-1" />
                    {t('chat.image', 'Image')}
                  </button>
                  <button className="flex items-center hover:text-[#00F7FF] transition-colors dark:hover:text-[#00F7FF]">
                    <FileText className="h-3.5 w-3.5 mr-1" />
                    {t('chat.document', 'Document')}
                  </button>
                </div>
                <span className="text-[#00F7FF] font-medium">{t('chat.credits', 'Credits: 120')}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}