import { httpClient } from './index';
import type { Appointment } from '@/shared/types/medical';

export const appointmentsApi = {
  async getAppointments(): Promise<Appointment[]> {
    return httpClient.get<Appointment[]>('/appointments');
  },

  async getAppointment(id: string): Promise<Appointment> {
    return httpClient.get<Appointment>(`/appointments/${id}`);
  },

  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    const appointments = await this.getAppointments();
    return appointments.filter(appointment => appointment.patientId === patientId);
  },

  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    const appointments = await this.getAppointments();
    return appointments.filter(appointment => appointment.doctorId === doctorId);
  },

  async getTodaysAppointments(): Promise<Appointment[]> {
    const appointments = await this.getAppointments();
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(appointment =>
      appointment.dateTime.startsWith(today)
    );
  },

  async createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    const newAppointment = {
      ...appointment,
      id: `APT-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return httpClient.post<Appointment>('/appointments', newAppointment);
  },

  async updateAppointment(id: string, appointment: Partial<Appointment>): Promise<Appointment> {
    const updatedAppointment = {
      ...appointment,
      updatedAt: new Date().toISOString(),
    };
    return httpClient.put<Appointment>(`/appointments/${id}`, updatedAppointment);
  },

  async deleteAppointment(id: string): Promise<void> {
    return httpClient.delete<void>(`/appointments/${id}`);
  },

  async searchAppointments(query: string): Promise<Appointment[]> {
    const appointments = await this.getAppointments();
    return appointments.filter(appointment =>
      appointment.patient.fullName.toLowerCase().includes(query.toLowerCase()) ||
      appointment.doctor.fullName.toLowerCase().includes(query.toLowerCase()) ||
      appointment.type.toLowerCase().includes(query.toLowerCase()) ||
      appointment.reason.toLowerCase().includes(query.toLowerCase())
    );
  },
};