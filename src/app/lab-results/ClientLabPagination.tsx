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

interface LabResult {
  id: number;
  email: string;
  name: string;
  body: string;
  postId: number;
  testType: string;
  result: string;
  status: 'normal' | 'abnormal' | 'critical';
  date: string;
  patientId: number;
  reference: string;
}

interface ClientLabPaginationProps {
  labResults: LabResult[];
}

export function ClientLabPagination({ labResults }: ClientLabPaginationProps) {
  const getStatusColor = (status: LabResult['status']) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'abnormal': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'critical': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
    }
  };

  const getStatusIcon = (status: LabResult['status']) => {
    switch (status) {
      case 'normal': return '✅';
      case 'abnormal': return '⚠️';
      case 'critical': return '🚨';
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Pagination logic
  const totalPages = Math.ceil(labResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = labResults.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <>
      <div className="grid gap-4">
        {paginatedResults.map((result) => (
          <div key={result.id} className="bg-card rounded-lg p-6 border border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{result.testType}</h3>
                  <span className="text-lg">{getStatusIcon(result.status)}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Patient ID: {result.patientId} • Test ID: {result.id}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                {result.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Result Value</p>
                <p className="font-semibold">{result.result}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reference Range</p>
                <p className="font-semibold">{result.reference}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Test Date</p>
                <p className="font-semibold">{result.date}</p>
              </div>
            </div>

            {result.body && (
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Doctor&apos;s Notes</p>
                <p className="text-sm bg-muted/50 p-3 rounded">{result.body}</p>
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
            <span>of {labResults.length} results</span>
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