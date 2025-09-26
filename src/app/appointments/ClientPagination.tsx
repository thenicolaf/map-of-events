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

interface Appointment {
  id: number;
  title: string;
  body: string;
  userId: number;
  doctorName: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
}

interface ClientPaginationProps {
  appointments: Appointment[];
}

export function ClientPagination({ appointments }: ClientPaginationProps) {
  const getStatusColor = (status: Appointment["status"]) => {
    switch (status) {
      case "scheduled":
        return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30";
      case "completed":
        return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
      case "cancelled":
        return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
    }
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Pagination logic
  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = appointments.slice(startIndex, startIndex + itemsPerPage);

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
        {paginatedAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-card rounded-lg p-6 border border-border"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{appointment.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Patient ID: {appointment.userId} • {appointment.doctorName}
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
              <span>📅 {appointment.date}</span>
              <span>🕐 {appointment.time}</span>
            </div>

            <p className="text-sm">{appointment.body}</p>

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
            <span>of {appointments.length} appointments</span>
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