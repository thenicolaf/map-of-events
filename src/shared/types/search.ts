// Search and filter related types

export interface SearchFilterOption {
  key: string;
  label: string;
  type: 'select' | 'checkbox' | 'date' | 'range';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export interface FilterState {
  [key: string]: string | string[] | number | boolean | Date | null;
}

export interface SearchFieldsConfig {
  searchFields: string[];
  searchPlaceholder?: string;
  filters?: SearchFilterOption[];
  enableAdvancedFilters?: boolean;
}

export interface SearchFilterProps extends SearchFieldsConfig {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterState) => void;
  onClear?: () => void;
  loading?: boolean;
  defaultSearchValue?: string;
  defaultFilterValues?: FilterState;
}

export interface SearchState {
  query: string;
  filters: FilterState;
  isAdvancedOpen: boolean;
}

export interface SearchResult<T> {
  data: T[];
  totalCount: number;
  hasMore: boolean;
}

// Common filter options for medical entities
export const MEDICAL_FILTERS = {
  // Status filters
  STATUS: {
    APPOINTMENT: [
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'confirmed', label: 'Confirmed' },
      { value: 'in-progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' },
      { value: 'no-show', label: 'No Show' },
      { value: 'rescheduled', label: 'Rescheduled' }
    ],
    LAB_RESULT: [
      { value: 'ordered', label: 'Ordered' },
      { value: 'collected', label: 'Collected' },
      { value: 'in-progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' },
      { value: 'critical', label: 'Critical' },
      { value: 'pending', label: 'Pending' }
    ],
    TASK: [
      { value: 'pending', label: 'Pending' },
      { value: 'in-progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' },
      { value: 'overdue', label: 'Overdue' }
    ]
  },

  // Priority filters
  PRIORITY: [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'stat', label: 'STAT' }
  ],

  // Gender filters
  GENDER: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ],

  // Appointment types
  APPOINTMENT_TYPE: [
    { value: 'consultation', label: 'Consultation' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'check-up', label: 'Check-up' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'therapy', label: 'Therapy' },
    { value: 'emergency', label: 'Emergency' }
  ],

  // Lab categories
  LAB_CATEGORY: [
    { value: 'hematology', label: 'Hematology' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'microbiology', label: 'Microbiology' },
    { value: 'immunology', label: 'Immunology' },
    { value: 'pathology', label: 'Pathology' },
    { value: 'genetics', label: 'Genetics' },
    { value: 'endocrinology', label: 'Endocrinology' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'oncology', label: 'Oncology' }
  ],

  // Doctor specialties
  SPECIALTY: [
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'endocrinology', label: 'Endocrinology' },
    { value: 'gastroenterology', label: 'Gastroenterology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'oncology', label: 'Oncology' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'psychiatry', label: 'Psychiatry' },
    { value: 'radiology', label: 'Radiology' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'family-medicine', label: 'Family Medicine' },
    { value: 'internal-medicine', label: 'Internal Medicine' },
    { value: 'emergency-medicine', label: 'Emergency Medicine' }
  ]
} as const;