'use client';

import { useState } from 'react';
import { motion } from '@/lib/motion-mock';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{ title: string, url: string }>;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(true);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    toast({
      description: "Message copied to clipboard",
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

    >
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src="/ai-avatar.png" alt="AI" />
          <AvatarFallback className="bg-[#00F7FF]/20 text-[#00F7FF]">AI</AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "relative max-w-[80%] md:max-w-[70%] rounded-lg px-4 py-3 text-sm transition-all duration-200",
          isUser
            ? "bg-gradient-to-br from-[#00F7FF]/30 to-[#00F7FF]/10 text-gray-800 border border-[#00F7FF]/40 shadow-[0_0_8px_#00F7FF/20] hover:shadow-[0_0_12px_#00F7FF/30] hover:border-[#00F7FF]/60"
            : "bg-gradient-to-br from-gray-100 to-gray-50 text-gray-800 backdrop-blur-sm border border-gray-200 shadow-[0_0_8px_rgba(0,0,0,0.05)] hover:shadow-[0_0_12px_rgba(0,0,0,0.08)] hover:border-gray-300"
        )}
      >
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-gray-500">
            {isUser ? "You" : "NexusAI"} • {format(message.timestamp, 'h:mm a')}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-700"
            onClick={handleCopy}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="space-y-2 leading-relaxed">
          <p className={cn(
            "whitespace-pre-wrap text-base",
            isUser ? "text-gray-800" : "text-gray-700"
          )}>{message.content}</p>
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