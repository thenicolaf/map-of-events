import { z } from 'zod';

// Basic schemas
export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid zip code format'),
  country: z.string().min(1, 'Country is required')
});

export const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone format'),
  email: z.string().email().optional()
});

export const medicalHistorySchema = z.object({
  id: z.string(),
  condition: z.string().min(1, 'Condition is required'),
  diagnosisDate: z.string().datetime(),
  status: z.enum(['active', 'resolved', 'chronic']),
  notes: z.string().optional()
});

export const allergySchema = z.object({
  id: z.string(),
  allergen: z.string().min(1, 'Allergen is required'),
  severity: z.enum(['mild', 'moderate', 'severe']),
  reaction: z.string().optional(),
  notes: z.string().optional()
});

export const medicationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Medication name is required'),
  dosage: z.string().min(1, 'Dosage is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  prescribedBy: z.string().min(1, 'Prescriber is required'),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  purpose: z.string().min(1, 'Purpose is required'),
  notes: z.string().optional()
});

export const insuranceInfoSchema = z.object({
  provider: z.string().min(1, 'Provider is required'),
  policyNumber: z.string().min(1, 'Policy number is required'),
  expirationDate: z.string().datetime()
});

// Patient schema
export const patientSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone format'),
  dateOfBirth: z.string().datetime(),
  gender: z.enum(['male', 'female', 'other']),
  address: addressSchema,
  emergencyContact: emergencyContactSchema,
  medicalHistory: z.array(medicalHistorySchema),
  allergies: z.array(allergySchema),
  medications: z.array(medicationSchema),
  insuranceInfo: insuranceInfoSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

// Doctor schema
export const doctorSchema = z.object({
  id: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  fullName: z.string().min(1, 'Full name is required'),
  title: z.string().min(1, 'Title is required'),
  specialty: z.enum([
    'cardiology', 'dermatology', 'endocrinology', 'gastroenterology',
    'neurology', 'oncology', 'orthopedics', 'pediatrics', 'psychiatry',
    'radiology', 'surgery', 'family-medicine', 'internal-medicine', 'emergency-medicine'
  ]),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone format'),
  licenseNumber: z.string().min(1, 'License number is required'),
  department: z.string().min(1, 'Department is required'),
  yearsOfExperience: z.number().min(0, 'Years of experience cannot be negative'),
  education: z.array(z.object({
    degree: z.string().min(1, 'Degree is required'),
    institution: z.string().min(1, 'Institution is required'),
    year: z.string().min(1, 'Year is required')
  })),
  certifications: z.array(z.object({
    name: z.string().min(1, 'Certification name is required'),
    issuingBody: z.string().min(1, 'Issuing body is required'),
    dateIssued: z.string().datetime(),
    expirationDate: z.string().datetime().optional()
  })),
  availability: z.array(z.object({
    dayOfWeek: z.number().min(0).max(6),
    startTime: z.string(),
    endTime: z.string(),
    isAvailable: z.boolean()
  })),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

// Appointment schema
export const appointmentSchema = z.object({
  id: z.string(),
  patientId: z.string().min(1, 'Patient ID is required'),
  patient: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    fullName: z.string()
  }),
  doctorId: z.string().min(1, 'Doctor ID is required'),
  doctor: doctorSchema,
  type: z.enum(['consultation', 'follow-up', 'check-up', 'surgery', 'therapy', 'emergency']),
  status: z.enum(['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show', 'rescheduled']),
  dateTime: z.string().datetime(),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  location: z.string().min(1, 'Location is required'),
  notes: z.string().optional(),
  reason: z.string().min(1, 'Reason is required'),
  priority: z.enum(['low', 'normal', 'high', 'urgent', 'stat']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

// Lab Result schema
export const testResultSchema = z.object({
  parameter: z.string().min(1, 'Parameter is required'),
  value: z.union([z.string(), z.number()]),
  unit: z.string().optional(),
  referenceRange: z.string().min(1, 'Reference range is required'),
  status: z.enum(['normal', 'abnormal', 'critical', 'high', 'low']),
  flag: z.string().optional()
});

export const labResultSchema = z.object({
  id: z.string(),
  patientId: z.string().min(1, 'Patient ID is required'),
  patient: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    fullName: z.string()
  }),
  testType: z.string().min(1, 'Test type is required'),
  testCategory: z.enum([
    'hematology', 'chemistry', 'microbiology', 'immunology',
    'pathology', 'genetics', 'endocrinology', 'cardiology', 'oncology'
  ]),
  orderedBy: z.string().min(1, 'Ordered by is required'),
  orderedDate: z.string().datetime(),
  collectedDate: z.string().datetime().optional(),
  resultDate: z.string().datetime().optional(),
  status: z.enum(['ordered', 'collected', 'in-progress', 'completed', 'cancelled', 'critical', 'pending']),
  priority: z.enum(['low', 'normal', 'high', 'urgent', 'stat']),
  labId: z.string().min(1, 'Lab ID is required'),
  results: z.array(testResultSchema),
  notes: z.string().optional(),
  attachments: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    size: z.number(),
    url: z.string(),
    uploadedAt: z.string().datetime()
  })).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

// Medical Task schema
export const medicalTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['follow-up', 'call-patient', 'review-results', 'insurance-verification', 'schedule-appointment', 'documentation', 'referral']),
  priority: z.enum(['low', 'normal', 'high', 'urgent', 'stat']),
  status: z.enum(['pending', 'in-progress', 'completed', 'cancelled', 'overdue']),
  assignedTo: z.string().min(1, 'Assigned to is required'),
  assignedBy: z.string().min(1, 'Assigned by is required'),
  patientId: z.string().optional(),
  appointmentId: z.string().optional(),
  dueDate: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

// Export types inferred from schemas
export type PatientFormData = z.infer<typeof patientSchema>;
export type DoctorFormData = z.infer<typeof doctorSchema>;
export type AppointmentFormData = z.infer<typeof appointmentSchema>;
export type LabResultFormData = z.infer<typeof labResultSchema>;
export type MedicalTaskFormData = z.infer<typeof medicalTaskSchema>;

// Simple form schemas for basic forms
export const patientFormDataSchema = z.object({
  patientName: z.string().min(1, 'Patient name is required'),
  appointmentNotes: z.string().optional()
});

export const appointmentFormDataSchema = z.object({
  patientName: z.string().min(1, 'Patient name is required'),
  appointmentNotes: z.string().optional()
});

export const labTestFormDataSchema = z.object({
  patientName: z.string().min(1, 'Patient name is required'),
  appointmentNotes: z.string().optional()
});