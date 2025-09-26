import { usersApi } from "@/shared/api";
import type { User } from "@/entities";
import { DashboardActions } from "./DashboardActions";
import { AppointmentCard } from "@/shared/ui/appointment-card";
import { StatsCard } from "@/shared/ui/stats-card";
import { TasksSidebar } from "@/shared/ui/tasks-sidebar";
import { LabResultsTable } from "@/shared/ui/lab-results-table";

interface DashboardData {
  users: User[];
  totalPatients: number;
  totalAppointments: number;
  timestamp: string;
}

async function getDashboardData(): Promise<DashboardData> {
  try {
    const users = await usersApi.getUsers();

    return {
      users: users.slice(0, 5), // Show first 5 users as recent patients
      totalPatients: users.length,
      totalAppointments: Math.floor(Math.random() * 50) + 20, // Mock appointments count
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    // Fallback data in case of API failure
    return {
      users: [],
      totalPatients: 0,
      totalAppointments: 0,
      timestamp: new Date().toISOString(),
    };
  }
}

// Mock data for appointments
const appointments = [
  {
    id: "apt-1",
    type: "Routine Checkup",
    status: "active" as const,
    patient: { name: "Maria Rodriguez", initials: "MR" },
    time: "09:00",
    duration: "30 min",
  },
  {
    id: "apt-2",
    type: "Heart Follow-up",
    status: "progress" as const,
    patient: { name: "John Smith", initials: "JS" },
    time: "09:30",
    duration: "45 min",
  },
  {
    id: "apt-3",
    type: "Consultation",
    status: "scheduled" as const,
    patient: { name: "Emily Chen", initials: "EC" },
    time: "10:15",
    duration: "60 min",
  },
];

// Mock data for tasks
const tasks = [
  {
    id: "1",
    title: "Call Maria Rodriguez about test results",
    time: "10:30 AM",
  },
  { id: "2", title: "Review John Smith's MRI scan", time: "10:30 AM" },
  {
    id: "3",
    title: "Follow up with Emily Chen treatment plan",
    time: "2:00 PM",
  },
  {
    id: "4",
    title: "Complete weekly reports",
    time: "End of day",
    completed: true,
  },
  { id: "5", title: "Check lab results for Robert Johnson", time: "2:00 PM" },
];

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
            {appointments.map((appointment) => (
              <AppointmentCard key={appointment.id} {...appointment} />
            ))}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Active Patients"
            value={247}
            change={{ value: 12, type: "increase", timeframe: "+12 this week" }}
          />
          <StatsCard
            title="Critical Alerts"
            value={3}
            change={{
              value: 2,
              type: "decrease",
              timeframe: "-2 from yesterday",
            }}
          />
          <StatsCard
            title="Admissions Today"
            value={2}
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
            {data.users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {user.phone}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Hidden on mobile and tablets */}
      <div className="hidden xl:block">
        <TasksSidebar tasks={tasks} pendingCount={5} />
      </div>
    </div>
  );
}
