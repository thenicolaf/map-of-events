import { httpClient } from './index';
import type { LabResult } from '@/shared/types/medical';

export const labResultsApi = {
  async getLabResults(): Promise<LabResult[]> {
    return httpClient.get<LabResult[]>('/labResults');
  },

  async getLabResult(id: string): Promise<LabResult> {
    return httpClient.get<LabResult>(`/labResults/${id}`);
  },

  async getLabResultsByPatient(patientId: string): Promise<LabResult[]> {
    const labResults = await this.getLabResults();
    return labResults.filter(result => result.patientId === patientId);
  },

  async getLabResultsByStatus(status: LabResult['status']): Promise<LabResult[]> {
    const labResults = await this.getLabResults();
    return labResults.filter(result => result.status === status);
  },

  async getCriticalResults(): Promise<LabResult[]> {
    const labResults = await this.getLabResults();
    return labResults.filter(result =>
      result.status === 'critical' ||
      result.results.some(r => r.status === 'critical')
    );
  },

  async createLabResult(labResult: Omit<LabResult, 'id' | 'createdAt' | 'updatedAt'>): Promise<LabResult> {
    const newLabResult = {
      ...labResult,
      id: `LAB-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return httpClient.post<LabResult>('/labResults', newLabResult);
  },

  async updateLabResult(id: string, labResult: Partial<LabResult>): Promise<LabResult> {
    const updatedLabResult = {
      ...labResult,
      updatedAt: new Date().toISOString(),
    };
    return httpClient.put<LabResult>(`/labResults/${id}`, updatedLabResult);
  },

  async deleteLabResult(id: string): Promise<void> {
    return httpClient.delete<void>(`/labResults/${id}`);
  },

  async searchLabResults(query: string): Promise<LabResult[]> {
    const labResults = await this.getLabResults();
    return labResults.filter(result =>
      result.patient.fullName.toLowerCase().includes(query.toLowerCase()) ||
      result.testType.toLowerCase().includes(query.toLowerCase()) ||
      result.testCategory.toLowerCase().includes(query.toLowerCase()) ||
      result.orderedBy.toLowerCase().includes(query.toLowerCase())
    );
  },
};