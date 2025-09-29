'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SimpleModal } from '@/shared/ui/modal';
import { TaskForm } from '@/shared/ui/task-form';
import { SearchFilter } from '@/shared/ui/search-filter';
import { useUnifiedSearch } from '@/shared/hooks';
import type { MedicalTask } from '@/shared/types/medical';
import type { SearchFilterOption } from '@/shared/types/search';
import { MEDICAL_FILTERS } from '@/shared/types/search';
import { Plus, Edit, Trash2, Clock, AlertTriangle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskManagerProps {
  tasks: MedicalTask[];
  onTaskCreate: (task: Omit<MedicalTask, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onTaskUpdate: (id: string, updates: Partial<MedicalTask>) => Promise<void>;
  onTaskDelete: (id: string) => Promise<void>;
  className?: string;
}

export function TaskManager({
  tasks,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  className
}: TaskManagerProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<MedicalTask | null>(null);
  const [loading, setLoading] = useState(false);

  // Define search fields and filters for tasks
  const searchFields = [
    'title',
    'description',
    'type',
    'assignedTo',
    'assignedBy',
    'patientId',
    'notes'
  ];

  const filters: SearchFilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [...MEDICAL_FILTERS.STATUS.TASK]
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      options: [...MEDICAL_FILTERS.PRIORITY]
    },
    {
      key: 'type',
      label: 'Task Type',
      type: 'select',
      options: [
        { value: 'admin', label: 'Administrative' },
        { value: 'treatment', label: 'Treatment' },
        { value: 'follow-up', label: 'Follow-up' },
        { value: 'lab-order', label: 'Lab Order' },
        { value: 'medication', label: 'Medication' },
        { value: 'consultation', label: 'Consultation' }
      ]
    },
    {
      key: 'assignedTo',
      label: 'Assigned To',
      type: 'select',
      options: [
        { value: 'Dr. Smith', label: 'Dr. Smith' },
        { value: 'Dr. Johnson', label: 'Dr. Johnson' },
        { value: 'Dr. Brown', label: 'Dr. Brown' },
        { value: 'Dr. Wilson', label: 'Dr. Wilson' },
        { value: 'Nurse Manager', label: 'Nurse Manager' }
      ]
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      type: 'date'
    }
  ];

  // Use unified search hook
  const {
    filteredData: filteredTasks,
    setSearchQuery,
    setFilters,
    clearAll
  } = useUnifiedSearch({
    data: tasks,
    searchFields,
    caseSensitive: false
  });

  // Sort tasks by priority and due date
  const sortedTasks = filteredTasks.sort((a, b) => {
    // First sort by status (pending first)
    if (a.status !== b.status) {
      if (a.status === 'pending') return -1;
      if (b.status === 'pending') return 1;
      if (a.status === 'in-progress') return -1;
      if (b.status === 'in-progress') return 1;
    }

    // Then by priority
    const priorityOrder = { stat: 5, urgent: 4, high: 3, normal: 2, low: 1 };
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
    if (aPriority !== bPriority) return bPriority - aPriority;

    // Finally by due date
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return 0;
  });

  const handleCreateTask = async (taskData: Omit<MedicalTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    try {
      await onTaskCreate(taskData);
      setIsCreateModalOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskData: Omit<MedicalTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingTask) return;

    setLoading(true);
    try {
      await onTaskUpdate(editingTask.id, taskData);
      setEditingTask(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await onTaskDelete(taskId);
    }
  };

  const handleToggleComplete = async (task: MedicalTask) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await onTaskUpdate(task.id, { status: newStatus });
  };

  const getPriorityColor = (priority: MedicalTask['priority']) => {
    switch (priority) {
      case 'low': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'normal': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'high': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      case 'urgent': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'stat': return 'text-red-800 bg-red-200 dark:text-red-300 dark:bg-red-900/50';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const getStatusColor = (status: MedicalTask['status']) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'in-progress': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'completed': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'cancelled': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
      case 'overdue': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  const isOverdue = (task: MedicalTask) => {
    if (!task.dueDate || task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date();
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return 'No due date';
    const date = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays === -1) return 'Due yesterday';
    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
    if (diffDays <= 7) return `Due in ${diffDays} days`;

    return date.toLocaleDateString();
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Task Management</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Search and Filters */}
      <SearchFilter
        searchFields={searchFields}
        searchPlaceholder="Search tasks by title, description, assignee, or patient..."
        filters={filters}
        onSearch={setSearchQuery}
        onFilter={setFilters}
        onClear={clearAll}
        defaultSearchValue=""
        enableAdvancedFilters={true}
      />

      {/* Tasks List */}
      <div className="space-y-4">
        {sortedTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {tasks.length === 0 ? 'No tasks found' : 'No tasks match your search criteria'}
          </div>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                'bg-card rounded-lg p-4 border border-border space-y-3',
                task.status === 'completed' && 'opacity-75',
                isOverdue(task) && 'border-red-200 bg-red-50/50 dark:bg-red-900/10'
              )}
            >
              {/* Task Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={cn(
                        'font-medium text-sm',
                        task.status === 'completed' && 'line-through text-muted-foreground'
                      )}
                    >
                      {task.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    {isOverdue(task) && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        OVERDUE
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleComplete(task)}
                  >
                    {task.status === 'completed' ? 'Reopen' : 'Complete'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingTask(task)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteTask(task.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Task Details */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>{task.assignedTo}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatDueDate(task.dueDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span className="capitalize">{task.type.replace('-', ' ')}</span>
                </div>
                {task.patientId && (
                  <span>Patient: {task.patientId}</span>
                )}
              </div>

              {task.notes && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">{task.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Task Modal */}
      <SimpleModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        title="Create New Task"
        description="Fill out the form below to create a new medical task."
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateModalOpen(false)}
          loading={loading}
        />
      </SimpleModal>

      {/* Edit Task Modal */}
      <SimpleModal
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        title="Edit Task"
        description="Update the task details below."
      >
        {editingTask && (
          <TaskForm
            task={editingTask}
            onSubmit={handleUpdateTask}
            onCancel={() => setEditingTask(null)}
            loading={loading}
          />
        )}
      </SimpleModal>
    </div>
  );
}