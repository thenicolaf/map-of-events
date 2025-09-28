import {
  patientsApi,
  appointmentsApi,
  medicalTasksApi,
  dashboardApi,
  labResultsApi
} from "@/shared/api";
import type { Patient, Appointment, MedicalTask, LabResult } from "@/shared/types/medical";
import type { DashboardStats } from "@/shared/api/dashboard";
import { DashboardActions } from "./DashboardActions";
import { AppointmentCard } from "@/shared/ui/appointment-card";
import { StatsCard } from "@/shared/ui/stats-card";
import { ClientTaskManager } from "./ClientTaskManager";
import { LabResultsTable } from "@/shared/ui/lab-results-table";

interface DashboardData {
  patients: Patient[];
  todaysAppointments: Appointment[];
  pendingTasks: MedicalTask[];
  completedTasks: MedicalTask[];
  stats: DashboardStats;
  labResults: LabResult[];
}

async function getDashboardData(): Promise<DashboardData> {
  try {
    // Fetch all data in parallel for better performance
    const [patients, appointments, tasks, stats, labResults] = await Promise.all([
      patientsApi.getPatients(),
      appointmentsApi.getTodaysAppointments(),
      medicalTasksApi.getMedicalTasks(),
      dashboardApi.getDashboardStats(),
      labResultsApi.getLabResults()
    ]);

    const pendingTasks = tasks.filter(task => task.status === 'pending');
    const completedTasks = tasks.filter(task => task.status === 'completed');

    return {
      patients: patients.slice(0, 5), // Show first 5 patients as recent
      todaysAppointments: appointments.slice(0, 3), // Show first 3 today's appointments
      pendingTasks,
      completedTasks,
      stats,
      labResults: labResults.slice(0, 10), // Show recent lab results
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    // Fallback data in case of API failure
    return {
      patients: [],
      todaysAppointments: [],
      pendingTasks: [],
      completedTasks: [],
      stats: {
        activePatients: 0,
        criticalAlerts: 0,
        admissionsToday: 0,
        pendingTasks: 0,
        completedTasks: 0,
        appointmentsToday: 0,
        lastUpdated: new Date().toISOString(),
      },
      labResults: [],
    };
  }
}

// Helper function to transform appointment data for AppointmentCard component
function transformAppointmentForCard(appointment: Appointment) {
  const date = new Date(appointment.dateTime);
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return {
    id: appointment.id,
    type: appointment.reason,
    status: appointment.status === 'in-progress' ? 'progress' as const :
            appointment.status === 'scheduled' ? 'scheduled' as const : 'active' as const,
    patient: {
      name: appointment.patient.fullName,
      initials: `${appointment.patient.firstName[0]}${appointment.patient.lastName[0]}`
    },
    time,
    duration: `${appointment.duration} min`,
  };
}


export default async function Dashboard() {
  const data = await getDashboardData();

  return (
    <div className="flex">
      <div className="flex-1 p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Doctor&apos;s Dashboard</h1>
          <DashboardActions />
        </div>

        {/* Today's Appointments */}
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Today&apos;s Appointments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.todaysAppointments.length > 0 ? (
              data.todaysAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} {...transformAppointmentForCard(appointment)} />
              ))
            ) : (
              <div className="col-span-3 text-center text-muted-foreground p-8">
                No appointments scheduled for today
              </div>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Active Patients"
            value={data.stats.activePatients}
            change={{ value: 12, type: "increase", timeframe: "+12 this week" }}
          />
          <StatsCard
            title="Critical Alerts"
            value={data.stats.criticalAlerts}
            change={{
              value: 2,
              type: "decrease",
              timeframe: "-2 from yesterday",
            }}
          />
          <StatsCard
            title="Admissions Today"
            value={data.stats.admissionsToday}
            change={{
              value: 2,
              type: "increase",
              timeframe: "+2 from yesterday",
            }}
          />
        </div>

        {/* Lab Results */}
        <LabResultsTable />

        {/* Recent Patients */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Recent Patients (SSR)</h3>
          <div className="space-y-3">
            {data.patients.map((patient) => (
              <div
                key={patient.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div>
                  <p className="font-medium">{patient.fullName}</p>
                  <p className="text-sm text-muted-foreground">{patient.email}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {patient.phone}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Hidden on mobile and tablets */}
      <div className="hidden xl:block">
        <ClientTaskManager
          initialTasks={[...data.pendingTasks, ...data.completedTasks]}
        />
      </div>
    </div>
  );
}
