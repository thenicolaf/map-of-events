// Patient related types
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: Address;
  emergencyContact: EmergencyContact;
  medicalHistory: MedicalHistory[];
  allergies: Allergy[];
  medications: Medication[];
  insuranceInfo: InsuranceInfo;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

// Medical History
export interface MedicalHistory {
  id: string;
  condition: string;
  diagnosisDate: string;
  status: 'active' | 'resolved' | 'chronic';
  notes?: string;
}

export interface Allergy {
  id: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction?: string;
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  purpose: string;
  notes?: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  expirationDate: string;
}

// Appointment types
export interface Appointment {
  id: string;
  patientId: string;
  patient: Pick<Patient, 'id' | 'firstName' | 'lastName' | 'fullName'>;
  doctorId: string;
  doctor: Doctor;
  type: AppointmentType;
  status: AppointmentStatus;
  dateTime: string;
  duration: number; // in minutes
  location: string;
  notes?: string;
  reason: string;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export type AppointmentType =
  | 'routine-checkup'
  | 'follow-up'
  | 'consultation'
  | 'emergency'
  | 'surgery'
  | 'therapy'
  | 'diagnostic';

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'no-show'
  | 'rescheduled';

export type Priority = 'low' | 'normal' | 'high' | 'urgent' | 'stat';

// Doctor types
export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  title: string;
  specialty: MedicalSpecialty;
  email: string;
  phone: string;
  licenseNumber: string;
  department: string;
  yearsOfExperience: number;
  education: Education[];
  certifications: Certification[];
  availability: Availability[];
  createdAt: string;
  updatedAt: string;
}

export type MedicalSpecialty =
  | 'cardiology'
  | 'dermatology'
  | 'endocrinology'
  | 'gastroenterology'
  | 'neurology'
  | 'oncology'
  | 'orthopedics'
  | 'pediatrics'
  | 'psychiatry'
  | 'radiology'
  | 'surgery'
  | 'family-medicine'
  | 'internal-medicine'
  | 'emergency-medicine';

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Certification {
  name: string;
  issuingBody: string;
  dateIssued: string;
  expirationDate?: string;
}

export interface Availability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

// Lab Results types
export interface LabResult {
  id: string;
  patientId: string;
  patient: Pick<Patient, 'id' | 'firstName' | 'lastName' | 'fullName'>;
  testType: string;
  testCategory: LabCategory;
  orderedBy: string;
  orderedDate: string;
  collectedDate?: string;
  resultDate?: string;
  status: LabStatus;
  priority: Priority;
  labId: string;
  results: TestResult[];
  notes?: string;
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export type LabCategory =
  | 'hematology'
  | 'chemistry'
  | 'microbiology'
  | 'immunology'
  | 'pathology'
  | 'genetics'
  | 'endocrinology'
  | 'cardiology'
  | 'oncology';

export type LabStatus =
  | 'ordered'
  | 'collected'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'critical'
  | 'pending';

export interface TestResult {
  parameter: string;
  value: string | number;
  unit?: string;
  referenceRange: string;
  status: 'normal' | 'abnormal' | 'critical' | 'high' | 'low';
  flag?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

// Task types for medical workflows
export interface MedicalTask {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  priority: Priority;
  status: TaskStatus;
  assignedTo: string;
  assignedBy: string;
  patientId?: string;
  appointmentId?: string;
  dueDate?: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskType =
  | 'follow-up'
  | 'call-patient'
  | 'review-results'
  | 'insurance-verification'
  | 'schedule-appointment'
  | 'documentation'
  | 'referral';

export type TaskStatus =
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'overdue';