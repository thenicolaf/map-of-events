'use client';

import { useState, useEffect } from 'react';
import { TaskManager } from '@/shared/ui/task-manager';
import { medicalTasksApi } from '@/shared/api';
import type { MedicalTask } from '@/shared/types/medical';
import { ApiError } from '@/shared/api';

export default function TasksPage() {
  const [tasks, setTasks] = useState<MedicalTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await medicalTasksApi.getMedicalTasks();
        setTasks(tasksData);
      } catch (err) {
        const errorMessage =
          err instanceof ApiError
            ? `API Error (${err.status}): ${err.message}`
            : 'Failed to fetch tasks data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskCreate = async (taskData: Omit<MedicalTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTask = await medicalTasksApi.createMedicalTask(taskData);
      setTasks(prevTasks => [newTask, ...prevTasks]);
    } catch (error) {
      console.error('Failed to create task:', error);
      throw new Error('Failed to create task. Please try again.');
    }
  };

  const handleTaskUpdate = async (id: string, updates: Partial<MedicalTask>) => {
    try {
      const updatedTask = await medicalTasksApi.updateMedicalTask(id, updates);
      setTasks(prevTasks =>
        prevTasks.map(task => task.id === id ? updatedTask : task)
      );
    } catch (error) {
      console.error('Failed to update task:', error);
      throw new Error('Failed to update task. Please try again.');
    }
  };

  const handleTaskDelete = async (id: string) => {
    try {
      await medicalTasksApi.deleteMedicalTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw new Error('Failed to delete task. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Medical Tasks</h1>
            <p className="text-sm text-muted-foreground">
              Comprehensive task management with CRUD operations and advanced filtering
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {loading ? 'Loading...' : `${tasks.length} tasks total`}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-muted border-t-primary rounded-full"></div>
          </div>
        ) : (
          <TaskManager
            tasks={tasks}
            onTaskCreate={handleTaskCreate}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
          />
        )}

        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            💻 This page demonstrates comprehensive CRUD operations for medical tasks with advanced search and filtering
          </p>
        </div>
      </main>
    </div>
  );
}