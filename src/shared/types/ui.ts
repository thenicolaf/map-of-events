import type { ReactNode } from 'react';

// Common UI component types
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  'data-testid'?: string;
}

// Size variants
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Color variants
export type Variant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'ghost'
  | 'outline'
  | 'destructive';

// Loading and state types
export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
}

export interface ErrorState {
  hasError: boolean;
  error?: string | Error;
  onRetry?: () => void;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  destructive: string;
  success: string;
  warning: string;
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
  children?: NavigationItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

// Modal and dialog types
export interface ModalProps extends BaseComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  size?: Size;
  closable?: boolean;
  maskClosable?: boolean;
}

export interface DialogAction {
  label: string;
  variant?: Variant;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

// Table types
export interface TableColumn<T = unknown> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: unknown, record: T, index: number) => ReactNode;
}

export interface TableProps<T = unknown> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  pagination?: PaginationConfig;
  sortConfig?: SortConfig;
  filterConfig?: FilterConfig;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  onRowClick?: (record: T, index: number) => void;
  rowKey?: keyof T | ((record: T) => string);
  emptyText?: string;
}

export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
  onChange: (page: number, pageSize: number) => void;
}

export interface SortConfig {
  field?: string;
  direction?: 'asc' | 'desc';
  onChange: (field: string, direction: 'asc' | 'desc') => void;
}

export interface FilterConfig {
  filters: Record<string, unknown>;
  onChange: (filters: Record<string, unknown>) => void;
}

// Card and layout types
export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  footer?: ReactNode;
  hoverable?: boolean;
  loading?: boolean;
  bordered?: boolean;
}

export interface GridProps extends BaseComponentProps {
  cols?: number;
  gap?: Size;
  responsive?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

// Notification types
export interface NotificationConfig {
  id?: string;
  title: string;
  message?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

// Search and filter types
export interface SearchConfig {
  placeholder?: string;
  debounceMs?: number;
  onSearch: (query: string) => void;
  loading?: boolean;
}

export interface FilterOption {
  label: string;
  value: string | number | boolean;
  count?: number;
}

export interface FilterGroup {
  key: string;
  label: string;
  options: FilterOption[];
  multiple?: boolean;
  searchable?: boolean;
}

// Chart and visualization types
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, unknown>;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  responsive?: boolean;
  animated?: boolean;
  legend?: boolean;
  tooltip?: boolean;
}

// Status and badge types
export interface StatusConfig {
  label: string;
  variant: Variant;
  icon?: ReactNode;
  description?: string;
}

export type StatusType =
  | 'active'
  | 'inactive'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'draft'
  | 'published'
  | 'archived'
  | 'critical'
  | 'warning'
  | 'success'
  | 'info';

// Avatar types
export interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: Size;
  shape?: 'circle' | 'square';
  fallback?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

// Progress types
export interface ProgressProps extends BaseComponentProps {
  value: number;
  max?: number;
  size?: Size;
  variant?: Variant;
  showLabel?: boolean;
  animated?: boolean;
  striped?: boolean;
}