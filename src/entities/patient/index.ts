export interface Patient {
  id: number
  name: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  medicalHistory?: string[]
  assignedDoctorId: number
  status: "active" | "inactive" | "critical"
}