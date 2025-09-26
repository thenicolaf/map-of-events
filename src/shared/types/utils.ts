// Utility types for better TypeScript development

// Make all properties optional
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Make all properties required
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Pick specific properties from a type
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit specific properties from a type
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// Make specific properties optional
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Make specific properties required
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

// Nullable type
export type Nullable<T> = T | null;

// Optional type
export type Optional<T> = T | undefined;

// Maybe type (nullable or undefined)
export type Maybe<T> = T | null | undefined;

// Non-nullable type
export type NonNullable<T> = T extends null | undefined ? never : T;

// Deep partial type
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Deep required type
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Flatten nested objects
export type Flatten<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: O[K] }
    : never
  : T;

// Get array element type
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

// Get promise resolve type
export type PromiseType<T> = T extends Promise<infer U> ? U : never;

// Function parameter types
export type Parameters<T extends (...args: never[]) => unknown> = T extends (
  ...args: infer P
) => unknown
  ? P
  : never;

// Function return type
export type ReturnType<T extends (...args: never[]) => unknown> = T extends (
  ...args: never[]
) => infer R
  ? R
  : never;

// Constructor parameters
export type ConstructorParameters<T extends new (...args: never[]) => unknown> =
  T extends new (...args: infer P) => unknown ? P : never;

// Instance type from constructor
export type InstanceType<T extends new (...args: never[]) => unknown> = T extends new (
  ...args: never[]
) => infer R
  ? R
  : never;

// Extract keys with specific value type
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// Create a union of all property values
export type ValueOf<T> = T[keyof T];

// Convert union to intersection
export type UnionToIntersection<U> = (U extends unknown ? (x: U) => void : never) extends (
  x: infer I
) => void
  ? I
  : never;

// Branded types for type safety
export type Brand<T, B> = T & { __brand: B };

// ID types
export type ID = Brand<string, 'ID'>;
export type PatientID = Brand<string, 'PatientID'>;
export type AppointmentID = Brand<string, 'AppointmentID'>;
export type DoctorID = Brand<string, 'DoctorID'>;
export type LabResultID = Brand<string, 'LabResultID'>;

// Timestamp types
export type Timestamp = Brand<string, 'Timestamp'>;
export type ISODateTime = Brand<string, 'ISODateTime'>;

// Email and phone types for validation
export type Email = Brand<string, 'Email'>;
export type PhoneNumber = Brand<string, 'PhoneNumber'>;

// URL types
export type URL = Brand<string, 'URL'>;

// Pagination utility types
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: string | number | boolean | string[] | number[] | undefined;
}

export interface SearchParams extends PaginationParams, SortParams, FilterParams {
  q?: string; // search query
}

// API response wrapper types
export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: number;
  details?: Record<string, unknown>;
}

export type ApiResult<T> = ApiSuccess<T> | ApiErrorResponse;

// Event handler types
export type EventHandler<T = Event> = (event: T) => void;
export type ChangeHandler<T = string> = (value: T) => void;
export type ClickHandler = (event: React.MouseEvent) => void;
export type SubmitHandler = (event: React.FormEvent) => void;

// Async function types
export type AsyncFunction<T = void> = () => Promise<T>;
export type AsyncCallback<T, R = void> = (arg: T) => Promise<R>;

// Configuration types
export interface BaseConfig {
  enabled: boolean;
  settings?: Record<string, unknown>;
}

export interface FeatureFlags {
  [key: string]: boolean;
}

// Environment types
export type Environment = 'development' | 'staging' | 'production' | 'test';

// Log level types
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Permission types
export type Permission = 'read' | 'write' | 'delete' | 'admin';
export type Role = 'patient' | 'doctor' | 'nurse' | 'admin' | 'staff';

// Date utility types
export type DateString = string; // ISO date string
export type TimeString = string; // HH:MM format
export type DateTimeString = string; // ISO datetime string

// File types
export interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export type FileExtension = '.pdf' | '.doc' | '.docx' | '.jpg' | '.jpeg' | '.png' | '.txt';

// Validation types
export interface ValidationRule<T = unknown> {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: T) => boolean | string;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Currency and number formatting
export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD';
export type NumberFormat = 'decimal' | 'currency' | 'percent';

// Theme and styling
export type ColorScheme = 'light' | 'dark' | 'auto';
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';