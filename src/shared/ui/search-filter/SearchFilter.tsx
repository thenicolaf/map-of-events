"use client";

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useDebounce } from '@/shared/hooks';
import type { SearchFilterProps, FilterState, SearchFilterOption } from '@/shared/types/search';

export function SearchFilter({
  searchPlaceholder = "Search...",
  filters = [],
  enableAdvancedFilters = true,
  onSearch,
  onFilter,
  onClear,
  loading = false,
  defaultSearchValue = "",
  defaultFilterValues = {}
}: SearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState(defaultSearchValue);
  const [filterValues, setFilterValues] = useState<FilterState>(defaultFilterValues);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  // Debounce search to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Handle search query changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // Handle filter value changes
  const handleFilterChange = useCallback((key: string, value: string | number | boolean | Date | string[] | null) => {
    const newFilters = { ...filterValues, [key]: value };
    setFilterValues(newFilters);
    onFilter(newFilters);
  }, [filterValues, onFilter]);

  // Clear all filters and search
  const handleClear = useCallback(() => {
    setSearchQuery("");
    setFilterValues({});
    onSearch("");
    onFilter({});
    onClear?.();
  }, [onSearch, onFilter, onClear]);

  // Effect for debounced search
  useEffect(() => {
    onSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearch]);

  // Check if any filters are active
  const hasActiveFilters = Object.values(filterValues).some(value =>
    value !== null && value !== undefined && value !== "" &&
    (Array.isArray(value) ? value.length > 0 : true)
  );

  const hasActiveSearch = searchQuery.length > 0;

  return (
    <div className="space-y-4">
      {/* Main search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            disabled={loading}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        {/* Advanced filters toggle */}
        {enableAdvancedFilters && filters.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {Object.values(filterValues).filter(v => v !== null && v !== undefined && v !== "").length}
              </span>
            )}
            {isAdvancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        )}

        {/* Clear button */}
        {(hasActiveSearch || hasActiveFilters) && (
          <Button
            variant="outline"
            onClick={handleClear}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Advanced filters panel */}
      {enableAdvancedFilters && isAdvancedOpen && filters.length > 0 && (
        <div className="border border-border rounded-lg p-4 bg-card">
          <h3 className="text-sm font-medium mb-3">Advanced Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filters.map((filter: SearchFilterOption) => (
              <FilterField
                key={filter.key}
                filter={filter}
                value={filterValues[filter.key]}
                onChange={(value) => handleFilterChange(filter.key, value)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {Object.entries(filterValues).map(([key, value]) => {
            if (!value || value === "" || (Array.isArray(value) && value.length === 0)) return null;

            const filter = filters.find((f: SearchFilterOption) => f.key === key);
            if (!filter) return null;

            const displayValue = Array.isArray(value)
              ? value.join(", ")
              : typeof value === 'string'
                ? filter.options?.find(opt => opt.value === value)?.label || value
                : String(value);

            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-sm"
              >
                <span className="font-medium">{filter.label}:</span>
                <span>{displayValue}</span>
                <button
                  onClick={() => handleFilterChange(key, "")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Individual filter field component
function FilterField({
  filter,
  value,
  onChange
}: {
  filter: SearchFilterOption;
  value: string | number | boolean | Date | string[] | null;
  onChange: (value: string | number | boolean | Date | string[] | null) => void;
}) {
  switch (filter.type) {
    case 'select':
      return (
        <div>
          <label className="text-sm font-medium mb-1 block">{filter.label}</label>
          <Select value={typeof value === 'string' ? value : ""} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={filter.placeholder || `Select ${filter.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case 'checkbox':
      return (
        <div>
          <label className="text-sm font-medium mb-2 block">{filter.label}</label>
          <div className="space-y-1">
            {filter.options?.map((option) => {
              const isChecked = Array.isArray(value) ? value.includes(option.value) : false;
              return (
                <label key={option.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      const currentValues = Array.isArray(value) ? value : [];
                      if (e.target.checked) {
                        onChange([...currentValues, option.value]);
                      } else {
                        onChange(currentValues.filter(v => v !== option.value));
                      }
                    }}
                    className="rounded border-border"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      );

    case 'date':
      return (
        <div>
          <label className="text-sm font-medium mb-1 block">{filter.label}</label>
          <input
            type="date"
            value={typeof value === 'string' ? value : ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
            placeholder={filter.placeholder}
          />
        </div>
      );

    default:
      return null;
  }
}