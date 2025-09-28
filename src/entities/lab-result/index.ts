// Re-export from shared types for consistency
export type { LabResult, LabCategory, LabStatus, TestResult, Attachment } from '@/shared/types/medical';
import type { LabResult } from '@/shared/types/medical';

// LabResult factory for creating new instances
export const createLabResult = (data: Partial<LabResult>): LabResult => {
  const now = new Date().toISOString();
  return {
    id: data.id || `LAB-${Date.now()}`,
    patientId: data.patientId || '',
    patient: data.patient || {
      id: '',
      firstName: '',
      lastName: '',
      fullName: ''
    },
    testType: data.testType || '',
    testCategory: data.testCategory || 'chemistry',
    orderedBy: data.orderedBy || '',
    orderedDate: data.orderedDate || now,
    collectedDate: data.collectedDate,
    resultDate: data.resultDate,
    status: data.status || 'pending',
    priority: data.priority || 'normal',
    labId: data.labId || '',
    results: data.results || [],
    notes: data.notes,
    attachments: data.attachments || [],
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    ...data
  };
};