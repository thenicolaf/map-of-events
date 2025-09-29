'use client';

import { useState, useEffect } from 'react';
import { SearchFilter } from '@/shared/ui/search-filter';
import { useUnifiedSearch } from '@/shared/hooks';
import type { Patient, Appointment, MedicalTask, LabResult } from '@/shared/types/medical';
import type { SearchFilterOption } from '@/shared/types/search';
import { MEDICAL_FILTERS } from '@/shared/types/search';
import { Button } from '@/components/ui/button';
import { X, User, Calendar, FileText, TestTube } from 'lucide-react';

interface GlobalSearchProps {
  patients: Patient[];
  appointments: Appointment[];
  tasks: MedicalTask[];
  labResults: LabResult[];
}

interface SearchResultItem {
  id: string;
  type: 'patient' | 'appointment' | 'task' | 'lab-result';
  title: string;
  subtitle: string;
  details: string;
  data: Patient | Appointment | MedicalTask | LabResult;
  [key: string]: unknown; // Allow additional searchable fields
}

export function GlobalSearch({ patients, appointments, tasks, labResults }: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);

  // Combine all data into searchable items
  const allData: SearchResultItem[] = [
    ...patients.map(patient => ({
      id: patient.id,
      type: 'patient' as const,
      title: patient.fullName,
      subtitle: `Patient • ${patient.email}`,
      details: `Phone: ${patient.phone} • DOB: ${patient.dateOfBirth}`,
      data: patient,
      // Add searchable fields for the unified search
      fullName: patient.fullName,
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      'medicalHistory.condition': patient.medicalHistory.map(h => h.condition).join(' '),
      'address.city': patient.address.city,
      'address.state': patient.address.state
    })),
    ...appointments.map(appointment => ({
      id: appointment.id,
      type: 'appointment' as const,
      title: appointment.reason,
      subtitle: `Appointment • ${appointment.patient.fullName}`,
      details: `${new Date(appointment.dateTime).toLocaleString()} • ${appointment.duration} min`,
      data: appointment,
      // Add searchable fields
      reason: appointment.reason,
      'patient.fullName': appointment.patient.fullName,
      'doctor.fullName': appointment.doctor.fullName,
      location: appointment.location,
      notes: appointment.notes || '',
      appointmentType: appointment.type,
      status: appointment.status
    })),
    ...tasks.map(task => ({
      id: task.id,
      type: 'task' as const,
      title: task.title,
      subtitle: `Task • ${task.type}`,
      details: `${task.priority} priority • Due: ${task.dueDate}`,
      data: task,
      // Add searchable fields
      taskTitle: task.title,
      description: task.description,
      taskType: task.type,
      priority: task.priority,
      status: task.status,
      assignedTo: task.assignedTo
    })),
    ...labResults.map(result => ({
      id: result.id,
      type: 'lab-result' as const,
      title: result.testType,
      subtitle: `Lab Result • Patient: ${result.patientId}`,
      details: `Ordered: ${new Date(result.orderedDate).toLocaleDateString()} • Status: ${result.status}`,
      data: result,
      // Add searchable fields
      testType: result.testType,
      patientId: result.patientId,
      status: result.status,
      notes: result.notes || '',
      'results.parameter': result.results.map(r => r.parameter).join(' '),
      'results.value': result.results.map(r => r.value.toString()).join(' ')
    }))
  ];

  // Define search fields for global search
  const searchFields = [
    'title',
    'subtitle',
    'details',
    'fullName',
    'firstName',
    'lastName',
    'email',
    'phone',
    'reason',
    'patient.fullName',
    'doctor.fullName',
    'location',
    'notes',
    'description',
    'taskTitle',
    'appointmentType',
    'taskType',
    'testType',
    'patientId',
    'medicalHistory.condition',
    'address.city',
    'address.state',
    'results.parameter',
    'results.value',
    'assignedTo'
  ];

  const filters: SearchFilterOption[] = [
    {
      key: 'type',
      label: 'Result Type',
      type: 'checkbox',
      options: [
        { value: 'patient', label: 'Patients' },
        { value: 'appointment', label: 'Appointments' },
        { value: 'task', label: 'Tasks' },
        { value: 'lab-result', label: 'Lab Results' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        ...MEDICAL_FILTERS.STATUS.APPOINTMENT,
        ...MEDICAL_FILTERS.STATUS.LAB_RESULT,
        ...MEDICAL_FILTERS.STATUS.TASK
      ]
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      options: [...MEDICAL_FILTERS.PRIORITY]
    }
  ];

  // Use unified search hook
  const {
    searchQuery,
    filteredData,
    setSearchQuery,
    setFilters,
    clearAll
  } = useUnifiedSearch({
    data: allData,
    searchFields,
    caseSensitive: false
  });

  // Update search results when filtered data changes
  useEffect(() => {
    setSearchResults(filteredData);
    setIsOpen(filteredData.length > 0 && searchQuery.length > 0);
  }, [filteredData, searchQuery]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'patient': return <User className="h-4 w-4" />;
      case 'appointment': return <Calendar className="h-4 w-4" />;
      case 'task': return <FileText className="h-4 w-4" />;
      case 'lab-result': return <TestTube className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'patient': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'appointment': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'task': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      case 'lab-result': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30';
    }
  };

  return (
    <div className="relative">
      {/* Global Search Component */}
      <div className="mb-6">
        <SearchFilter
          searchFields={searchFields}
          searchPlaceholder="Global search across patients, appointments, tasks, and lab results..."
          filters={filters}
          onSearch={setSearchQuery}
          onFilter={setFilters}
          onClear={clearAll}
          defaultSearchValue=""
          enableAdvancedFilters={true}
        />
      </div>

      {/* Search Results Overlay */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold">
              Search Results ({searchResults.length} found)
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-2">
            {searchResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No results found for &quot;{searchQuery}&quot;
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.slice(0, 20).map((result) => (
                  <div
                    key={`${result.type}-${result.id}`}
                    className="p-3 rounded-lg hover:bg-muted/50 cursor-pointer border border-transparent hover:border-border"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${getTypeColor(result.type)}`}>
                        {getIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate">{result.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(result.type)}`}>
                            {result.type.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{result.subtitle}</p>
                        <p className="text-xs text-muted-foreground">{result.details}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {searchResults.length > 20 && (
                  <div className="text-center py-2 text-sm text-muted-foreground">
                    ... and {searchResults.length - 20} more results
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}