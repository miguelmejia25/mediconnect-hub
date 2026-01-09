import { Message } from '@/types/medical';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface MessageCardProps {
  message: Message;
  onClick: () => void;
}

const MessageCard = ({ message, onClick }: MessageCardProps) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "p-4 rounded-xl cursor-pointer transition-all duration-200 border",
        message.read 
          ? "bg-card border-border/50 hover:border-primary/30" 
          : "bg-primary/5 border-primary/20 hover:bg-primary/10"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-2 h-2 rounded-full mt-2 shrink-0",
          message.read ? "bg-muted" : "bg-primary animate-pulse"
        )} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium text-foreground truncate">
              {message.patientName}
            </h4>
            <span className="text-xs text-muted-foreground shrink-0">
              {formatDistanceToNow(message.timestamp, { addSuffix: true, locale: es })}
            </span>
          </div>
          
          <p className={cn(
            "text-sm mt-1 line-clamp-2",
            message.read ? "text-muted-foreground" : "text-foreground"
          )}>
            {message.isFromPatient ? '' : 'Tú: '}{message.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;
