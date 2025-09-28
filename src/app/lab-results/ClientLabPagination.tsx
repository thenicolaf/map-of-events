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
import type { LabResult } from "@/shared/types/medical";

interface ClientLabPaginationProps {
  labResults: LabResult[];
}

export function ClientLabPagination({ labResults }: ClientLabPaginationProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  // Filter and search logic
  const filteredResults = labResults.filter((result) => {
    const matchesSearch =
      result.testType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.results.some(r => r.parameter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              r.value.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
      (result.notes && result.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    const resultStatus = getResultStatus(result);
    const matchesStatus = statusFilter === "all" || resultStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <>
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search lab results by test type, patient ID, or notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Results</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="abnormal">Abnormal</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
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