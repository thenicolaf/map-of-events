import { httpClient } from './index';

export interface DashboardStats {
  activePatients: number;
  criticalAlerts: number;
  admissionsToday: number;
  pendingTasks: number;
  completedTasks: number;
  appointmentsToday: number;
  lastUpdated: string;
}

export const dashboardApi = {
  async getDashboardStats(): Promise<DashboardStats> {
    return httpClient.get<DashboardStats>('/dashboardStats');
  },

  async updateDashboardStats(stats: Partial<DashboardStats>): Promise<DashboardStats> {
    const updatedStats = {
      ...stats,
      lastUpdated: new Date().toISOString(),
    };
    return httpClient.put<DashboardStats>('/dashboardStats', updatedStats);
  },
};