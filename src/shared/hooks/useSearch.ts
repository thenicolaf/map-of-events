import { useState, useMemo } from 'react';

interface UseSearchOptions<T> {
  searchFields: (keyof T)[];
  initialQuery?: string;
  caseSensitive?: boolean;
}

interface SearchState {
  query: string;
  isSearching: boolean;
}

interface SearchActions {
  setQuery: (query: string) => void;
  clearQuery: () => void;
}

export function useSearch<T extends Record<string, unknown>>(
  data: T[],
  options: UseSearchOptions<T>
): {
  state: SearchState;
  actions: SearchActions;
  filteredData: T[];
} {
  const { searchFields, initialQuery = '', caseSensitive = false } = options;

  const [query, setQuery] = useState(initialQuery);

  const filteredData = useMemo(() => {
    if (!query.trim()) {
      return data;
    }

    const searchTerm = caseSensitive ? query : query.toLowerCase();

    return data.filter(item => {
      return searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          const searchValue = caseSensitive ? value : value.toLowerCase();
          return searchValue.includes(searchTerm);
        }
        if (typeof value === 'number') {
          return value.toString().includes(searchTerm);
        }
        return false;
      });
    });
  }, [data, query, searchFields, caseSensitive]);

  const state: SearchState = {
    query,
    isSearching: Boolean(query.trim()),
  };

  const actions: SearchActions = {
    setQuery,
    clearQuery: () => setQuery(''),
  };

  return {
    state,
    actions,
    filteredData,
  };
}