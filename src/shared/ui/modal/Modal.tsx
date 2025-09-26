'use client';

import { useState, useActionState, useRef, useEffect } from 'react';
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
import { Upload, User, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import type { ActionState } from '@/app/actions/form-actions';

interface ModalProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  action: (prevState: ActionState | null, formData: FormData) => Promise<ActionState>;
  fieldLabel?: {
    patientName?: string;
    appointmentNotes?: string;
  };
}

export function Modal({
  trigger,
  title,
  description,
  action,
  fieldLabel = {
    patientName: 'Patient Name',
    appointmentNotes: 'Appointment Notes'
  }
}: ModalProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-close modal on successful submission after delay
  useEffect(() => {
    if (state?.success && open) {
      const timer = setTimeout(() => {
        setOpen(false);
        // Reset form when modal closes
        formRef.current?.reset();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [state?.success, open]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    // Reset form when modal is closed
    if (!newOpen) {
      formRef.current?.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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

        {state?.success ? (
          <div className="flex items-center justify-center py-8 text-center">
            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Success!
                </p>
                <p className="text-xs text-muted-foreground">
                  {state.message}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <form ref={formRef} action={formAction} className="space-y-4">
            {/* Global form error */}
            {state?.errors?.form && (
              <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {state.errors.form[0]}
                  </p>
                </div>
              </div>
            )}

            {/* General error message */}
            {!state?.success && state?.message && !state?.errors?.form && (
              <div className="rounded-md bg-red-50 p-3 dark:bg-red-900/20">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {state.message}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="patientName" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {fieldLabel.patientName} *
              </Label>
              <Input
                id="patientName"
                name="patientName"
                placeholder="Enter patient full name"
                required
                disabled={isPending}
                className={state?.errors?.patientName ? 'border-red-500' : ''}
              />
              {state?.errors?.patientName && (
                <p className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {state.errors.patientName[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointmentNotes" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {fieldLabel.appointmentNotes} *
              </Label>
              <textarea
                id="appointmentNotes"
                name="appointmentNotes"
                placeholder="Enter details..."
                rows={3}
                required
                disabled={isPending}
                className={`flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ${
                  state?.errors?.appointmentNotes ? 'border-red-500' : ''
                }`}
              />
              {state?.errors?.appointmentNotes && (
                <p className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {state.errors.appointmentNotes[0]}
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
                name="documentFile"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.txt"
                disabled={isPending}
                className={`cursor-pointer ${state?.errors?.documentFile ? 'border-red-500' : ''}`}
              />
              {state?.errors?.documentFile && (
                <p className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  {state.errors.documentFile[0]}
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
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
              >
                {isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}