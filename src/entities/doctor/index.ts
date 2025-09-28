// Re-export from shared types for consistency
export type { Doctor, MedicalSpecialty, Education, Certification, Availability } from '@/shared/types/medical';
import type { Doctor } from '@/shared/types/medical';

// Doctor factory for creating new instances
export const createDoctor = (data: Partial<Doctor>): Doctor => {
  const now = new Date().toISOString();
  return {
    id: data.id || `DOC-${Date.now()}`,
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    fullName: data.fullName || `${data.firstName || ''} ${data.lastName || ''}`.trim(),
    title: data.title || 'Dr.',
    specialty: data.specialty || 'family-medicine',
    email: data.email || '',
    phone: data.phone || '',
    licenseNumber: data.licenseNumber || '',
    department: data.department || '',
    yearsOfExperience: data.yearsOfExperience || 0,
    education: data.education || [],
    certifications: data.certifications || [],
    availability: data.availability || [],
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    ...data
  };
};