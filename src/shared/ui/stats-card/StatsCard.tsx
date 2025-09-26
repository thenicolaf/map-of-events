'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    timeframe: string;
  };
  className?: string;
}

export function StatsCard({ title, value, change, className }: StatsCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-lg p-6 border border-border",
      className
    )}>
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-center justify-between">
          <p className="text-3xl font-bold">{value}</p>
          {change && (
            <div className={cn(
              "flex items-center gap-1 text-xs",
              change.type === 'increase' ? "text-emerald-600" : "text-red-600"
            )}>
              {change.type === 'increase' ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{change.value}</span>
            </div>
          )}
        </div>
        {change && (
          <p className="text-xs text-muted-foreground">{change.timeframe}</p>
        )}
      </div>
    </div>
  );
}