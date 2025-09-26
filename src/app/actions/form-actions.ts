'use server'

import { patientFormDataSchema, appointmentFormDataSchema, labTestFormDataSchema } from '@/shared/lib/validations'

// Types for action states
export interface ActionState {
  success?: boolean
  message?: string
  errors?: Record<string, string[]>
  data?: Record<string, unknown>
}

// Helper function to process file upload
async function processFile(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null

  // Validate file
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'text/plain']

  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB')
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error('File type must be JPEG, PNG, PDF, or TXT')
  }

  // In a real application, save to storage service
  // For demo, return mock URL
  const timestamp = Date.now()
  const extension = file.name.split('.').pop()
  return `/uploads/${timestamp}.${extension}`
}

// Patient form action
export async function submitPatientAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const rawData = {
      patientName: formData.get('patientName') as string,
      appointmentNotes: formData.get('appointmentNotes') as string,
    }

    // Validate data
    const validatedData = patientFormDataSchema.parse(rawData)

    // Process file if present
    const file = formData.get('documentFile') as File | null
    const fileUrl = await processFile(file)

    // Mock API call - in real app, save to database
    const submissionData = {
      ...validatedData,
      fileUrl,
      type: 'patient',
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substring(2, 15),
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800))

    console.log('Patient submission processed:', submissionData)

    return {
      success: true,
      message: 'Patient record has been successfully created!',
      data: submissionData
    }

  } catch (error) {
    console.error('Patient submission error:', error)

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
        errors: { form: [error.message] }
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred while creating patient record',
      errors: { form: ['An unexpected error occurred'] }
    }
  }
}

// Appointment form action
export async function submitAppointmentAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const rawData = {
      patientName: formData.get('patientName') as string,
      appointmentNotes: formData.get('appointmentNotes') as string,
    }

    // Validate data
    const validatedData = appointmentFormDataSchema.parse(rawData)

    // Process file if present
    const file = formData.get('documentFile') as File | null
    const fileUrl = await processFile(file)

    // Mock API call - in real app, save to database
    const submissionData = {
      ...validatedData,
      fileUrl,
      type: 'appointment',
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substring(2, 15),
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800))

    console.log('Appointment submission processed:', submissionData)

    return {
      success: true,
      message: 'Appointment has been successfully scheduled!',
      data: submissionData
    }

  } catch (error) {
    console.error('Appointment submission error:', error)

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
        errors: { form: [error.message] }
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred while scheduling appointment',
      errors: { form: ['An unexpected error occurred'] }
    }
  }
}

// Lab test form action
export async function submitLabTestAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    const rawData = {
      patientName: formData.get('patientName') as string,
      appointmentNotes: formData.get('appointmentNotes') as string,
    }

    // Validate data
    const validatedData = labTestFormDataSchema.parse(rawData)

    // Process file if present
    const file = formData.get('documentFile') as File | null
    const fileUrl = await processFile(file)

    // Mock API call - in real app, save to database
    const submissionData = {
      ...validatedData,
      fileUrl,
      type: 'lab-test',
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substring(2, 15),
    }

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800))

    console.log('Lab test submission processed:', submissionData)

    return {
      success: true,
      message: 'Lab test has been successfully requested!',
      data: submissionData
    }

  } catch (error) {
    console.error('Lab test submission error:', error)

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
        errors: { form: [error.message] }
      }
    }

    return {
      success: false,
      message: 'An unexpected error occurred while requesting lab test',
      errors: { form: ['An unexpected error occurred'] }
    }
  }
}