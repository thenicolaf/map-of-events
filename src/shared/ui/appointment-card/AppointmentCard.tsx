'use client';

import { Clock, ArrowUpRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AppointmentCardProps {
  type: string;
  status: 'active' | 'scheduled' | 'progress';
  patient: {
    name: string;
    initials: string;
    image?: string;
  };
  time: string;
  duration: string;
  className?: string;
}

export function AppointmentCard({
  type,
  status,
  patient,
  time,
  duration,
  className
}: AppointmentCardProps) {
  const isActive = status === 'active';

  return (
    <div
      className={cn(
        "rounded-lg p-4 transition-all hover:scale-[1.02]",
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-card border border-border",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className={cn(
            "font-semibold",
            isActive ? "text-primary-foreground" : "text-foreground"
          )}>
            {type}
          </h3>
          <Badge
            variant={isActive ? "secondary" : "outline"}
            className={cn(
              "text-xs mt-1",
              isActive && "bg-primary-foreground/20 text-primary-foreground"
            )}
          >
            {status === 'active' ? 'Checked In' :
             status === 'progress' ? 'In Progress' : 'Scheduled'}
          </Badge>
        </div>
        {!isActive && (
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        )}
      </div>

      {/* Patient Info */}
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={patient.image} alt={patient.name} />
          <AvatarFallback className={cn(
            isActive && "bg-primary-foreground/20 text-primary-foreground"
          )}>
            {patient.initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className={cn(
            "font-medium text-sm",
            isActive ? "text-primary-foreground" : "text-foreground"
          )}>
            {patient.name}
          </p>
          <div className="flex items-center gap-2 text-xs opacity-80">
            <Clock className="h-3 w-3" />
            <span>{time} • {duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}