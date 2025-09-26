import { postsApi } from "@/shared/api";
import type { Post } from "@/entities";
import { AppointmentActions } from "./AppointmentActions";
import { ClientPagination } from "./ClientPagination";

interface Appointment extends Post {
  doctorName: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
}

async function getAppointments(): Promise<Appointment[]> {
  try {
    const posts = await postsApi.getPosts();

    // Transform posts into appointments with additional fields
    return posts.slice(0, 20).map((post, index) => ({
      ...post,
      doctorName: `Dr. ${
        ["Smith", "Johnson", "Brown", "Davis", "Miller"][index % 5]
      }`,
      date: new Date(Date.now() + index * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      time: `${9 + Math.floor(index / 2)}:${index % 2 === 0 ? "00" : "30"}`,
      status: (["scheduled", "completed", "cancelled"] as const)[index % 3],
    }));
  } catch (error) {
    console.error("Failed to fetch appointments:", error);
    return []; // Return empty array on error for SSG fallback
  }
}

export default async function AppointmentsPage() {
  const appointments = await getAppointments();

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30";
      case "completed":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
      case "cancelled":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
    }
  };

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
