import { useState, useMemo, useCallback } from 'react';
import type { FilterState, SearchFilterOption } from '@/shared/types/search';

export interface AdvancedFilterConfig {
  filters: SearchFilterOption[];
  defaultValues?: FilterState;
  onFilterChange?: (filters: FilterState) => void;
}

export interface AdvancedFilterReturn {
  // State
  filterValues: FilterState;
  isOpen: boolean;

  // Computed
  activeFiltersCount: number;
  hasActiveFilters: boolean;
  formattedFilters: Array<{
    key: string;
    label: string;
    displayValue: string;
  }>;

  // Actions
  setFilterValue: (key: string, value: string | number | boolean | Date | string[] | null) => void;
  setFilterValues: (values: FilterState) => void;
  clearFilter: (key: string) => void;
  clearAllFilters: () => void;
  toggleOpen: () => void;
  setOpen: (open: boolean) => void;
}

export function useAdvancedFilter({
  filters,
  defaultValues = {},
  onFilterChange
}: AdvancedFilterConfig): AdvancedFilterReturn {
  const [filterValues, setFilterValues] = useState<FilterState>(defaultValues);
  const [isOpen, setIsOpen] = useState(false);

  // Computed values
  const activeFiltersCount = useMemo(() => {
    return Object.values(filterValues).filter(value =>
      value !== null && value !== undefined && value !== "" &&
      (Array.isArray(value) ? value.length > 0 : true)
    ).length;
  }, [filterValues]);

  const hasActiveFilters = activeFiltersCount > 0;

  const formattedFilters = useMemo(() => {
    return Object.entries(filterValues)
      .filter(([, value]) =>
        value !== null && value !== undefined && value !== "" &&
        (Array.isArray(value) ? value.length > 0 : true)
      )
      .map(([key, value]) => {
        const filter = filters.find(f => f.key === key);
        if (!filter) return null;

        let displayValue: string;

        if (Array.isArray(value)) {
          displayValue = value
            .map(v => filter.options?.find(opt => opt.value === v)?.label || v)
            .join(', ');
        } else if (typeof value === 'boolean') {
          displayValue = value ? 'Yes' : 'No';
        } else if (value instanceof Date) {
          displayValue = value.toLocaleDateString();
        } else {
          displayValue = filter.options?.find(opt => opt.value === value)?.label || String(value);
        }

        return {
          key,
          label: filter.label,
          displayValue
        };
      })
      .filter(Boolean) as Array<{
        key: string;
        label: string;
        displayValue: string;
      }>;
  }, [filterValues, filters]);

  // Actions
  const setFilterValue = useCallback((key: string, value: string | number | boolean | Date | string[] | null) => {
    const newValues = { ...filterValues, [key]: value };
    setFilterValues(newValues);
    onFilterChange?.(newValues);
  }, [filterValues, onFilterChange]);

  const updateFilterValues = useCallback((values: FilterState) => {
    setFilterValues(values);
    onFilterChange?.(values);
  }, [onFilterChange]);

  const clearFilter = useCallback((key: string) => {
    const newValues = { ...filterValues };
    delete newValues[key];
    setFilterValues(newValues);
    onFilterChange?.(newValues);
  }, [filterValues, onFilterChange]);

  const clearAllFilters = useCallback(() => {
    setFilterValues(defaultValues);
    onFilterChange?.(defaultValues);
  }, [defaultValues, onFilterChange]);

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const setOpen = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return {
    // State
    filterValues,
    isOpen,

    // Computed
    activeFiltersCount,
    hasActiveFilters,
    formattedFilters,

    // Actions
    setFilterValue,
    setFilterValues: updateFilterValues,
    clearFilter,
    clearAllFilters,
    toggleOpen,
    setOpen
  };
}