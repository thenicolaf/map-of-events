import { z } from 'zod';

// Zod validation schema for MedicalTask
export const medicalTaskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),

  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),

  type: z.enum(['follow-up', 'call-patient', 'review-results', 'insurance-verification', 'schedule-appointment', 'documentation', 'referral']).default('follow-up'),

  priority: z.enum(['low', 'normal', 'high', 'urgent', 'stat']),

  status: z.enum(['pending', 'in-progress', 'completed', 'cancelled', 'overdue']),

  assignedTo: z.string()
    .min(1, 'Assigned to is required'),

  assignedBy: z.string()
    .min(1, 'Assigned by is required'),

  patientId: z.string()
    .optional(),

  appointmentId: z.string()
    .optional(),

  dueDate: z.string()
    .datetime('Invalid due date format')
    .optional(),

  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
});

export type MedicalTaskFormData = z.infer<typeof medicalTaskSchema>;

// Schema for creating a new task (excludes computed fields)
export const createMedicalTaskSchema = medicalTaskSchema.omit({
  // These fields are computed/set by the system
});

// Schema for updating an existing task (all fields optional except required ones)
export const updateMedicalTaskSchema = medicalTaskSchema.partial();

// Default values for the form
export const defaultMedicalTaskValues: Partial<MedicalTaskFormData> = {
  type: 'follow-up',
  priority: 'normal',
  status: 'pending',
  assignedTo: 'Dr. Smith',
  assignedBy: 'Dr. Smith',
  dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
};