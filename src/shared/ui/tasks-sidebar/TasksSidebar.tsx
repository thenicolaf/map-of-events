'use client';

import { Plus, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  time: string;
  completed?: boolean;
}

interface TasksSidebarProps {
  tasks: Task[];
  pendingCount: number;
  className?: string;
}

export function TasksSidebar({ tasks, pendingCount, className }: TasksSidebarProps) {
  return (
    <div className={cn("w-80 bg-card border-l border-border p-6 space-y-6", className)}>
      {/* Today's Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Today&apos;s Tasks</h3>
          <Badge variant="secondary" className="px-2 py-1">
            Pending {pendingCount}
          </Badge>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "p-3 rounded-lg border transition-colors",
                task.completed
                  ? "bg-muted/50 border-muted"
                  : "bg-background border-border hover:bg-muted/50"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex items-center justify-center w-5 h-5 rounded-full border-2 mt-0.5",
                  task.completed
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-muted-foreground"
                )}>
                  {task.completed && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={cn(
                    "text-sm font-medium",
                    task.completed && "line-through text-muted-foreground"
                  )}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{task.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full mt-4" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add New Task
        </Button>
      </div>

      {/* Quick Stats */}
      <div>
        <h3 className="font-semibold mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">24</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">8</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">16</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div className="bg-muted rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">92%</p>
            <p className="text-xs text-muted-foreground">Success</p>
          </div>
        </div>
      </div>
    </div>
  );
}