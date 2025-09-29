import { useState, useMemo, useCallback } from 'react';
import { useDebounce } from './useDebounce';
import type { FilterState, SearchResult } from '@/shared/types/search';

export interface UnifiedSearchConfig<T> {
  data: T[];
  searchFields: string[];
  defaultFilters?: FilterState;
  caseSensitive?: boolean;
  debounceMs?: number;
}

export interface UnifiedSearchReturn<T> {
  // State
  searchQuery: string;
  filters: FilterState;
  isSearching: boolean;

  // Results
  filteredData: T[];
  searchResult: SearchResult<T>;

  // Actions
  setSearchQuery: (query: string) => void;
  setFilters: (filters: FilterState) => void;
  updateFilter: (key: string, value: string | number | boolean | Date | string[] | null) => void;
  clearSearch: () => void;
  clearFilters: () => void;
  clearAll: () => void;
}

export function useUnifiedSearch<T>({
  data,
  searchFields,
  defaultFilters = {},
  caseSensitive = false,
  debounceMs = 300
}: UnifiedSearchConfig<T>): UnifiedSearchReturn<T> {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Debounce search query for performance
  const debouncedSearchQuery = useDebounce(searchQuery, debounceMs);
  const isSearching = searchQuery !== debouncedSearchQuery;

  // Helper function to get nested value
  const getNestedValue = useCallback((obj: T, path: string): string => {
    const value = path.split('.').reduce((current: unknown, key) => {
      if (current && typeof current === 'object' && current !== null) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);

    if (value === null || value === undefined) return '';

    // Handle arrays (like medical history, allergies)
    if (Array.isArray(value)) {
      return value.map(item =>
        typeof item === 'object' && item !== null
          ? Object.values(item).join(' ')
          : String(item)
      ).join(' ');
    }

    // Handle objects (like address, emergency contact)
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).join(' ');
    }

    return String(value);
  }, []);

  // Apply search filter
  const searchFilteredData = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return data;

    const query = caseSensitive ? debouncedSearchQuery : debouncedSearchQuery.toLowerCase();

    return data.filter(item => {
      return searchFields.some(field => {
        const fieldValue = getNestedValue(item, field);
        const searchValue = caseSensitive ? fieldValue : fieldValue.toLowerCase();
        return searchValue.includes(query);
      });
    });
  }, [data, searchFields, debouncedSearchQuery, caseSensitive, getNestedValue]);

  // Apply additional filters
  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) return searchFilteredData;

    return searchFilteredData.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        // Skip empty filters
        if (value === null || value === undefined || value === '' ||
            (Array.isArray(value) && value.length === 0)) {
          return true;
        }

        const itemValue = getNestedValue(item, key);

        // Handle array filters (multi-select)
        if (Array.isArray(value)) {
          return value.some(filterValue =>
            itemValue.toLowerCase().includes(String(filterValue).toLowerCase())
          );
        }

        // Handle boolean filters
        if (typeof value === 'boolean') {
          return Boolean(itemValue) === value;
        }

        // Handle date filters
        if (value instanceof Date) {
          const itemDate = new Date(itemValue);
          return itemDate.toDateString() === value.toDateString();
        }

        // Handle string filters
        return itemValue.toLowerCase().includes(String(value).toLowerCase());
      });
    });
  }, [searchFilteredData, filters, getNestedValue]);

  // Create search result object
  const searchResult: SearchResult<T> = useMemo(() => ({
    data: filteredData,
    totalCount: filteredData.length,
    hasMore: false // For pagination support in the future
  }), [filteredData]);

  // Actions
  const updateFilter = useCallback((key: string, value: string | number | boolean | Date | string[] | null) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, [defaultFilters]);

  const clearAll = useCallback(() => {
    setSearchQuery('');
    setFilters(defaultFilters);
  }, [defaultFilters]);

  return {
    // State
    searchQuery,
    filters,
    isSearching,

    // Results
    filteredData,
    searchResult,

    // Actions
    setSearchQuery,
    setFilters,
    updateFilter,
    clearSearch,
    clearFilters,
    clearAll
  };
}