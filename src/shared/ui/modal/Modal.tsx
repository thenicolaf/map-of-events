'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, User, FileText, AlertCircle } from 'lucide-react';

interface FormData {
  patientName: string;
  appointmentNotes: string;
  documentFile: File | null;
}

interface FormErrors {
  patientName?: string;
  appointmentNotes?: string;
  documentFile?: string;
}

interface ModalProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  onSubmit?: (data: FormData) => Promise<void> | void;
}

export function Modal({ trigger, title, description, onSubmit }: ModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    patientName: '',
    appointmentNotes: '',
    documentFile: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    } else if (formData.patientName.length < 2) {
      newErrors.patientName = 'Patient name must be at least 2 characters';
    }

    if (!formData.appointmentNotes.trim()) {
      newErrors.appointmentNotes = 'Appointment notes are required';
    } else if (formData.appointmentNotes.length < 10) {
      newErrors.appointmentNotes = 'Appointment notes must be at least 10 characters';
    }

    if (formData.documentFile) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];

      if (formData.documentFile.size > maxSize) {
        newErrors.documentFile = 'File size must be less than 5MB';
      } else if (!allowedTypes.includes(formData.documentFile.type)) {
        newErrors.documentFile = 'File type must be JPEG, PNG, PDF, or TXT';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setSubmitSuccess(true);
      setTimeout(() => {
        setOpen(false);
        resetForm();
      }, 1500);
    } catch (error) {
      console.error('Submit error:', error);
      setErrors({ patientName: 'Failed to submit form. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      patientName: '',
      appointmentNotes: '',
      documentFile: null,
    });
    setErrors({});
    setSubmitSuccess(false);
    setIsSubmitting(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, documentFile: file }));
    if (errors.documentFile) {
      setErrors(prev => ({ ...prev, documentFile: undefined }));
    }
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {submitSuccess ? (
          <div className="flex items-center justify-center py-8 text-center">
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                  <svg
                    className="h-6 w-6 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                Form submitted successfully!
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientName" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Patient Name *
              </Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={handleInputChange('patientName')}
                placeholder="Enter patient full name"
                className={errors.patientName ? 'border-red-500' : ''}
              />
              {errors.patientName && (
                <p className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {errors.patientName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointmentNotes" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Appointment Notes *
              </Label>
              <textarea
                id="appointmentNotes"
                value={formData.appointmentNotes}
                onChange={handleInputChange('appointmentNotes')}
                placeholder="Enter appointment details, symptoms, or notes..."
                rows={3}
                className={`flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                  errors.appointmentNotes ? 'border-red-500' : ''
                }`}
              />
              {errors.appointmentNotes && (
                <p className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {errors.appointmentNotes}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentFile" className="flex items-center gap-1">
                <Upload className="h-4 w-4" />
                Document Upload (Optional)
              </Label>
              <Input
                id="documentFile"
                type="file"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf,.txt"
                className={`cursor-pointer ${errors.documentFile ? 'border-red-500' : ''}`}
              />
              {formData.documentFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {formData.documentFile.name} ({Math.round(formData.documentFile.size / 1024)} KB)
                </p>
              )}
              {errors.documentFile && (
                <p className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {errors.documentFile}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Supported formats: JPEG, PNG, PDF, TXT. Max size: 5MB.
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}