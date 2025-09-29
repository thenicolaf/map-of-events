'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchFilter } from '@/shared/ui/search-filter';
import { useUnifiedSearch } from '@/shared/hooks';
import type { LabResult } from "@/shared/types/medical";
import type { SearchFilterOption } from '@/shared/types/search';
import { MEDICAL_FILTERS } from '@/shared/types/search';

interface ClientLabPaginationProps {
  labResults: LabResult[];
}

export function ClientLabPagination({ labResults }: ClientLabPaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Define search fields and filters for lab results
  const searchFields = [
    'testType',
    'patientId',
    'id',
    'results.parameter',
    'results.value',
    'notes',
    'status'
  ];

  const filters: SearchFilterOption[] = [
    {
      key: 'status',
      label: 'Result Status',
      type: 'select',
      options: [...MEDICAL_FILTERS.STATUS.LAB_RESULT]
    },
    {
      key: 'testType',
      label: 'Lab Category',
      type: 'select',
      options: [...MEDICAL_FILTERS.LAB_CATEGORY]
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      options: [...MEDICAL_FILTERS.PRIORITY]
    },
    {
      key: 'orderedDate',
      label: 'Ordered Date',
      type: 'date'
    }
  ];

  // Use unified search hook
  const {
    searchQuery,
    filters: activeFilters,
    filteredData: filteredResults,
    setSearchQuery,
    setFilters,
    clearAll
  } = useUnifiedSearch({
    data: labResults,
    searchFields,
    caseSensitive: false
  });

  // Helper function to get result status from test results
  const getResultStatus = (labResult: LabResult): 'normal' | 'abnormal' | 'critical' => {
    if (labResult.status === 'critical') return 'critical';
    const hasCritical = labResult.results.some(r => r.status === 'critical');
    if (hasCritical) return 'critical';
    const hasAbnormal = labResult.results.some(r => r.status === 'abnormal' || r.status === 'high' || r.status === 'low');
    if (hasAbnormal) return 'abnormal';
    return 'normal';
  };

  const getStatusColor = (status: 'normal' | 'abnormal' | 'critical') => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'abnormal': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'critical': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
    }
  };

  const getStatusIcon = (status: 'normal' | 'abnormal' | 'critical') => {
    switch (status) {
      case 'normal': return '✅';
      case 'abnormal': return '⚠️';
      case 'critical': return '🚨';
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilters, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <>
      {/* Enhanced Search and Filter Controls */}
      <div className="mb-6">
        <SearchFilter
          searchFields={searchFields}
          searchPlaceholder="Search lab results by test type, patient ID, parameters, values, or notes..."
          filters={filters}
          onSearch={setSearchQuery}
          onFilter={setFilters}
          onClear={clearAll}
          defaultSearchValue=""
        />
      </div>

      <div className="grid gap-4">
        {paginatedResults.map((result) => (
          <div key={result.id} className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{result.testType}</h3>
                  <span className="text-lg">{getStatusIcon(getResultStatus(result))}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Patient ID: {result.patientId} • Test ID: {result.id}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(getResultStatus(result))}`}>
                {getResultStatus(result).toUpperCase()}
              </span>
            </div>

            {/* Lab Results Details */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Test Results</p>
              <div className="space-y-2">
                {result.results.map((testResult, index) => (
                  <div key={index} className="flex justify-between items-center bg-muted/30 p-2 rounded">
                    <div>
                      <span className="font-medium text-sm">{testResult.parameter}</span>
                      <span className={`ml-2 text-xs px-2 py-1 rounded ${
                        testResult.status === 'normal' ? 'bg-green-100 text-green-800' :
                        testResult.status === 'critical' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {testResult.status}
                      </span>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-semibold">
                        {testResult.value} {testResult.unit}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Ref: {testResult.referenceRange}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Ordered Date</p>
                <p className="font-semibold">{new Date(result.orderedDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Result Date</p>
                <p className="font-semibold">
                  {result.resultDate ? new Date(result.resultDate).toLocaleDateString() : 'Pending'}
                </p>
              </div>
            </div>

            {result.notes && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Notes</p>
                <p className="text-sm bg-muted/50 p-3 rounded">{result.notes}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button size="sm">View Details</Button>
              <Button size="sm" variant="outline">Download Report</Button>
              <Button size="sm" variant="outline">Share</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {labResults.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Show</span>
            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
              <SelectTrigger className="w-16 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <span>of {filteredResults.length} results</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return (
                    <span key={page} className="px-2 py-1 text-sm text-muted-foreground">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}