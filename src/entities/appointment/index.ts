// Re-export from shared types for consistency
export type { Appointment, AppointmentType, AppointmentStatus } from '@/shared/types/medical';
import type { Appointment } from '@/shared/types/medical';

// Appointment factory for creating new instances
export const createAppointment = (data: Partial<Appointment>): Appointment => {
  const now = new Date().toISOString();
  return {
    id: data.id || `APT-${Date.now()}`,
    patientId: data.patientId || '',
    patient: data.patient || {
      id: data.patientId || '',
      firstName: '',
      lastName: '',
      fullName: ''
    },
    doctorId: data.doctorId || '',
    doctor: data.doctor || {
      id: data.doctorId || '',
      firstName: '',
      lastName: '',
      fullName: '',
      title: '',
      specialty: 'family-medicine',
      email: '',
      phone: '',
      licenseNumber: '',
      department: '',
      yearsOfExperience: 0,
      education: [],
      certifications: [],
      availability: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    dateTime: data.dateTime || now,
    duration: data.duration || 30,
    type: data.type || 'consultation',
    status: data.status || 'scheduled',
    reason: data.reason || '',
    priority: data.priority || 'normal',
    location: data.location || '',
    notes: data.notes,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    ...data
  };
};