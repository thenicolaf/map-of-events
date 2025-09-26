import { useState, useMemo } from 'react';

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

interface PaginationActions {
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
  resetToFirstPage: () => void;
}

interface UsePaginationOptions {
  initialPage?: number;
  initialItemsPerPage?: number;
}

export function usePagination<T>(
  data: T[],
  options: UsePaginationOptions = {}
): {
  state: PaginationState;
  actions: PaginationActions;
  paginatedData: T[];
} {
  const { initialPage = 1, initialItemsPerPage = 10 } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const state = useMemo(() => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length);

    return {
      currentPage,
      itemsPerPage,
      totalPages,
      startIndex,
      endIndex,
    };
  }, [data.length, currentPage, itemsPerPage]);

  const paginatedData = useMemo(() => {
    return data.slice(state.startIndex, state.endIndex);
  }, [data, state.startIndex, state.endIndex]);

  const actions: PaginationActions = {
    setCurrentPage: (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, state.totalPages)));
    },
    setItemsPerPage: (items: number) => {
      setItemsPerPage(items);
      setCurrentPage(1); // Reset to first page when changing items per page
    },
    nextPage: () => {
      setCurrentPage(prev => Math.min(prev + 1, state.totalPages));
    },
    previousPage: () => {
      setCurrentPage(prev => Math.max(prev - 1, 1));
    },
    goToPage: (page: number) => {
      setCurrentPage(Math.max(1, Math.min(page, state.totalPages)));
    },
    resetToFirstPage: () => {
      setCurrentPage(1);
    },
  };

  return {
    state,
    actions,
    paginatedData,
  };
}