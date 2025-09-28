import { httpClient } from './index';
import type { Doctor } from '@/shared/types/medical';

export const doctorsApi = {
  async getDoctors(): Promise<Doctor[]> {
    return httpClient.get<Doctor[]>('/doctors');
  },

  async getDoctor(id: string): Promise<Doctor> {
    return httpClient.get<Doctor>(`/doctors/${id}`);
  },

  async getDoctorsBySpecialty(specialty: Doctor['specialty']): Promise<Doctor[]> {
    const doctors = await this.getDoctors();
    return doctors.filter(doctor => doctor.specialty === specialty);
  },

  async getAvailableDoctors(dayOfWeek: number): Promise<Doctor[]> {
    const doctors = await this.getDoctors();
    return doctors.filter(doctor =>
      doctor.availability.some(avail =>
        avail.dayOfWeek === dayOfWeek && avail.isAvailable
      )
    );
  },

  async createDoctor(doctor: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>): Promise<Doctor> {
    const newDoctor = {
      ...doctor,
      id: `D-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return httpClient.post<Doctor>('/doctors', newDoctor);
  },

  async updateDoctor(id: string, doctor: Partial<Doctor>): Promise<Doctor> {
    const updatedDoctor = {
      ...doctor,
      updatedAt: new Date().toISOString(),
    };
    return httpClient.put<Doctor>(`/doctors/${id}`, updatedDoctor);
  },

  async deleteDoctor(id: string): Promise<void> {
    return httpClient.delete<void>(`/doctors/${id}`);
  },

  async searchDoctors(query: string): Promise<Doctor[]> {
    const doctors = await this.getDoctors();
    return doctors.filter(doctor =>
      doctor.firstName.toLowerCase().includes(query.toLowerCase()) ||
      doctor.lastName.toLowerCase().includes(query.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(query.toLowerCase()) ||
      doctor.department.toLowerCase().includes(query.toLowerCase())
    );
  },
};