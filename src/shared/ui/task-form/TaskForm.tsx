'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar, User, FileText, AlertTriangle } from 'lucide-react';
import type { MedicalTask } from '@/shared/types/medical';
import { medicalTaskSchema, defaultMedicalTaskValues, type MedicalTaskFormData } from '@/shared/lib/validations/medical-task';
import { MEDICAL_FILTERS } from '@/shared/types/search';

interface TaskFormProps {
  task?: MedicalTask;
  onSubmit: (task: Omit<MedicalTask, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function TaskForm({ task, onSubmit, onCancel, loading = false }: TaskFormProps) {
  const [formData, setFormData] = useState<MedicalTaskFormData>({
    ...defaultMedicalTaskValues,
    ...task,
  } as MedicalTaskFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form when task prop changes
  useEffect(() => {
    if (task) {
      setFormData({
        ...defaultMedicalTaskValues,
        ...task,
      } as MedicalTaskFormData);
    }
  }, [task]);

  const handleChange = (field: keyof MedicalTaskFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate the form data
      const validatedData = medicalTaskSchema.parse(formData);

      // Clear any previous errors
      setErrors({});

      // Submit the form
      await onSubmit(validatedData);
    } catch (error) {
      if (error instanceof Error) {
        // Handle Zod validation errors
        try {
          const zodError = JSON.parse(error.message);
          const newErrors: Record<string, string> = {};
          zodError.forEach((err: { path: string[]; message: string }) => {
            newErrors[err.path[0]] = err.message;
          });
          setErrors(newErrors);
        } catch {
          // If not a Zod error, show general error
          setErrors({ general: error.message });
        }
      }
    }
  };

  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString().slice(0, 16);
  };

  const formatDateForSubmission = (dateString: string) => {
    return new Date(dateString).toISOString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600';
      case 'normal': return 'text-blue-600';
      case 'high': return 'text-orange-600';
      case 'urgent': return 'text-red-600';
      case 'stat': return 'text-red-800';
      default: return 'text-gray-600';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          {errors.general}
        </div>
      )}

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Task Title *
        </Label>
        <Input
          id="title"
          value={formData.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter task title..."
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter task description..."
          rows={3}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      {/* Type and Priority Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Task Type */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Task Type *
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange('type', value)}
          >
            <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select task type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="follow-up">Follow-up</SelectItem>
              <SelectItem value="call-patient">Call Patient</SelectItem>
              <SelectItem value="review-results">Review Results</SelectItem>
              <SelectItem value="insurance-verification">Insurance Verification</SelectItem>
              <SelectItem value="schedule-appointment">Schedule Appointment</SelectItem>
              <SelectItem value="documentation">Documentation</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-red-600">{errors.type}</p>
          )}
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Priority *
          </Label>
          <Select
            value={formData.priority}
            onValueChange={(value) => handleChange('priority', value)}
          >
            <SelectTrigger className={errors.priority ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {MEDICAL_FILTERS.PRIORITY.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  <span className={getPriorityColor(priority.value)}>
                    {priority.label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.priority && (
            <p className="text-sm text-red-600">{errors.priority}</p>
          )}
        </div>
      </div>

      {/* Assignment Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Assigned To */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Assigned To *
          </Label>
          <Select
            value={formData.assignedTo}
            onValueChange={(value) => handleChange('assignedTo', value)}
          >
            <SelectTrigger className={errors.assignedTo ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
              <SelectItem value="Dr. Johnson">Dr. Johnson</SelectItem>
              <SelectItem value="Dr. Brown">Dr. Brown</SelectItem>
              <SelectItem value="Dr. Wilson">Dr. Wilson</SelectItem>
              <SelectItem value="Nurse Manager">Nurse Manager</SelectItem>
            </SelectContent>
          </Select>
          {errors.assignedTo && (
            <p className="text-sm text-red-600">{errors.assignedTo}</p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Status *</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleChange('status', value)}
          >
            <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {MEDICAL_FILTERS.STATUS.TASK.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-red-600">{errors.status}</p>
          )}
        </div>
      </div>

      {/* Due Date */}
      <div className="space-y-2">
        <Label htmlFor="dueDate" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Due Date & Time
        </Label>
        <Input
          id="dueDate"
          type="datetime-local"
          value={formatDateForInput(formData.dueDate)}
          onChange={(e) => handleChange('dueDate', formatDateForSubmission(e.target.value))}
          className={errors.dueDate ? 'border-red-500' : ''}
        />
        {errors.dueDate && (
          <p className="text-sm text-red-600">{errors.dueDate}</p>
        )}
      </div>

      {/* Patient ID (optional) */}
      <div className="space-y-2">
        <Label htmlFor="patientId">Patient ID (optional)</Label>
        <Input
          id="patientId"
          value={formData.patientId || ''}
          onChange={(e) => handleChange('patientId', e.target.value)}
          placeholder="Enter patient ID if task is patient-specific..."
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Additional notes..."
          rows={3}
          className={errors.notes ? 'border-red-500' : ''}
        />
        {errors.notes && (
          <p className="text-sm text-red-600">{errors.notes}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
        >
{(() => {
            if (loading) return 'Saving...';
            if (task) return 'Update Task';
            return 'Create Task';
          })()}
        </Button>
      </div>
    </form>
  );
}