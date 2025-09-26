import { NextRequest, NextResponse } from 'next/server'
import { patientFormDataSchema, appointmentFormDataSchema, labTestFormDataSchema } from '@/shared/lib/validations'

// Helper to save file (mock implementation)
async function saveFile(file: File): Promise<string> {
  // In a real application, you would:
  // 1. Generate a unique filename
  // 2. Save to cloud storage (AWS S3, Cloudinary, etc.)
  // 3. Return the file URL or path

  // For demo purposes, we'll just return a mock URL
  const timestamp = Date.now()
  const extension = file.name.split('.').pop()
  return `/uploads/${timestamp}.${extension}`
}

// Helper to determine form type and validate accordingly
function validateFormData(formData: FormData, formType: string) {
  const data = {
    patientName: formData.get('patientName') as string,
    appointmentNotes: formData.get('appointmentNotes') as string,
  }

  switch (formType) {
    case 'patient':
      return patientFormDataSchema.parse(data)
    case 'appointment':
      return appointmentFormDataSchema.parse(data)
    case 'lab-test':
      return labTestFormDataSchema.parse(data)
    default:
      throw new Error('Invalid form type')
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const formType = formData.get('formType') as string

    if (!formType) {
      return NextResponse.json(
        { success: false, error: 'Form type is required' },
        { status: 400 }
      )
    }

    // Validate form data
    const validatedData = validateFormData(formData, formType)

    // Handle file upload if present
    let fileUrl: string | null = null
    const file = formData.get('documentFile') as File

    if (file && file.size > 0) {
      // Validate file
      const maxSize = 5 * 1024 * 1024 // 5MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'text/plain']

      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, error: 'File size must be less than 5MB' },
          { status: 400 }
        )
      }

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: 'File type must be JPEG, PNG, PDF, or TXT' },
          { status: 400 }
        )
      }

      fileUrl = await saveFile(file)
    }

    // Process the form submission based on type
    const submissionData = {
      ...validatedData,
      fileUrl,
      formType,
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substring(2, 15), // Generate random ID
    }

    // In a real application, you would:
    // 1. Save to database
    // 2. Send notifications
    // 3. Trigger workflows
    // 4. Log the submission

    // Mock processing delay
    await new Promise(resolve => setTimeout(resolve, 500))

    console.log('Form submission processed:', submissionData)

    return NextResponse.json({
      success: true,
      message: getSuccessMessage(formType),
      data: submissionData
    })

  } catch (error) {
    console.error('Form submission error:', error)

    if (error instanceof Error) {
      // Handle validation errors
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

function getSuccessMessage(formType: string): string {
  switch (formType) {
    case 'patient':
      return 'Patient record has been successfully created!'
    case 'appointment':
      return 'Appointment has been successfully scheduled!'
    case 'lab-test':
      return 'Lab test has been successfully requested!'
    default:
      return 'Form has been successfully submitted!'
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}