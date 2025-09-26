export interface LabTestValue {
  value: string | number
  unit?: string
  referenceRange?: string
  status: "normal" | "abnormal" | "critical"
}

export interface LabResult {
  id: number
  patientId: number
  testType: string
  category: "hematology" | "chemistry" | "endocrinology" | "microbiology"
  results: Record<string, LabTestValue>
  status: "pending" | "completed" | "critical"
  orderedAt: string
  completedAt?: string
  doctorId: number
  notes?: string
}