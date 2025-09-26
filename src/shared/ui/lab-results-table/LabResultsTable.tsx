'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LabResult {
  id: string;
  patient: string;
  patientId: string;
  testType: string;
  labId: string;
  category: string;
  status: 'Critical' | 'Completed' | 'Pending';
  priority: string;
}

// Extended mock data for pagination demonstration
const labResults: LabResult[] = [
  {
    id: "1",
    patient: "Maria Rodriguez",
    patientId: "P-2024-001",
    testType: "Complete Blood Count (CBC)",
    labId: "LAB-001",
    category: "Hematology",
    status: "Critical",
    priority: "ST"
  },
  {
    id: "2",
    patient: "John Smith",
    patientId: "P-2024-002",
    testType: "Lipid Panel",
    labId: "LAB-002",
    category: "Chemistry",
    status: "Completed",
    priority: "RC"
  },
  {
    id: "3",
    patient: "Emily Chen",
    patientId: "P-2024-003",
    testType: "Thyroid Function Tests",
    labId: "LAB-003",
    category: "Endocrinology",
    status: "Pending",
    priority: "RC"
  },
  {
    id: "4",
    patient: "Robert Johnson",
    patientId: "P-2024-004",
    testType: "Liver Function Tests",
    labId: "LAB-004",
    category: "Chemistry",
    status: "Completed",
    priority: "UR"
  },
  {
    id: "5",
    patient: "Sarah Williams",
    patientId: "P-2024-005",
    testType: "Glucose Tolerance Test",
    labId: "LAB-005",
    category: "Endocrinology",
    status: "Critical",
    priority: "ST"
  },
  {
    id: "6",
    patient: "Michael Brown",
    patientId: "P-2024-006",
    testType: "Cardiac Enzymes",
    labId: "LAB-006",
    category: "Cardiology",
    status: "Pending",
    priority: "UR"
  },
  {
    id: "7",
    patient: "Jessica Davis",
    patientId: "P-2024-007",
    testType: "Hemoglobin A1c",
    labId: "LAB-007",
    category: "Chemistry",
    status: "Completed",
    priority: "RC"
  },
  {
    id: "8",
    patient: "David Wilson",
    patientId: "P-2024-008",
    testType: "Vitamin D Level",
    labId: "LAB-008",
    category: "Endocrinology",
    status: "Completed",
    priority: "RC"
  },
  {
    id: "9",
    patient: "Lisa Garcia",
    patientId: "P-2024-009",
    testType: "Inflammatory Markers",
    labId: "LAB-009",
    category: "Immunology",
    status: "Critical",
    priority: "ST"
  },
  {
    id: "10",
    patient: "Kevin Lee",
    patientId: "P-2024-010",
    testType: "Kidney Function Panel",
    labId: "LAB-010",
    category: "Chemistry",
    status: "Pending",
    priority: "RC"
  },
  {
    id: "11",
    patient: "Amanda Taylor",
    patientId: "P-2024-011",
    testType: "Blood Gas Analysis",
    labId: "LAB-011",
    category: "Chemistry",
    status: "Completed",
    priority: "UR"
  },
  {
    id: "12",
    patient: "James Martinez",
    patientId: "P-2024-012",
    testType: "Tumor Markers",
    labId: "LAB-012",
    category: "Oncology",
    status: "Critical",
    priority: "ST"
  }
];

const getStatusVariant = (status: string): "destructive" | "secondary" | "outline" => {
  switch (status) {
    case 'Critical':
      return 'destructive';
    case 'Completed':
      return 'secondary';
    case 'Pending':
      return 'outline';
    default:
      return 'outline';
  }
};

export function LabResultsTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filter and search logic
  const filteredResults = useMemo(() => {
    return labResults.filter(result => {
      const matchesSearch =
        result.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.testType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All Status' || result.status === statusFilter;
      const matchesPriority = priorityFilter === 'All Priority' || result.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchQuery, statusFilter, priorityFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, priorityFilter, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold">Lab Results</h3>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search results..."
              className="pl-10 w-48 sm:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Filter className="h-4 w-4 mr-2" />
                {statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter('All Status')}>All Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Critical')}>Critical</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Completed')}>Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('Pending')}>Pending</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Filter className="h-4 w-4 mr-2" />
                {priorityFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setPriorityFilter('All Priority')}>All Priority</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter('ST')}>STAT</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter('RC')}>Routine</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPriorityFilter('UR')}>Urgent</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Test Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pri</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedResults.length > 0 ? (
            paginatedResults.map((result) => (
              <TableRow key={result.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{result.patient}</p>
                    <p className="text-sm text-muted-foreground">{result.patientId}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{result.testType}</p>
                    <p className="text-sm text-muted-foreground">{result.labId}</p>
                  </div>
                </TableCell>
                <TableCell>{result.category}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(result.status)}>
                    {result.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{result.priority}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No lab results found matching your criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>

      {/* Pagination Controls */}
      {filteredResults.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-border">
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
    </div>
  );
}