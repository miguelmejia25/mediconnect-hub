import { useState } from 'react';
import { Message } from '@/types/medical';
import { cn } from '@/lib/utils';
import { Send, Paperclip, Smile } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ChatWindowProps {
  messages: Message[];
  patientName: string;
  patientId: string;
  onSendMessage: (content: string) => void;
}

const ChatWindow = ({ messages, patientName, patientId, onSendMessage }: ChatWindowProps) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b border-border bg-card rounded-t-xl">
        <h3 className="font-semibold text-foreground">{patientName}</h3>
        <p className="text-sm text-muted-foreground">Paciente ID: {patientId}</p>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/30">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.isFromPatient ? "justify-start" : "justify-end"
            )}
          >
            <div
              className={cn(
                "max-w-[70%] p-3 rounded-2xl",
                message.isFromPatient
                  ? "bg-card border border-border rounded-bl-sm"
                  : "medical-gradient text-primary-foreground rounded-br-sm"
              )}
            >
              <p className="text-sm">{message.content}</p>
              <p className={cn(
                "text-xs mt-1",
                message.isFromPatient ? "text-muted-foreground" : "text-primary-foreground/70"
              )}>
                {format(message.timestamp, 'HH:mm', { locale: es })}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-border bg-card rounded-b-xl">
        <div className="flex items-center gap-2">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Smile className="w-5 h-5" />
          </button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className="flex-1 border-border/50 focus:border-primary"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="medical-gradient text-primary-foreground px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
