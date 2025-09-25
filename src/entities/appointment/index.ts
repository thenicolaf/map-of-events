export interface Appointment {
  id: number
  patientId: number
  doctorId: number
  title: string
  description: string
  scheduledAt: string
  duration: number // minutes
  status: "scheduled" | "in-progress" | "completed" | "cancelled"
  type: "routine" | "follow-up" | "consultation" | "emergency"
}