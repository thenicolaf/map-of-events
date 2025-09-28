import { appointmentsApi } from "@/shared/api";
import type { Appointment } from "@/shared/types/medical";
import { AppointmentActions } from "./AppointmentActions";
import { ClientPagination } from "./ClientPagination";

async function getAppointments(): Promise<Appointment[]> {
  try {
    const appointments = await appointmentsApi.getAppointments();
    return appointments;
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    return []; // Return empty array on error for SSG fallback
  }
}

export default async function AppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Appointments</h1>
            <p className="text-sm text-muted-foreground">
              Static Site Generation (SSG) - Built at build time
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Total: {appointments.length} appointments
            </div>
            <AppointmentActions />
          </div>
        </div>

        <ClientPagination appointments={appointments} />

        <div className="bg-muted/50 rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            📊 This page uses Static Site Generation (SSG) - Data is fetched at build time with client-side pagination
          </p>
        </div>
      </main>
    </div>
  );
}

// This ensures the page is statically generated at build time
export const dynamic = "force-static";
