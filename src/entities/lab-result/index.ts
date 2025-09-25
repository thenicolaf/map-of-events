export interface LabResult {
  id: number
  patientId: number
  testType: string
  category: "hematology" | "chemistry" | "endocrinology" | "microbiology"
  results: Record<string, any>
  status: "pending" | "completed" | "critical"
  orderedAt: string
  completedAt?: string
  doctorId: number
  notes?: string
}