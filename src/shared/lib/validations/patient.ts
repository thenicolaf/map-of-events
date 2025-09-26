import { z } from 'zod'

// File validation helper
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'text/plain']

const fileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, 'File size must be less than 5MB')
  .refine(
    (file) => ACCEPTED_FILE_TYPES.includes(file.type),
    'File type must be JPEG, PNG, PDF, or TXT'
  )

// Patient form schema
export const patientFormSchema = z.object({
  patientName: z
    .string()
    .min(2, 'Patient name must be at least 2 characters')
    .max(100, 'Patient name must be less than 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Patient name can only contain letters, spaces, hyphens, and apostrophes'),

  appointmentNotes: z
    .string()
    .min(10, 'Appointment notes must be at least 10 characters')
    .max(1000, 'Appointment notes must be less than 1000 characters'),

  documentFile: z
    .union([fileSchema, z.null(), z.undefined()])
    .optional()
    .transform((file) => file || null)
})

export type PatientFormData = z.infer<typeof patientFormSchema>

// For server-side validation from FormData
export const patientFormDataSchema = z.object({
  patientName: z.string().min(2, 'Patient name must be at least 2 characters'),
  appointmentNotes: z.string().min(10, 'Appointment notes must be at least 10 characters'),
})

export type PatientFormDataServer = z.infer<typeof patientFormDataSchema>