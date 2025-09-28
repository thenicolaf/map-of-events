'use client';

import { Plus, Check, Clock, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { MedicalTask } from '@/shared/types/medical';

interface TasksSidebarProps {
  tasks: MedicalTask[];
  pendingCount: number;
  className?: string;
  onTaskUpdate?: (id: string, updates: Partial<MedicalTask>) => Promise<void>;
  onTaskCreate?: (task: Omit<MedicalTask, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onTaskDelete?: (id: string) => Promise<void>;
}

export function TasksSidebar({
  tasks,
  pendingCount,
  className,
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete
}: TasksSidebarProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleToggleComplete = async (task: MedicalTask) => {
    if (onTaskUpdate) {
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await onTaskUpdate(task.id, { status: newStatus });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (onTaskDelete && confirm('Are you sure you want to delete this task?')) {
      await onTaskDelete(taskId);
    }
  };

  const handleCreateTask = async () => {
    if (onTaskCreate && newTaskTitle.trim()) {
      await onTaskCreate({
        title: newTaskTitle.trim(),
        description: '',
        type: 'follow-up',
        priority: 'normal',
        status: 'pending',
        assignedTo: 'Dr. Smith',
        assignedBy: 'Dr. Smith',
        patientId: '',
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
      setNewTaskTitle("");
      setIsCreating(false);
    }
  };

  const formatTaskTime = (task: MedicalTask) => {
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      return dueDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
    return 'No due time';
  };

  const getPriorityColor = (priority: MedicalTask['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'urgent': return 'text-red-700';
      case 'stat': return 'text-red-800';
      case 'normal': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };
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
                "p-3 rounded-lg border transition-colors group",
                task.status === 'completed'
                  ? "bg-muted/50 border-muted"
                  : "bg-background border-border hover:bg-muted/50"
              )}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleComplete(task)}
                  className={cn(
                    "flex items-center justify-center w-5 h-5 rounded-full border-2 mt-0.5 transition-colors",
                    task.status === 'completed'
                      ? "bg-emerald-500 border-emerald-500"
                      : "border-muted-foreground hover:border-emerald-500"
                  )}
                >
                  {task.status === 'completed' && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <p className={cn(
                      "text-sm font-medium",
                      task.status === 'completed' && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete task"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatTaskTime(task)}</span>
                    <span className={cn("font-medium", getPriorityColor(task.priority))}>
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {task.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Task */}
        {isCreating ? (
          <div className="mt-4 space-y-2">
            <input
              type="text"
              placeholder="Enter task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateTask();
                if (e.key === 'Escape') {
                  setIsCreating(false);
                  setNewTaskTitle("");
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleCreateTask}
                disabled={!newTaskTitle.trim()}
                className="flex-1"
              >
                Create
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setNewTaskTitle("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className="w-full mt-4"
            size="sm"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Task
          </Button>
        )}
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