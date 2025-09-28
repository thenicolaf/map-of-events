'use client';

import { useState } from 'react';
import { TasksSidebar } from '@/shared/ui/tasks-sidebar/TasksSidebar';
import { medicalTasksApi } from '@/shared/api';
import type { MedicalTask } from '@/shared/types/medical';

interface ClientTaskManagerProps {
  initialTasks: MedicalTask[];
}

export function ClientTaskManager({ initialTasks }: ClientTaskManagerProps) {
  const [tasks, setTasks] = useState<MedicalTask[]>(initialTasks);

  const pendingCount = tasks.filter(task => task.status === 'pending').length;

  const handleTaskUpdate = async (id: string, updates: Partial<MedicalTask>) => {
    try {
      const updatedTask = await medicalTasksApi.updateMedicalTask(id, updates);
      setTasks(prevTasks =>
        prevTasks.map(task => task.id === id ? updatedTask : task)
      );
    } catch (error) {
      console.error('Failed to update task:', error);
      alert('Failed to update task. Please try again.');
    }
  };

  const handleTaskCreate = async (task: Omit<MedicalTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTask = await medicalTasksApi.createMedicalTask(task);
      setTasks(prevTasks => [newTask, ...prevTasks]);
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  const handleTaskDelete = async (id: string) => {
    try {
      await medicalTasksApi.deleteMedicalTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task. Please try again.');
    }
  };

  return (
    <TasksSidebar
      tasks={tasks}
      pendingCount={pendingCount}
      onTaskUpdate={handleTaskUpdate}
      onTaskCreate={handleTaskCreate}
      onTaskDelete={handleTaskDelete}
    />
  );
}