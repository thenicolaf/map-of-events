import { httpClient } from './index';
import type { Patient } from '@/shared/types/medical';

export const patientsApi = {
  async getPatients(): Promise<Patient[]> {
    return httpClient.get<Patient[]>('/patients');
  },

  async getPatient(id: string): Promise<Patient> {
    return httpClient.get<Patient>(`/patients/${id}`);
  },

  async createPatient(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> {
    const newPatient = {
      ...patient,
      id: `P-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return httpClient.post<Patient>('/patients', newPatient);
  },

  async updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
    const updatedPatient = {
      ...patient,
      updatedAt: new Date().toISOString(),
    };
    return httpClient.put<Patient>(`/patients/${id}`, updatedPatient);
  },

  async deletePatient(id: string): Promise<void> {
    return httpClient.delete<void>(`/patients/${id}`);
  },

  async searchPatients(query: string): Promise<Patient[]> {
    const patients = await this.getPatients();
    return patients.filter(patient =>
      patient.firstName.toLowerCase().includes(query.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(query.toLowerCase()) ||
      patient.email.toLowerCase().includes(query.toLowerCase()) ||
      patient.phone.includes(query)
    );
  },
};