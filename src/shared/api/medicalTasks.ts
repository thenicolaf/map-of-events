import { httpClient } from './index';
import type { MedicalTask } from '@/shared/types/medical';

export const medicalTasksApi = {
  async getMedicalTasks(): Promise<MedicalTask[]> {
    return httpClient.get<MedicalTask[]>('/medicalTasks');
  },

  async getMedicalTask(id: string): Promise<MedicalTask> {
    return httpClient.get<MedicalTask>(`/medicalTasks/${id}`);
  },

  async getTasksByAssignee(assignedTo: string): Promise<MedicalTask[]> {
    const tasks = await this.getMedicalTasks();
    return tasks.filter(task => task.assignedTo === assignedTo);
  },

  async getTasksByStatus(status: MedicalTask['status']): Promise<MedicalTask[]> {
    const tasks = await this.getMedicalTasks();
    return tasks.filter(task => task.status === status);
  },

  async getPendingTasks(): Promise<MedicalTask[]> {
    return this.getTasksByStatus('pending');
  },

  async getCompletedTasks(): Promise<MedicalTask[]> {
    return this.getTasksByStatus('completed');
  },

  async getOverdueTasks(): Promise<MedicalTask[]> {
    const tasks = await this.getMedicalTasks();
    const now = new Date();
    return tasks.filter(task =>
      task.dueDate &&
      new Date(task.dueDate) < now &&
      task.status !== 'completed'
    );
  },

  async getTasksByPatient(patientId: string): Promise<MedicalTask[]> {
    const tasks = await this.getMedicalTasks();
    return tasks.filter(task => task.patientId === patientId);
  },

  async createMedicalTask(task: Omit<MedicalTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<MedicalTask> {
    const newTask = {
      ...task,
      id: `TASK-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return httpClient.post<MedicalTask>('/medicalTasks', newTask);
  },

  async updateMedicalTask(id: string, task: Partial<MedicalTask>): Promise<MedicalTask> {
    const updatedTask = {
      ...task,
      updatedAt: new Date().toISOString(),
      ...(task.status === 'completed' && !task.completedAt ? { completedAt: new Date().toISOString() } : {}),
    };
    return httpClient.put<MedicalTask>(`/medicalTasks/${id}`, updatedTask);
  },

  async completeMedicalTask(id: string, notes?: string): Promise<MedicalTask> {
    return this.updateMedicalTask(id, {
      status: 'completed',
      completedAt: new Date().toISOString(),
      ...(notes && { notes }),
    });
  },

  async deleteMedicalTask(id: string): Promise<void> {
    return httpClient.delete<void>(`/medicalTasks/${id}`);
  },

  async searchMedicalTasks(query: string): Promise<MedicalTask[]> {
    const tasks = await this.getMedicalTasks();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      task.description?.toLowerCase().includes(query.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(query.toLowerCase()) ||
      task.type.toLowerCase().includes(query.toLowerCase())
    );
  },
};