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
import type { Appointment } from "@/shared/types/medical";
import type { SearchFilterOption } from '@/shared/types/search';
import { MEDICAL_FILTERS } from '@/shared/types/search';

interface ClientPaginationProps {
  appointments: Appointment[];
}

export function ClientPagination({ appointments }: ClientPaginationProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Define search fields and filters for appointments
  const searchFields = [
    'reason',
    'patient.fullName',
    'doctor.fullName',
    'location',
    'notes',
    'type'
  ];

  const filters: SearchFilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [...MEDICAL_FILTERS.STATUS.APPOINTMENT]
    },
    {
      key: 'type',
      label: 'Appointment Type',
      type: 'select',
      options: [...MEDICAL_FILTERS.APPOINTMENT_TYPE]
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      options: [...MEDICAL_FILTERS.PRIORITY]
    },
    {
      key: 'dateTime',
      label: 'Date',
      type: 'date'
    }
  ];

  // Use unified search hook
  const {
    searchQuery,
    filters: activeFilters,
    filteredData: filteredAppointments,
    setSearchQuery,
    setFilters,
    clearAll
  } = useUnifiedSearch({
    data: appointments,
    searchFields,
    caseSensitive: false
  });

  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30";
      case "confirmed":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
      case "in-progress":
        return "text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30";
      case "completed":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
      case "cancelled":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
      case "no-show":
        return "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30";
      case "rescheduled":
        return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30";
      default:
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30";
    }
  };


  // Pagination logic
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

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
          searchPlaceholder="Search appointments by patient, doctor, reason, location, or notes..."
          filters={filters}
          onSearch={setSearchQuery}
          onFilter={setFilters}
          onClear={clearAll}
          defaultSearchValue=""
        />
      </div>

      <div className="grid gap-4">
        {paginatedAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-card rounded-lg p-6 border border-border"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{appointment.reason}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Patient: {appointment.patient.fullName} • {appointment.doctor.fullName}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  appointment.status
                )}`}
              >
                {appointment.status}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <span>📅 {new Date(appointment.dateTime).toLocaleDateString()}</span>
              <span>🕐 {new Date(appointment.dateTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}</span>
              <span>⏱️ {appointment.duration} min</span>
              <span>📍 {appointment.location}</span>
            </div>

            <p className="text-sm">{appointment.notes || `${appointment.type} appointment`}</p>

            <div className="flex items-center gap-2 mt-4">
              <Button size="sm" variant="outline">
                View Details
              </Button>
              <Button size="sm" variant="outline">
                Reschedule
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {appointments.length > 0 && (
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
            <span>of {filteredAppointments.length} appointments</span>
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