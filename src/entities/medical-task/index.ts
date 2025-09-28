// Re-export from shared types for consistency
export type { MedicalTask, TaskType, TaskStatus, Priority } from '@/shared/types/medical';
import type { MedicalTask } from '@/shared/types/medical';

// MedicalTask factory for creating new instances
export const createMedicalTask = (data: Partial<MedicalTask>): MedicalTask => {
  const now = new Date().toISOString();
  return {
    id: data.id || `TASK-${Date.now()}`,
    title: data.title || '',
    description: data.description,
    type: data.type || 'follow-up',
    priority: data.priority || 'normal',
    status: data.status || 'pending',
    assignedTo: data.assignedTo || '',
    assignedBy: data.assignedBy || '',
    patientId: data.patientId,
    appointmentId: data.appointmentId,
    dueDate: data.dueDate,
    completedAt: data.completedAt,
    notes: data.notes,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    ...data
  };
};