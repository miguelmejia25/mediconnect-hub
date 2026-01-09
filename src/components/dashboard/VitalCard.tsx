import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VitalStatus } from '@/types/medical';

interface VitalCardProps {
  title: string;
  value: number;
  unit: string;
  status: VitalStatus;
  icon: LucideIcon;
  color: string;
}

const statusStyles = {
  normal: {
    bg: 'bg-success/10',
    text: 'text-success',
    badge: 'Normal'
  },
  warning: {
    bg: 'bg-warning/10',
    text: 'text-warning',
    badge: 'Precaución'
  },
  critical: {
    bg: 'bg-critical/10',
    text: 'text-critical',
    badge: 'Crítico'
  }
};

const VitalCard = ({ title, value, unit, status, icon: Icon, color }: VitalCardProps) => {
  const statusStyle = statusStyles[status];

  return (
    <div className="vital-card animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-lg", color.replace('text-', 'bg-').replace('vital-', 'vital-') + '/10')}>
          <Icon className={cn("w-5 h-5", color)} />
        </div>
        <span className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          statusStyle.bg,
          statusStyle.text
        )}>
          {statusStyle.badge}
        </span>
      </div>
      
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <div className="flex items-baseline gap-1">
        <span className={cn("text-3xl font-display font-bold", color)}>{value}</span>
        <span className="text-sm text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
};

export default VitalCard;
