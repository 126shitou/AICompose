'use client';

import { useState } from 'react';
import { motion } from '@/lib/motion-mock';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Pin, PinOff } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isPinned?: boolean;
  sources?: Array<{ title: string, url: string }>;
}

interface ChatMessageProps {
  message: Message;
  onPin: () => void;
}

export function ChatMessage({ message, onPin }: ChatMessageProps) {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(true);

  const isUser = message.role === 'user';
  
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast({
      description: "Message copied to clipboard",
    });
  };
  
  const handleDoubleClick = () => {
    onPin();
    toast({
      description: message.isPinned 
        ? "Message unpinned" 
        : "Message pinned for quick reference",
    });
  };

  return (
    <motion.div
      className={cn(
        "group relative flex gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onDoubleClick={handleDoubleClick}
    >
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/ai-avatar.png" alt="AI" />
          <AvatarFallback className="bg-[#00F7FF]/20 text-[#00F7FF]">AI</AvatarFallback>
        </Avatar>
      )}
      
      <div 
        className={cn(
          "relative max-w-[80%] md:max-w-[70%] rounded-lg px-4 py-3 text-sm",
          isUser 
            ? "bg-[#00F7FF]/10 text-white border border-[#00F7FF]/30 shadow-[0_0_2px_#00F7FF]" 
            : "bg-white/5 backdrop-blur-sm"
        )}
      >
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">
            {isUser ? "You" : "NexusAI"} • {format(message.timestamp, 'h:mm a')}
          </span>
          
          {message.isPinned && (
            <Badge variant="outline" className="border-[#FFD700] text-[#FFD700] text-xs">
              <Pin className="h-3 w-3 mr-1" /> Pinned
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <p>{message.content}</p>
          
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3 pt-2 border-t border-white/10">
              <p className="text-xs text-muted-foreground mb-1">Sources:</p>
              <div className="flex flex-wrap gap-2">
                {message.sources.map((source, i) => (
                  <a 
                    key={i} 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-[#00F7FF] hover:underline"
                  >
                    {source.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className={cn(
          "absolute -top-3 opacity-0 group-hover:opacity-100 transition-opacity",
          isUser ? "-left-12" : "-right-12"
        )}>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={handleCopy}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm"
              onClick={onPin}
            >
              {message.isPinned ? (
                <PinOff className="h-3 w-3" />
              ) : (
                <Pin className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}