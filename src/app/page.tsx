import { Button } from "@/components/ui/button";
import { Navigation } from "@/shared/ui/navigation";
import { usersApi } from "@/shared/api";
import type { User } from "@/entities";

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
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    // Fallback data in case of API failure
    return {
      users: [],
      totalPatients: 0,
      totalAppointments: 0,
      timestamp: new Date().toISOString()
    };
  }
}

export default async function Dashboard() {
  const data = await getDashboardData();

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        title="Medical Dashboard"
        actionButton={<Button>Profile</Button>}
      />

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold mb-2">Total Patients</h3>
            <p className="text-3xl font-bold text-primary">{data.totalPatients}</p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold mb-2">Appointments Today</h3>
            <p className="text-3xl font-bold text-primary">{data.totalAppointments}</p>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border">
            <h3 className="text-lg font-semibold mb-2">Server Rendered</h3>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date(data.timestamp).toLocaleTimeString()}
            </p>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <h3 className="text-lg font-semibold mb-4">Recent Patients (SSR)</h3>
          <div className="space-y-3">
            {data.users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
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
      </main>
    </div>
  );
}
