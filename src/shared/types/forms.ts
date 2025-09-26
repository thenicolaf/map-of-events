import type { z } from 'zod';

// Form state and validation types
export interface FormState<T = Record<string, unknown>> {
  data: T;
  errors: Partial<Record<keyof T, string[]>>;
  isValid: boolean;
  isDirty: boolean;
  isSubmitting: boolean;
  isSubmitted: boolean;
}

export interface FormField<T = unknown> {
  name: string;
  value: T;
  error?: string;
  touched: boolean;
  required: boolean;
  disabled: boolean;
}

// Server action response types
export interface ActionState<T = unknown> {
  data?: T;
  errors?: Record<string, string[]>;
  message?: string;
  success: boolean;
}

// Form input types
export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'datetime-local'
  | 'time'
  | 'file'
  | 'hidden'
  | 'radio'
  | 'checkbox'
  | 'select'
  | 'textarea';

export interface BaseInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  error?: string;
  hint?: string;
  className?: string;
}

export interface TextInputProps extends BaseInputProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface NumberInputProps extends BaseInputProps {
  value?: number;
  onChange?: (value: number) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  step?: number;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends BaseInputProps {
  value?: string | number;
  onChange?: (value: string | number) => void;
  options: SelectOption[];
  multiple?: boolean;
}

export interface FileInputProps extends BaseInputProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  onChange?: (files: File[]) => void;
}

export interface CheckboxProps extends Omit<BaseInputProps, 'placeholder'> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  indeterminate?: boolean;
}

export interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends BaseInputProps {
  value?: string | number;
  onChange?: (value: string | number) => void;
  options: RadioOption[];
  orientation?: 'horizontal' | 'vertical';
}

// Zod-related types
export type ZodFormData<T extends z.ZodType> = z.infer<T>;

export interface ZodValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
}

// Medical form specific types
export interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  insuranceProvider?: string;
  policyNumber?: string;
  allergies?: string[];
  medicalHistory?: string;
  currentMedications?: string;
}

export interface AppointmentFormData {
  patientId: string;
  doctorId: string;
  appointmentType: string;
  reason: string;
  preferredDate: string;
  preferredTime: string;
  duration?: number;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  notes?: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  type: string;
  priority: 'low' | 'normal' | 'high' | 'urgent' | 'stat';
  assignedTo: string;
  patientId?: string;
  dueDate?: string;
  notes?: string;
}

export interface DocumentUploadFormData {
  title: string;
  description?: string;
  category: string;
  patientId?: string;
  appointmentId?: string;
  files: File[];
  isConfidential: boolean;
}