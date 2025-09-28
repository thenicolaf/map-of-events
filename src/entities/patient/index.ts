// Re-export from shared types for consistency
export type { Patient, Address, EmergencyContact, MedicalHistory, Allergy, Medication, InsuranceInfo } from '@/shared/types/medical';
import type { Patient } from '@/shared/types/medical';
import { patientSchema, validateEntity } from '@/shared/lib/validations';

// Patient factory for creating new instances
export const createPatient = (data: Partial<Patient>): Patient => {
  const now = new Date().toISOString();
  return {
    id: data.id || `P-${Date.now()}`,
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    fullName: data.fullName || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
    email: data.email || '',
    phone: data.phone || '',
    dateOfBirth: data.dateOfBirth || '',
    gender: data.gender || 'other',
    address: data.address || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    emergencyContact: data.emergencyContact || {
      name: '',
      relationship: '',
      phone: ''
    },
    medicalHistory: data.medicalHistory || [],
    allergies: data.allergies || [],
    medications: data.medications || [],
    insuranceInfo: data.insuranceInfo || {
      provider: '',
      policyNumber: '',
      expirationDate: ''
    },
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    ...data
  };
};

// Patient validation function
export const validatePatient = (data: unknown) => {
  return validateEntity<Patient>(patientSchema, data);
};

// Patient creation with validation
export const createValidatedPatient = (data: Partial<Patient>): { success: boolean; patient?: Patient; errors?: unknown } => {
  const patient = createPatient(data);
  const validation = validatePatient(patient);
  if (validation.success) {
    return { success: true, patient: validation.data };
  } else {
    return { success: false, errors: validation.errors };
  }
};